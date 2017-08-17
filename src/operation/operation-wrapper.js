class OperationWrapper {
  constructor(id, type, op, token) {
    this.operationId = id;
    this.dataType = type;
    this.operation = op;
    this.token = token;
  }

  apply(handler) {
    handler.setOperation(this.operationId, this.dataType, this.operation);
  }

  invert() {
    return new OperationWrapper(this.operationId, this.dataType, this.operation.invert(), this.token);
  }

  serializeObject() {
    return `Operation{id=${this.operationId}, type=${this.dataType}, operation=${this.operation.serializeObject()}}`;
  }
}

module.exports = OperationWrapper;
