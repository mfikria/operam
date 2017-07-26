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
    if (this.operations.length > 0) {
      const values = Object.keys(this.operations).map(function (key) {
        return this.operations[key];
      });
      return new OperationSequence(values);
    }
    return new OperationSequence([]);
  }
}

module.exports = OperationHandler;
