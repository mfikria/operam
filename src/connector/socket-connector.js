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
      this.onDisconnect();
    });
  }

  connect() {
    this.socket.emit(Event.LOAD_DOCUMENT, {
      documentId: this.documentId
    });

    return this.handleEvents();
  }

  send(bundle) {
    console.log('send:');
    console.log(`HistoryId: ${bundle.historyId}`);
    console.dir(bundle);

    this.socket.emit(Event.CHANGE_DOCUMENT, {
      documentId: this.documentId,
      userId: bundle.userId,
      historyId: bundle.historyId,
      operationId: bundle.operationId,
      operation: OperationManager.serializeObject(bundle.operation)
    });
  }

  close() {
    this.socket.emit(Event.CLOSE_DOCUMENT, {
      documentId: this.documentId
    });
  }

  onDocumentChange() {
    this.socket.on(Event.CHANGE_DOCUMENT, (data) => {
      const bundle = new OperationBundle(
          data.userId,
          data.historyId,
          data.operationId,
          OperationManager.deserializeObject(data.operation),
      );
      console.log('receive:');
      console.dir(data);

      if (data.documentId === this.documentId) {
        this.events.emit(Event.CHANGE, bundle);
      }
    });
  }

  onDocumentLoad(resolve) {
    this.socket.on(Event.LOAD_DOCUMENT, (data) => {
      const bundle = new OperationBundle(
        data.userId,
        data.historyId,
        data.operationId,
        OperationManager.deserializeObject(data.operation),
      );

      if (data.documentId === this.documentId) {
        resolve(bundle);
      }
    });
  }

  onDisconnect() {
    this.socket.on(Event.DISCONNECT, () => {
      console.log('disconneted');
      console.dir(this.socket.sendBuffer);
    });
  }
}

module.exports = SocketConnector;
