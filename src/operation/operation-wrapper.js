class OperationWrapper {
  constructor(id, type, op) {
    this.operationId = id;
    this.dataType = type;
    this.operation = op;
  }

  apply(handler) {
    handler.setOperation(this.operationId, this.dataType, this.operation);
  }

  invert() {
    return new OperationWrapper(this.operationId, this.dataType, this.operation.invert());
  }

  serializeObject() {
    return `Operation{id=${this.operationId}, type=${this.dataType}, operation=${this.operation.serializeObject()}}`;
  }
}

module.exports = OperationWrapper;
