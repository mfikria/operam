const OperationSequence = require('../helper/operation-sequence');

class HistoryBuffer {
  constructor(documentId) {
    this.documentId = documentId;
    this.operationBuffer = [];
    this.operationBuffer.push(new OperationSequence([]));
    this.operationIndex = [];
    this.operationIndex.push(-1);
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
    return Promise.resolve(this.operationBuffer.length);
  }

  storeIndex(index) {
    this.operationIndex.push(index);
  }
}

module.exports = HistoryBuffer;
