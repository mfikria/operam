const OTConnector = require('./ot-connector');
const OperationBundle = require('../helper/operation-bundle');
const OperationManager = require('../operation/operation-manager');
const Event = require('../helper/events');
const StackTrace = require('stacktrace-js');

class SocketConnector extends OTConnector {
  constructor(socket, documentId) {
    super(documentId);
    this.socket = socket;
    this.t0 = window.performance.now();
    this.t1 = 0;
  }

  handleEvents() {
    return new Promise((resolve, reject) => {
      this.onDocumentChange();
      this.onDocumentLoad(resolve);
      this.onDisconnect();
    });
  }

  connect(historyId) {
    this.socket.emit(Event.LOAD_DOCUMENT, {
      documentId: this.documentId,
      historyId
    });

    return this.handleEvents();
  }

  send(op) {
    console.log('send:');
    console.log(`HistoryId: ${op.historyId}`);
    console.dir(op);
    // const callback = function (stackframes) {
    //   const stringifiedStack = stackframes.map(sf => sf.toString()).join('\n');
    //   console.log(stringifiedStack);
    // };
    //
    // const errback = function (err) {
    //   console.log(err.message);
    // };
    //
    // StackTrace.get().then(callback).catch(errback);
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
      const operationBundle = new OperationBundle(
                data.historyId,
                data.operationId,
                OperationManager.deserializeObject(data.operation),
            );
      console.log('receive:');
      console.dir(data);
      if (data.documentId === this.documentId) {
        this.events.emit(Event.CHANGE, operationBundle);
      }
    });
  }

  onDocumentLoad(resolve) {
    this.socket.on(Event.LOAD_DOCUMENT, (data) => {
      console.dir(this.socket);
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

  onDisconnect() {
    this.socket.on(Event.DISCONNECT, () => {
      console.log('disconneted');
      console.dir(this.socket.sendBuffer);
    });
  }
}

module.exports = SocketConnector;
