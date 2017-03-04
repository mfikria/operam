

const OperationSequence = require('./operation-sequence');

class OperationIterator {
  constructor(op, comparator) {
    const ops = OperationSequence.asArray(op);
    if (comparator) {
      ops.sort(comparator);
    }

    this.index = 0;
    this.ops = ops;
  }

  get hasNext() {
    return this.index < this.ops.length;
  }

  next() {
    if (this.index >= this.ops.length) {
      throw 'No more operations available';
    }

    const result = this.ops[this.index];
    this.index++;
    return result;
  }

  back() {
    if (this.index === 0) {
      throw 'Can not go back, iteration not started';
    }

    this.index--;
  }

  replace(op) {
    if (this.index === 0) {
      throw 'Can not replace, iteration not started';
    }

    this.index--;
    this.ops[this.index] = op;
  }
}

module.exports = OperationIterator;
