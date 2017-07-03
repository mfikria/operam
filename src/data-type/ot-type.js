const OperationComposer = require('../helper/operation-composer');

class OTType {
  newComposer() {
    return new OperationComposer(this);
  }

  compose(left, right) {
    throw new Error('Not implemented');
  }

  transform(left, right) {
    throw new Error('Not implemented');
  }

  serializeObject(op) {
    throw new Error('Not implemented');
  }

  deserializeObject(op) {
    throw new Error('Not implemented');
  }
}

module.exports = OTType;
