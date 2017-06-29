const EventEmitter = require('events');

class OTConnector {
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

  send(operation) {
    throw new Error('Not implemented');
  }

  close() {
    throw new Error('Not implemented');
  }
}

module.exports = OTConnector;
