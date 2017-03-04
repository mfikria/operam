

class OperationComposer {
  constructor(type) {
    this.dataType = type;
  }

  add(op) {
    if (this.result) {
      this.result = this.dataType.compose(this.result, op);
    } else {
      this.result = op;
    }

    return this;
  }

  done() {
    return this.result;
  }
}

module.exports = OperationComposer;
