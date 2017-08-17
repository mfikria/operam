const DocumentManager = require('./document-manager');
const OperationManager = require('../operation/operation-manager');
const HistoryBuffer = require('./history-buffer');
const Event = require('../helper/events');
const Sleep = require('sleep');
const average = (array) => array.reduce((a, b) => a + b) / array.length;

class CentralServer {
  constructor(io) {
    this.documentManagers = [];
    this.io = io;
    this.handleEvents();
    
  }

  handleEvents() {
    this.io.on('connection', (socket) => {
      socket.on(Event.LOAD_DOCUMENT,
                data => this.onDocumentLoad(socket, data.documentId, data.historyId)
            );
      socket.on(Event.RELOAD_DOCUMENT,
                data => this.onReloadDocument(socket, data.historyId, data.documentId, data.operationId)
            );
      socket.on(Event.CHANGE_DOCUMENT,
                data => this.onDocumentChange(data)
            );
      socket.on(Event.CLOSE_DOCUMENT,
                data => socket.leave(data.documentId)
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

  onDocumentLoad(socket, documentId, historyId) {
    const documentManager = this.getDocumentManager(documentId);
    if(historyId == -1) {
        documentManager.latest()
            .then((latest) => {
                socket.join(documentId);
                socket.emit(
                    Event.LOAD_DOCUMENT,
                    CentralServer.generateData(
                        documentId,
                        latest
                    )
                );
            })
            .catch((e) => {
                throw new Error(`Error during document load: ${e.toString()}`);
            });
    } else {
        documentManager.until(historyId)
            .then((latest) => {
                socket.join(documentId);
                socket.emit(
                    Event.LOAD_DOCUMENT,
                    CentralServer.generateData(
                        documentId,
                        latest
                    )
                );
            })
            .catch((e) => {
                throw new Error(`Error during document load: ${e.toString()}`);
            });
    }

  }

  onDocumentChange(operationWrapper) {

    operationWrapper.operation.forEach(op => console.dir(op[3]));
    const documentManager = this.getDocumentManager(operationWrapper.documentId);
    documentManager
            .store(
                operationWrapper.historyId,
                operationWrapper.operationId,
                OperationManager.deserializeObject(operationWrapper.operation)
            )
            .then((op) => {
                // Sleep.sleep(Math.floor(Math.random() * 4));
              this.io.in(operationWrapper.documentId).emit(
                    Event.CHANGE_DOCUMENT,
                    CentralServer.generateData(operationWrapper.documentId, op)
                );
            })
            .catch((e) => {
              throw new Error(`Error during document change: ${e.toString()}`);
            });

  }

  onReloadDocument(socket, historyId, documentId, operationId) {
    socket.join(documentId);
    const documentManager = this.getDocumentManager(documentId);
    documentManager.reloadDocument(historyId, operationId)
            .then((ops) => {
                // Sleep.sleep(Math.floor(Math.random() * 4));
              ops.forEach((op) => {
                socket.emit(
                        Event.CHANGE_DOCUMENT,
                        CentralServer.generateData(documentId, op)
                    );
              });
              // socket.emit(
              //       Event.CHANGE_DOCUMENT,
              //       CentralServer.generateData(documentId, ops)
              //   );
            })
            .catch((e) => {
              throw new Error(`Error during document change: ${e.toString()}`);
            });
  }
}

module.exports = CentralServer;
