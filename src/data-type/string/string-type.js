const OTType = require('../ot-type');
const OperationIterator = require('../../helper/operation-iterator');
const OperationSequence = require('../../helper/operation-sequence');

const StringDelta = require('./string-delta');
const ops = require('./string-operation');

class StringType extends OTType {
  compose(left, right) {
    left = new OperationIterator(left);
    right = new OperationIterator(right);

    const delta = new StringDelta();

    function handleRetain(op1, op2) {

    }

    function handleInsert(op1, op2) {

    }

    function handleDelete(op1, op2) {

    }


  }

  transform(left, right) {

    }


  serializeObject(op) {

  }

  deserializeObject(json) {
    ;
  }
}

module.exports = StringType;