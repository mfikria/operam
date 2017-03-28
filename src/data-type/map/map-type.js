const OTType = require('../ot-type');

const OperationIterator = require('../../helper/operation-iterator');
const OperationSequence = require('../../helper/operation-sequence');
const ops = require('./map-operation');

function keyComparator(a, b) {
  return a.key < b.key ? -1 : (a.key > b.key ? 1 : 0);
}

class MapType extends OTType {

  compose(left, right) {

  }

  transform(left, right) {

  }

  serializeObject(op) {

  }

  deserializeObject(json) {

  }
}

module.exports = MapType;
