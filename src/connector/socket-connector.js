const AbstractConnector = require('./abstract-connector');
const OperationBundle = require('../helper/operation-bundle');
const OperationManager = require('../core/operation-manager');
const Event = require('../helper/events');

class SocketConnector extends AbstractConnector {
  constructor(socket, documentId) {
    super(documentId);
    this.socket = socket;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.onDocumentChange();
      this.onDocumentLoad(resolve);
      this.emitDocumentLoad();
      this.onConnectError();
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
        this.events.emit('change', operationBundle);
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
    this.socket.on('disconnect', () => {
      console.log('test debug');
    });
  }

  emitDocumentLoad() {
    this.socket.emit(Event.LOAD_DOCUMENT, {
      documentId: this.documentId
    });
  }

  emitDocumentChange(op) {
    console.dir(op);
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

}

module.exports = SocketConnector;
