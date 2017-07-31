const OperationSequence = require('../helper/operation-sequence');

class HistoryBuffer {
  constructor(documentId) {
    this.documentId = documentId;
    this.operationBuffer = [];
    this.operationBuffer.push(new OperationSequence([]));
  }

  latest() {
    return Promise.resolve(this.operationBuffer.length);
  }

  until(historyId) {
    return Promise.resolve(this.operationBuffer.slice(0, historyId));
  }

  from(historyId) {
    return Promise.resolve(this.operationBuffer.slice(historyId - 1));
  }

  store(op) {
    this.operationBuffer.push(op);
    this.operationBuffer.forEach((op2) => {
      console.dir(op2);
    });
    return Promise.resolve(this.operationBuffer.length);
  }
}

module.exports = HistoryBuffer;
