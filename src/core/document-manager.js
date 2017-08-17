const UUIDv4 = require('uuid/v4');
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
                  const operationId = UUIDv4();

                  const composer = this.operationManager.newOperationComposer();
                  items.forEach((item) => {
                    composer.add(item);
                  });

                  const composedOperation = composer.done();
                  return new OperationBundle(0, historyId, operationId, composedOperation);
                })
        );
  }

  until(historyId) {
    return this.historyBuffer.until(historyId + 1)
              .then((items) => {
                const operationId = UUIDv4();

                const composer = this.operationManager.newOperationComposer();
                items.forEach((item) => {
                  composer.add(item);
                });

                const composedOperation = composer.done();
                return new OperationBundle(0, historyId, operationId, composedOperation);
              });
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
                  return this.historyBuffer.store(toStore);
                })
                .then((id) => {
                  done(null, new OperationBundle(0, id, operationId, toStore));
                })
                .catch(err => done(err));
    });
  }

  reloadDocument(historyId, token) {
    // return this.historyBuffer.from(historyId + 1)
    //       .then((ops) => {
    //         let composer = this.operationManager.newOperationComposer();
    //         const arr = [];
    //         let i = historyId;
    //         console.log(operationId);
    //         ops.forEach((op) => {
    //           console.dir(op.operationId);
    //           if (op.operationId == operationId) {
    //             const composed = composer.done();
    //             if (composed) {
    //               arr.push(new OperationBundle(i, UUIDv4(), composed));
    //             }
    //             arr.push(new OperationBundle(i + 1, operationId, op));
    //             composer = this.operationManager.newOperationComposer();
    //           } else {
    //             composer.add(op);
    //           }
    //           i += 1;
    //         });
    //
    //         return Promise.resolve(arr);
    //       });
    // return this.lock((done) => {
    return this.historyBuffer.from(historyId + 1)
              .then((ops) => {
                let composer = this.operationManager.newOperationComposer();
                const arr = [];
                let i = historyId;
                ops.forEach((op) => {
                  if (op.operations[0].token === token) {
                    const composed = composer.done();
                    if (composed) {
                      arr.push(new OperationBundle(0, i, UUIDv4(), composed));
                    }
                    arr.push(new OperationBundle(0, i + 1, token, op));
                    composer = this.operationManager.newOperationComposer();
                  } else {
                    composer.add(op);
                  }
                  i += 1;
                });
                const composed = composer.done();
                if (composed) {
                  arr.push(new OperationBundle(0, i, UUIDv4(), composed));
                }
                return Promise.resolve(arr);
              });
    // });
  }
}

module.exports = DocumentManager;
