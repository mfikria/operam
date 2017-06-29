class OperationComposer {
  constructor(dataType) {
    this.dataType = dataType;
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
