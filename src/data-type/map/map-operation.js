const OTOperation = require('../ot-operation');

class Set extends OTOperation {
  constructor(key, oldValue, newValue) {
    super();
    this.key = key;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }

  apply(handler) {
    if (this.newValue === null) {
      handler.remove(this.key, this.oldValue);
    } else {
      handler.set(this.key, this.oldValue, this.newValue);
    }
  }

  invert() {
    return new Set(this.key, this.newValue, this.oldValue);
  }

  toString() {
    return `Set{key=${this.key}, oldValue=${this.oldValue}, newValue=${this.newValue}}`;
  }
}

exports.Set = Set;
