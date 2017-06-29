class OperationSequence {
  constructor(ops) {
    this.ops = ops;
  }

  apply(handler) {
    this.ops.forEach(op => op.apply(handler));
  }

  static asArray(op) {
    if (op instanceof OperationSequence) {
      return [...op.ops];
    } else if (op && op.apply) {
      return [op];
    }
    throw new Error(`Operation is invalid: ${op}`);
  }

  toString() {
    return `OperationSequence[${this.ops}]`;
  }
}

module.exports = OperationSequence;
