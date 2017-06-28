const OperationSequence = require('../helper/operation-sequence');
const ops = require('./operation-wrapper');

class OperationHandler {
  constructor() {
    this.ops = [];
  }

  update(id, type, operation) {
    if (this.ops[id]) {
      throw new Error(`Can not update id \`${id}\``);
    }

    this.ops[id] = new ops.OperationWrapper(id, type, operation);
    return this;
  }

  done() {
    const result = [];

    for (const key in this.ops) {
      if (!this.ops.hasOwnProperty(key)) continue;

      const value = this.ops[key];
      result.push(value);
    }

    return new OperationSequence(result);
  }
}

module.exports = OperationHandler;
