

const OperationComposer = require('../helper/operation-composer');

class OTType {
  newOperationComposer() {
    return new OperationComposer(this);
  }
}

module.exports = OTType;
