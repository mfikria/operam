class CentralServer {
  constructor(io) {
    this.workspaceManagers = [];
    this.io = io;
    this.handleEvents();
  }

  handleEvents() {

  }

  getWorkspaceManager(documentId) {

  }

  static generateData(workspaceManager, operationId, operationWrapper) {

  }

  emitDocumentLoad(socket, operationWrapper) {

  }

  emitDocumentChange(socket, data) {

  }
}

module.exports = CentralServer;
