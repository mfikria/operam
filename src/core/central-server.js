const WorkspaceManager = require('./workspace-manager');
const HistoryBuffer = require('./history-buffer');
const Event = require('../helper/events');

class CentralServer {
  constructor(io) {
    this.workspaceManagers = [];
    this.io = io;
    this.handleEvents();
  }

  handleEvents() {
    this.io.on('connection', (socket) => {
      socket.on(Event.LOAD_DOCUMENT, data => this.emitDocumentLoad(socket, data));
      socket.on(Event.CHANGE_DOCUMENT, data => this.emitDocumentChange(socket, data));
      socket.on(Event.CLOSE_DOCUMENT, (data) => {
        socket.leave(data.documentId);
      });
    });
  }

  getWorkspaceManager(documentId) {
    if (!this.workspaceManagers[documentId]) {
      const historyBuffer = new HistoryBuffer(documentId);
      this.workspaceManagers[documentId] = new WorkspaceManager(historyBuffer);
    }
    return this.workspaceManagers[documentId];
  }

  static generateData(workspaceManager, operationId, operationWrapper) {
    return {
      documentId: operationId,
      historyId: operationWrapper.historyId,
      operationId: operationWrapper.operationId,
      operation: workspaceManager.operationManager.serializeObject(operationWrapper.operation)
    };
  }

  emitDocumentLoad(socket, operationWrapper) {
    const workspaceManager = this.getWorkspaceManager(operationWrapper.documentId);

    workspaceManager.latest()
            .then((latest) => {
              console.log(latest.operation.toString());
              socket.join(operationWrapper.documentId);

              socket.emit(
                    Event.LOAD_DOCUMENT,
                    CentralServer.generateData(
                        workspaceManager,
                        operationWrapper.documentId,
                        latest
                    )
                );
            })
            .catch((e) => {
              throw new Error(`Error during document load: ${e.toString()}`);
            });
  }

  emitDocumentChange(socket, data) {
    const workspaceManager = this.getWorkspaceManager(data.documentId);

    workspaceManager
            .store(
                data.historyId,
                data.operationId,
                workspaceManager.operationManager.deserializeObject(data.operation)
            )
            .then((op) => {
              this.io.in(data.documentId).emit(
                    Event.CHANGE_DOCUMENT,
                    CentralServer.generateData(workspaceManager, data.documentId, op)
                );
            })
            .catch((e) => {
              throw new Error(`Error during document emit document change: ${e.toString()}`);
            });
  }
}

module.exports = CentralServer;
