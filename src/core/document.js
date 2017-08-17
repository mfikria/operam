const EventEmitter = require('events');
const OperationManager = require('../operation/operation-manager');
const OperationBundle = require('../helper/operation-bundle');
const Event = require('../helper/events');
const StackTrace = require('stacktrace-js');
const UUIDv4 = require('uuid/v4');

class Document {
  constructor(connector, userId) {
    this.operationManager = new OperationManager();
    this.connector = connector;
    this.userId = userId;

    this.state = Document.SYNCHRONIZED;
    this.events = new EventEmitter();
    this.parentHistoryId = 0;

    this.composing = null;
    this.composeDepth = 0;
    this.lastSent = null;
    this.current = null;

    this.connector.socket.on(Event.RECONNECT, () => {
      console.log('reconnect:');
      console.dir(this.connector.socket.sendBuffer);
      console.log(this.parentHistoryId);
      console.dir(this.lastSent);
      console.dir(this.buffer);

      this.connector.socket.emit(Event.RELOAD_DOCUMENT, {
        historyId: this.parentHistoryId,
        documentId: this.connector.documentId
      });
    });
  }

  open() {
    return this.connector.connect()
            .then((initial) => {
              this.parentHistoryId = initial.historyId;
              this.current = initial.operation;
              this.operationId = initial.operationId;

              this.connector.on(Event.CHANGE, this.receive.bind(this));

              return initial.operation;
            });
  }

  close() {
    this.connector.disconnect();
  }

  performEdit(callback) {
    this.composeDepth++;
    try {
      return callback();
    } finally {
      if (--this.composeDepth === 0 && this.composing) {
        this.apply(this.composing);
        this.composing = null;
      }
    }
  }

  on(event, listener) {
    return this.events.on(event, listener);
  }

  removeEventListener(event, listener) {
    this.events.removeListener(event, listener);
  }

  receive(bundle) {
    switch (this.state) {
      case Document.SYNCHRONIZED:
        this.parentHistoryId = bundle.historyId;
        this.triggerChange(bundle.operation);
        break;

      case Document.WAITING_ACK:
        if ((this.lastSent.operationId === bundle.operationId || this.lastSent.operation.operations[0].operationId === bundle.operationId)
            && this.userId === bundle.userId
            ) {
          this.parentHistoryId = bundle.historyId;
          this.state = Document.SYNCHRONIZED;
        } else {
          const transformed = this.operationManager.transform(
              bundle.operation,
              this.lastSent.operation
          );


          this.lastSent = new OperationBundle(
              this.userId,
              bundle.historyId,
              this.lastSent.operationId,
              transformed.right
          );

          this.parentHistoryId = bundle.historyId;
          this.triggerChange(transformed.left);
        }
        break;

      case Document.WAITING_ACK_WITH_BUFFER:
        if ((this.lastSent.operationId === bundle.operationId || this.lastSent.operation.operations[0].operationId === bundle.operationId)
            && this.userId === bundle.userId
            ) {
          this.parentHistoryId = bundle.historyId;
          this.state = Document.WAITING_ACK;

          this.lastSent = new OperationBundle(
              this.userId,
              bundle.historyId,
              this.buffer.operationId,
              this.buffer.operation
          );
          this.connector.send(this.lastSent);
        } else {
          let transformed = this.operationManager.transform(
              bundle.operation,
              this.lastSent.operation,
          );


          this.lastSent = new OperationBundle(
            this.userId,
            bundle.historyId,
            this.lastSent.operationId,
            transformed.right
          );


          transformed = this.operationManager.transform(
              this.buffer.operation,
              transformed.left,
          );

          this.buffer = new OperationBundle(
            this.userId,
            bundle.historyId,
            this.buffer.operationId,
            transformed.left
          );

          this.parentHistoryId = bundle.historyId;
          this.triggerChange(transformed.right);
        }
        break;
      default:
        throw new Error(`Unknown state: ${this.state}`);
    }
  }

  apply(op) {
      const callback = function (stackframes) {
          const stringifiedStack = stackframes.map(sf => sf.toString()).join('\n');
          console.log(stringifiedStack);
      };

      const errback = function (err) {
          console.log(err.message);
      };

      StackTrace.get().then(callback).catch(errback);
    if (this.composeDepth > 0) {
      if (this.composing) {
        this.composing = this.operationManager.compose(this.composing, op);
      } else {
        this.composing = op;
      }

      return;
    }

    this.current = this.operationManager.compose(this.current, op);

    let bundle;
    switch (this.state) {
      case Document.SYNCHRONIZED:

        bundle = new OperationBundle(
            this.userId,
            this.parentHistoryId,
            UUIDv4(),
            op
        );

        this.state = Document.WAITING_ACK;
        this.lastSent = bundle;
        this.connector.send(bundle);
        break;

      case Document.WAITING_ACK:

        bundle = new OperationBundle(
            this.userId,
            this.parentHistoryId,
            UUIDv4(),
            op
        );

        this.state = Document.WAITING_ACK_WITH_BUFFER;
        this.buffer = bundle;
        break;

      case Document.WAITING_ACK_WITH_BUFFER:
        this.buffer.operation = this.operationManager.compose(this.buffer.operation, op);
        break;

      default:
        throw new Error('Invalid state');
    }

    this.events.emit(Event.CHANGE, {
      operation: op,
      local: true
    });
  }

  triggerChange(op) {
    this.current = this.operationManager.compose(this.current, op);
    this.events.emit(Event.CHANGE, {
      operation: op,
      local: false
    });
  }
}

Document.SYNCHRONIZED = 0;
Document.WAITING_ACK = 1;
Document.WAITING_ACK_WITH_BUFFER = 2;

module.exports = Document;
