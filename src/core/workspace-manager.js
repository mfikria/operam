const uuidv4 = require('uuid/v4');

const locallock = require('../helper/local-lock');
const OperationBundle = require('../helper/operation-bundle');
const OperationManager = require('./operation-manager');

class WorkspaceManager {
  constructor(historyBuffer) {
    this.historyBuffer = historyBuffer;
    this.operationManager = new OperationManager();

    this.lock = locallock();
  }

  latest() {
    return this.historyBuffer.latest()
            .then(id => this.historyBuffer.until(id + 1)
                .then((items) => {
                  const sessionId = uuidv4();

                  const composer = this.operationManager.newOperationComposer();
                  items.forEach((item) => {
                    composer.add(item);
                  });

                  const composed = composer.done();
                  return new OperationBundle(id, sessionId, composed);
                }));
  }

  store(historyId, operationId, op) {
    return this.lock((done) => {
      let toStore;
      this.historyBuffer.from(historyId + 1)
                .then((items) => {
                  const operationManager = this.operationManager;

                  const composer = operationManager.newOperationComposer();
                  items.forEach((item) => {
                    composer.add(item);
                  });
                  const composed = composer.done();

                  if (composed) {
                    const transformed = operationManager.transform(composed, op);
                    toStore = transformed.right;
                  } else {
                    toStore = op;
                  }

                  return this.historyBuffer.store(toStore);
                })
                .then((historyId) => {
                  done(null, new OperationBundle(historyId, operationId, toStore));
                })
                .catch(err => done(err));
    });
  }
}

module.exports = WorkspaceManager;
