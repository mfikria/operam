const EventEmitter = require('events');
const OperationManager = require('../operation/operation-manager');
const Event = require('../helper/events');
const StackTrace = require('stacktrace-js');

class Document {
  constructor(connector) {
    this.operationManager = new OperationManager();
    this.connector = connector;

    this.lastId = 0;

    this.state = Document.SYNCHRONIZED;
    this.events = new EventEmitter();

    this.composing = null;
    this.composeDepth = 0;
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
    this.connector.close();
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

  receive(op) {
    switch (this.state) {
      case Document.SYNCHRONIZED:
        this.parentHistoryId = op.historyId;
        this.composeAndTriggerListeners(op.operation);
        break;
      case Document.IN_OLDER_STATE:
        if (this.lastSent.operationId === op.operationId) {
          this.parentHistoryId = op.historyId;
          this.state = Document.SYNCHRONIZED;
        } else {
          const transformed = this.operationManager.transform(
                        op.operation,
                        this.lastSent.operation,
                    );


          this.lastSent = {
            historyId: op.historyId,
            operationId: this.lastSent.operationId,
            operation: transformed.right
          };

          this.parentHistoryId = op.historyId;
          this.composeAndTriggerListeners(transformed.left);
        }
        break;
      case Document.IN_NEWER_STATE:
        if (this.lastSent.operationId === op.operationId) {
          this.parentHistoryId = op.historyId;
          this.state = Document.IN_OLDER_STATE;

          this.lastSent = {
            historyId: op.historyId,
            operationId: this.buffer.operationId,
            operation: this.buffer.operation
          };
          this.connector.send(this.lastSent);
        } else {
          let transformed = this.operationManager.transform(
                        op.operation,
                        this.lastSent.operation,
                    );


          this.lastSent = {
            historyId: op.historyId,
            operationId: this.lastSent.operationId,
            operation: transformed.right
          };


          transformed = this.operationManager.transform(
                        this.buffer.operation,
                        transformed.left,
                    );

          this.buffer = {
            historyId: op.historyId,
            operationId: this.buffer.operationId,
            operation: transformed.left
          };

          this.parentHistoryId = op.historyId;
          this.composeAndTriggerListeners(transformed.right);
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

    if (typeof this.parentHistoryId === 'undefined') {
      throw new Error('Document has not been connected');
    }

    if (this.composeDepth > 0) {
      if (this.composing) {
        this.composing = this.operationManager.compose(this.composing, op);
      } else {
        this.composing = op;
      }

      return;
    }

    this.current = this.operationManager.compose(this.current, op);

    let tagged;
    switch (this.state) {
      case Document.SYNCHRONIZED:

        tagged = {
          historyId: this.parentHistoryId,
          operationId: `${this.operationId}-${this.lastId++}`,
          operation: op
        };

        this.state = Document.IN_OLDER_STATE;
        this.lastSent = tagged;
        this.connector.send(tagged);
        break;
      case Document.IN_OLDER_STATE:

        tagged = {
          historyId: this.parentHistoryId,
          operationId: `${this.operationId}-${this.lastId++}`,
          operation: op
        };

        this.state = Document.IN_NEWER_STATE;
        this.buffer = tagged;
        break;
      case Document.IN_NEWER_STATE:
        this.buffer.operation = this.operationManager.compose(this.buffer.operation, op);
        break;
      default:
        throw new Error(`Unknown state: ${this.state}`);
    }

    this.events.emit(Event.CHANGE, {
      operation: op,
      local: true
    });
  }

  composeAndTriggerListeners(op) {
    this.current = this.operationManager.compose(this.current, op);
    this.events.emit(Event.CHANGE, {
      operation: op,
      local: false
    });
  }
}

Document.SYNCHRONIZED = 0;
Document.IN_OLDER_STATE = 1;
Document.IN_NEWER_STATE = 2;

module.exports = Document;
