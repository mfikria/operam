const EventEmitter = require('events');
const OperationManager = require('./operation-manager');

const SYNCHRONIZED = 0;
const AWAITING_CONFIRM = 1;
const AWAITING_CONFIRM_WITH_BUFFER = 2;

class Workspace {
  constructor(sync) {
    this.operationManager = new OperationManager();
    this.sync = sync;

    this.lastId = 0;

    this.state = SYNCHRONIZED;
    this.events = new EventEmitter();

    this.composing = null;
    this.composeDepth = 0;
  }

  connect() {
    return this.sync.connect(this.receive.bind(this))
            .then((initial) => {
              this.parentHistoryId = initial.historyId;
              this.current = initial.operation;
              this.operationId = initial.operationId;

              this.sync.on('change', this.receive.bind(this));

              return initial.operation;
            });
  }

  close() {
    this.sync.close();
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
      case SYNCHRONIZED:
        this.parentHistoryId = op.historyId;
        this.composeAndTriggerListeners(op.operation);
        break;
      case AWAITING_CONFIRM:
        if (this.lastSent.operationId === op.operationId) {
          this.parentHistoryId = op.historyId;
          this.state = SYNCHRONIZED;
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
      case AWAITING_CONFIRM_WITH_BUFFER:
        if (this.lastSent.operationId === op.operationId) {
          this.parentHistoryId = op.historyId;
          this.state = AWAITING_CONFIRM;

          this.lastSent = {
            historyId: op.historyId,
            operationId: this.buffer.operationId,
            operation: this.buffer.operation
          };
          this.sync.emitDocumentChange(this.lastSent);
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
    if (typeof this.parentHistoryId === 'undefined') {
      throw new Error('Workspace has not been connected');
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
      case SYNCHRONIZED:

        tagged = {
          historyId: this.parentHistoryId,
          operationId: `${this.operationId}-${this.lastId++}`,
          operation: op
        };

        this.state = AWAITING_CONFIRM;
        this.lastSent = tagged;
        this.sync.emitDocumentChange(tagged);
        break;
      case AWAITING_CONFIRM:

        tagged = {
          historyId: this.parentHistoryId,
          operationId: `${this.operationId}-${this.lastId++}`,
          operation: op
        };

        this.state = AWAITING_CONFIRM_WITH_BUFFER;
        this.buffer = tagged;
        break;
      case AWAITING_CONFIRM_WITH_BUFFER:

        this.buffer.operation = this.operationManager.compose(this.buffer.operation, op);
        break;
      default:
        throw new Error(`Unknown state: ${this.state}`);
    }

    this.events.emit('change', {
      operation: op,
      local: true
    });
  }

  composeAndTriggerListeners(op) {
    this.current = this.operationManager.compose(this.current, op);
    this.events.emit('change', {
      operation: op,
      local: false
    });
  }
}

Workspace.SYNCHRONIZED = SYNCHRONIZED;
Workspace.AWAITING_CONFIRM = AWAITING_CONFIRM;
Workspace.AWAITING_CONFIRM_WITH_BUFFER = AWAITING_CONFIRM_WITH_BUFFER;

module.exports = Workspace;
