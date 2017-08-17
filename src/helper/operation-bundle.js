class OperationBundle {
  constructor(userId, historyId, operationId, operation) {
    this.userId = userId;
    this.historyId = historyId;
    this.operationId = operationId;
    this.operation = operation;
  }
}

module.exports = OperationBundle;
