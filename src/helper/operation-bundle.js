class OperationBundle {
  constructor(historyId, operationId, operation) {
    this.historyId = historyId;
    this.operationId = operationId;
    this.operation = operation;
  }
}

module.exports = OperationBundle;
