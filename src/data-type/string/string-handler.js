const StringOperation = require('./string-operation');
const OperationSequence = require('../../helper/operation-sequence');
const OTHandler = require('../ot-handler');

const EMPTY = 0;
const RETAIN = 1;
const INSERT = 2;
const DELETE = 3;

class StringHandler extends OTHandler {
  constructor() {
    super();
    this.operations = [];

    this.state = EMPTY;
    this.value = '';
  }

  flush() {
    switch (this.state) {
      case RETAIN:
        if (this.retainCount > 0) {
          this.operations.push(new StringOperation.Retain(this.retainCount));
        }
        break;
      case INSERT:
        if (this.value.length > 0) {
          const op = new StringOperation.Insert(this.value);

          const previous = this.operations[this.operations.length - 1];
          if (previous instanceof StringOperation.Delete) {
            this.operations[this.operations.length - 1] = op;
            this.operations.push(previous);
          } else {
            this.operations.push(op);
          }
        }
        break;
      case DELETE:
        if (this.value.length > 0) {
          this.operations.push(new StringOperation.Delete(this.value));
        }
        break;
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
    return new OperationSequence(this.operations);
  }
}

module.exports = StringHandler;
