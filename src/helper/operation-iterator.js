const OperationSequence = require('./operation-sequence');

class OperationIterator {
  constructor(op, comparator) {
    this.index = 0;
    this.operations = OperationSequence.asArray(op);
    if (comparator) {
      this.operations.sort(comparator);
    }
  }

  hasNext() {
    return this.index < this.operations.length;
  }

  next() {
    if (!this.hasNext()) {
      throw new Error('No more operations available');
    }
    const result = this.operations[this.index];
    this.index += 1;
    return result;
  }

  back() {
    if (this.index <= 0) {
      throw new Error('Cannot go back, no more operations available');
    }
    this.index -= 1;
  }

  replace(op) {
    if (this.index <= 0) {
      throw new Error('Cannot replace, no more operations available');
    }
    this.index -= 1;
    this.operations[this.index] = op;
  }
}

module.exports = OperationIterator;
