const OperationSequence = require('../helper/operation-sequence');
const OperationWrapper = require('./operation-wrapper');

class OperationHandler {
  constructor() {
    this.ops = [];
  }

  setOperation(operationId, dataType, op) {
    if (this.ops[operationId]) {
      throw new Error(`Operation has been set. operationId: \`${operationId}\``);
    }

    this.ops[operationId] = new OperationWrapper(operationId, dataType, op);
    return this;
  }

  done() {
    return new OperationSequence(Object.values(this.ops));
  }
}

module.exports = OperationHandler;
