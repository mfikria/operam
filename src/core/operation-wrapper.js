class OperationWrapper {
  constructor(operationId, dataType, operation) {
    this.operationId = operationId;
    this.dataType = dataType;
    this.operation = operation;
  }

  apply(handler) {
    handler.update(this.operationId, this.dataType, this.operation);
  }

  invert() {
    return new OperationWrapper(this.operationId, this.dataType, this.operation.invert());
  }

  toString() {
    return `Operation{id=${this.operationId}, type=${this.dataType}, operation=${this.operation}}`;
  }
}

exports.OperationWrapper = OperationWrapper;
