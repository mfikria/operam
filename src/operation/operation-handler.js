const OperationSequence = require('../helper/operation-sequence');
const OperationWrapper = require('./operation-wrapper');

class OperationHandler {
  constructor() {
    this.operations = [];
  }

  setOperation(operationId, dataType, op) {
    if (this.operations[operationId]) {
      throw new Error(`Operation has been set. operationId: \`${operationId}\``);
    }

    this.operations[operationId] = new OperationWrapper(operationId, dataType, op);
    return this;
  }

  done() {
    return new OperationSequence(Object.values(this.operations));
  }
}

module.exports = OperationHandler;
