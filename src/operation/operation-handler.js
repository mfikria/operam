const OperationSequence = require('../helper/operation-sequence');
const OperationWrapper = require('./operation-wrapper');

function idComparator(a, b) {
  return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
}

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
    const result = [];

    for (const key in this.operations) {
      if (!this.operations.hasOwnProperty(key)) continue;

      const value = this.operations[key];
      result.push(value);
    }

    result.sort(idComparator);
    return new OperationSequence(result);
  }
}

module.exports = OperationHandler;
