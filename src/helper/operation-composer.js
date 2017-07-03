class OperationComposer {
  constructor(type) {
    this.dataType = type;
  }

  add(op) {
    this.composed = this.composed ?
        this.dataType.compose(this.composed, op) :
        op;

    return this;
  }

  done() {
    return this.composed;
  }
}

module.exports = OperationComposer;
