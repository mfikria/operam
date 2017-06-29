class OperationWrapper {
  constructor(operationId, dataType, op) {
    this.operationId = operationId;
    this.dataType = dataType;
    this.operation = op;
  }

  apply(handler) {
    handler.setOperation(this.operationId, this.dataType, this.operation);
  }

  invert() {
    return new OperationWrapper(this.operationId, this.dataType, this.operation.invert());
  }

  toString() {
    return `Operation{id=${this.operationId}, type=${this.dataType}, operation=${this.operation}}`;
  }
}

module.exports = OperationWrapper;
