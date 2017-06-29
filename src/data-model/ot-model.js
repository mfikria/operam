class OTModel {
  constructor(document) {
    this.document = document;
  }

  get objectId() {
    return this.document.objectId;
  }

  get objectType() {
    return this.document.objectType;
  }

  on(event, listener) {
    this.document.events.on(event, listener);
    return this;
  }

  removeEventListener(event, listener) {
    return this.document.events.removeListener(event, listener);
  }
}

module.exports = OTModel;
