const DocumentManager = require('./document-manager');
const OperationManager = require('../operation/operation-manager');
const HistoryBuffer = require('./history-buffer');
const Event = require('../helper/events');
const Sleep = require('sleep');

class CentralServer {
  constructor(io) {
    this.documentManagers = [];
    this.io = io;

    this.io.on('connection', (socket) => {
      socket.on(Event.LOAD_DOCUMENT,
              data => this.onDocumentLoad(socket, data.documentId)
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

  static generateData(documentId, bundle) {
    return {
      documentId,
      userId: bundle.userId,
      historyId: bundle.historyId,
      operationId: bundle.operationId,
      operation: OperationManager.serializeObject(bundle.operation)
    };
  }

  onDocumentLoad(socket, documentId) {
    const documentManager = this.getDocumentManager(documentId);
    documentManager.latest().then((latest) => {
      socket.join(documentId);
      socket.emit(
                Event.LOAD_DOCUMENT,
                CentralServer.generateData(
                    documentId,
                    latest
                )
            );
    }).catch((e) => {
      throw new Error(`Error during document load: ${e.toString()}`);
    });
  }

  onDocumentChange(bundle) {
    bundle.operation.forEach(op => console.dir(op[3]));
    const documentManager = this.getDocumentManager(bundle.documentId);
    documentManager.store(
                bundle.historyId,
                bundle.operationId,
                OperationManager.deserializeObject(bundle.operation)
            ).then((op) => {
                // Sleep.sleep(Math.floor(Math.random() * 4));
              op.userId = bundle.userId;
              this.io.in(bundle.documentId).emit(
                    Event.CHANGE_DOCUMENT,
                    CentralServer.generateData(bundle.documentId, op)
                );
            }).catch((e) => {
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
            })
            .catch((e) => {
              throw new Error(`Error during document change: ${e.toString()}`);
            });
  }
}

module.exports = CentralServer;
