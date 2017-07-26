const OTConnector = require('./ot-connector');
const OperationBundle = require('../helper/operation-bundle');
const OperationManager = require('../operation/operation-manager');
const Event = require('../helper/events');

class SocketConnector extends OTConnector {
  constructor(socket, documentId) {
    super(documentId);
    this.socket = socket;
  }

  handleEvents() {
    return new Promise((resolve, reject) => {
      this.onDocumentChange();
      this.onDocumentLoad(resolve);
      this.onConnectError();
      this.onReconnect();
    });
  }

  connect() {
    this.socket.emit(Event.LOAD_DOCUMENT, {
      documentId: this.documentId
    });

    return this.handleEvents();
  }

  send(op) {
    this.socket.emit(Event.CHANGE_DOCUMENT, {
      documentId: this.documentId,
      historyId: op.historyId,
      operationId: op.operationId,
      operation: OperationManager.serializeObject(op.operation)
    });
  }

  close() {
    this.socket.emit(Event.CLOSE_DOCUMENT, {
      documentId: this.documentId
    });
  }

  onDocumentChange() {
    this.socket.on(Event.CHANGE_DOCUMENT, (data) => {
      console.log(data.toString());
      const operationBundle = new OperationBundle(
                data.historyId,
                data.operationId,
                OperationManager.deserializeObject(data.operation),
            );

      if (data.documentId === this.documentId) {
        this.events.emit(Event.CHANGE, operationBundle);
      }
    });
  }

  onDocumentLoad(resolve) {
    this.socket.on(Event.LOAD_DOCUMENT, (data) => {
      const operationBundle = new OperationBundle(
                data.historyId,
                data.operationId,
                OperationManager.deserializeObject(data.operation),
            );

      if (data.documentId === this.documentId) {
        resolve(operationBundle);
      }
    });
  }

  onConnectError() {
    this.socket.on(Event.CONNECT_ERROR, () => {
      console.log('connection error');
    });
  }

  onReconnect() {
    this.socket.on(Event.RECONNECT, () => {
      console.log('reconnecting');
    });
  }


}

module.exports = SocketConnector;
