

class OperationSequence {
  constructor(ops) {
    this.ops = ops;
  }

  get operations() {
    return this.ops;
  }

  set operations(ops) {
    throw 'Can not set operations';
  }

  apply(handler) {
    this.ops.forEach(op => op.apply(handler));
  }

  static asArray(op) {
    if (op instanceof OperationSequence) {
      return op.operations.slice(0);
    } else if (op && op.apply) {
      return [op];
    }
    throw new Error(`No valid operation specified: ${op}`);
  }

  toString() {
    return `OperationSequence[${this.ops}]`;
  }
}

module.exports = OperationSequence;
