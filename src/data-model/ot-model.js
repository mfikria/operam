class OTModel {
  constructor(workspace) {
    this.workspace = workspace;
  }

  get objectId() {
    return this.workspace.objectId;
  }

  get objectType() {
    return this.workspace.objectType;
  }

  on(event, listener) {
    this.workspace.events.on(event, listener);
    return this;
  }

  removeEventListener(event, listener) {
    return this.workspace.events.removeListener(event, listener);
  }
}

module.exports = OTModel;
