const DocumentManager = require('./document-manager');
const OperationManager = require('../operation/operation-manager');
const HistoryBuffer = require('./history-buffer');
const Event = require('../helper/events');
const Sleep = require('sleep');

class CentralServer {
  constructor(io) {
    this.documentManagers = [];
    this.io = io;
    this.handleEvents();
  }

  handleEvents() {
    this.io.on('connection', (socket) => {
      socket.on(Event.LOAD_DOCUMENT,
          operationWrapper => this.onDocumentLoad(socket, operationWrapper)
      );
      socket.on(Event.CHANGE_DOCUMENT,
          operationWrapper => this.onDocumentChange(operationWrapper)
      );
      socket.on(Event.CLOSE_DOCUMENT,
          operationWrapper => socket.leave(operationWrapper.documentId)
      );
    });
  }

  getDocumentManager(documentId) {
    if (!this.documentManagers[documentId]) {
      const historyBuffer = new HistoryBuffer(documentId);
      this.documentManagers[documentId] = new DocumentManager(historyBuffer);
    }
    return this.documentManagers[documentId];
  }

  static generateData(documentId, operationWrapper) {
    return {
      documentId,
      historyId: operationWrapper.historyId,
      operationId: operationWrapper.operationId,
      operation: OperationManager.serializeObject(operationWrapper.operation)
    };
  }

  onDocumentLoad(socket, operationWrapper) {
    const documentManager = this.getDocumentManager(operationWrapper.documentId);

    documentManager.latest()
            .then((latest) => {
              socket.join(operationWrapper.documentId);
              socket.emit(
                    Event.LOAD_DOCUMENT,
                    CentralServer.generateData(
                        operationWrapper.documentId,
                        latest
                    )
                );
            })
            .catch((e) => {
              throw new Error(`Error during document load: ${e.toString()}`);
            });
  }

  onDocumentChange(operationWrapper) {
    console.log('Wrapper:');
    console.dir(operationWrapper);
    console.log('Operation:');
    operationWrapper.operation.forEach(op => console.dir(op[3]));
    console.log('\n');
    const documentManager = this.getDocumentManager(operationWrapper.documentId);

    documentManager
            .store(
                operationWrapper.historyId,
                operationWrapper.operationId,
                OperationManager.deserializeObject(operationWrapper.operation)
            )
            .then((op) => {
              Sleep.sleep(Math.floor(Math.random() * 4));
              this.io.in(operationWrapper.documentId).emit(
                    Event.CHANGE_DOCUMENT,
                    CentralServer.generateData(operationWrapper.documentId, op)
                );
            })
            .catch((e) => {
              throw new Error(`Error during document change: ${e.toString()}`);
            });
  }
}

module.exports = CentralServer;
