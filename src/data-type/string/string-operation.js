const OTOperation = require('../ot-operation');

class Retain extends OTOperation {
  constructor(length) {
    super();
    this.length = length;
  }

  apply(handler) {
    handler.retain(this.length);
  }

  invert() {
    return this;
  }

  toString() {
    return `Retain{${this.length}}`;
  }
}

class Insert extends OTOperation {
  constructor(value) {
    super();
    this.value = value;
  }

  apply(handler) {
    handler.insert(this.value);
  }

  invert() {
    return Delete(this.value);
  }

  toString() {
    return `Insert{${this.value}}`;
  }
}

class Delete extends OTOperation {
  constructor(value) {
    super();
    this.value = value;
  }

  apply(handler) {
    handler.delete(this.value);
  }

  invert() {
    return Insert(this.value);
  }

  toString() {
    return `Delete{${this.value}}`;
  }
}

exports.Retain = Retain;
exports.Insert = Insert;
exports.Delete = Delete;
