const EventEmitter = require('events');

class OTConnector {
  constructor(documentId) {
    this.events = new EventEmitter();
    this.documentId = documentId;
  }

  on(event, listener) {
    return this.events.on(event, listener);
  }

  send(op) {
      throw new Error('Not implemented');
  }

  connect() {
    throw new Error('Not implemented');
  }

  disconnect() {
    throw new Error('Not implemented');
  }
}

module.exports = OTConnector;
