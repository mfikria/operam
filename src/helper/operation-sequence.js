class OperationSequence {
  constructor(ops) {
    this.operations = ops;
  }

  apply(handler) {
    this.operations.forEach(op => op.apply(handler));
  }

  static asArray(op) {
    if (op instanceof OperationSequence) {
      return [...op.operations];
    } else if (op && op.apply) {
      return [op];
    }
    throw new Error(`Operation is invalid: ${op}`);
  }

  toString() {
    return `OperationSequence[${this.operations}]`;
  }
}

module.exports = OperationSequence;
