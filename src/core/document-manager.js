const uuidv4 = require('uuid/v4');

const locallock = require('../helper/local-lock');
const OperationBundle = require('../helper/operation-bundle');
const OperationManager = require('../operation/operation-manager');

class DocumentManager {
  constructor(historyBuffer) {
    this.historyBuffer = historyBuffer;
    this.operationManager = new OperationManager();

    this.lock = locallock();
  }

  latest() {
    return this.historyBuffer.latest()
        .then(historyId => this.historyBuffer.until(historyId + 1)
                .then((items) => {
                  const operationId = uuidv4();

                  const composer = this.operationManager.newOperationComposer();
                  items.forEach((item) => {
                    composer.add(item);
                  });

                  const composedOperation = composer.done();
                  return new OperationBundle(historyId, operationId, composedOperation);
                })
        );
  }

  store(historyId, operationId, op) {
    return this.lock((done) => {
      let toStore;
      this.historyBuffer.from(historyId + 1)
                .then((ops) => {
                  const composer = this.operationManager.newOperationComposer();
                  ops.forEach((op) => {
                    composer.add(op);
                  });
                  const composedOperation = composer.done();

                  if (composedOperation) {
                    const transformed = this.operationManager.transform(composedOperation, op);
                    toStore = transformed.right;
                  } else {
                    toStore = op;
                  }
                  this.historyBuffer.storeIndex(operationId);
                  return this.historyBuffer.store(toStore);
                })
                .then((id) => {
                  done(null, new OperationBundle(id, operationId, toStore));
                })
                .catch(err => done(err));
    });
  }

  reloadDocument(historyId, operationId) {
    return this.historyBuffer.from(historyId + 1)
          .then((ops) => {
            let composer = this.operationManager.newOperationComposer();
            const arr = [];
            let i = historyId + 1;
            ops.forEach((op) => {
              if (this.historyBuffer.operationIndex[i] === operationId) {
                const composed = composer.done();
                if (composed) {
                  arr.push(new OperationBundle(
                                  i - 1,
                              this.historyBuffer.operationIndex[i],
                              composed
                              )
                          );
                }
                arr.push(new OperationBundle(i, operationId, op));
                composer = this.operationManager.newOperationComposer();
              } else {
                composer.add(op);
              }
              i += 1;
            });

            return arr;
          });
  }
}

module.exports = DocumentManager;
