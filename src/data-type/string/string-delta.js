const ops = require('./string-operation');
const OperationSequence = require('../../helper/operation-sequence');

const EMPTY = 0;
const RETAIN = 1;
const INSERT = 2;
const DELETE = 3;

class StringDelta {
  constructor() {
    this.ops = [];

    this.state = EMPTY;
    this.value = '';
  }

  flush() {
    switch (this.state) {
      case RETAIN:
        if (this.retainCount > 0) {
          this.ops.push(new ops.Retain(this.retainCount));
        }
        break;
      case INSERT:
        if (this.value.length > 0) {
          const op = new ops.Insert(this.value);

          const previous = this.ops[this.ops.length - 1];
          if (previous instanceof ops.Delete) {
            this.ops[this.ops.length - 1] = op;
            this.ops.push(previous);
          } else {
            this.ops.push(op);
          }
        }
        break;
      case DELETE:
        if (this.value.length > 0) {
          this.ops.push(new ops.Delete(this.value));
        }
        break;
      default:
        throw new Error('Operation is not defined');
    }

    this.retainCount = 0;
    this.value = '';
  }

  retain(length) {
    if (length <= 0) return;

    if (this.state !== RETAIN) {
      this.flush();
      this.state = RETAIN;
    }

    this.retainCount += length;
    return this;
  }

  insert(value) {
    if (this.state !== INSERT) {
      this.flush();
      this.state = INSERT;
    }

    this.value += value;
    return this;
  }

  delete(value) {
    if (this.state !== DELETE) {
      this.flush();
      this.state = DELETE;
    }

    this.value += value;
    return this;
  }

  done() {
    this.flush();
    return new OperationSequence(this.ops);
  }
}

module.exports = StringDelta;
