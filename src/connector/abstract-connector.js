const EventEmitter = require('events');

class AbstractConnector {
  constructor(documentId) {
    this.events = new EventEmitter();
    this.documentId = documentId;
  }

  on(event, listener) {
    return this.events.on(event, listener);
  }

  connect() {
    throw new Error('Not implemented');
  }

  onDocumentChange() {
    throw new Error('Not implemented');
  }

  onDocumentLoad(resolve) {
    throw new Error('Not implemented');
  }

  emitDocumentLoad() {
    throw new Error('Not implemented');
  }

  emitDocumentChange(operation) {
    throw new Error('Not implemented');
  }

  close() {
    throw new Error('Not implemented');
  }
}

module.exports = AbstractConnector;
