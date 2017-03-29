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
    const result = [];
    OperationSequence.asArray(op)
            .forEach((subOp) => {
              if (subOp instanceof ops.Set) {
                result.push([
                  'set',

                  {
                    key: subOp.key,
                    oldValue: subOp.oldValue,
                    newValue: subOp.newValue
                  }
                ]);
              } else {
                throw new Error(`Unsupported operation: ${subOp}`);
              }
            });

    return result;
  }

  deserializeObject(json) {
    const result = [];

    json.forEach((data) => {
      switch (data[0]) {
        case 'set':
          const op = data[1];
          result.push(new ops.Set(op.key, op.oldValue || null, op.newValue || null));
          break;
        default:
          throw new Error(`Unsupported type of operation: ${data[0]}`);
      }
    });

    return new OperationSequence(result);
  }
}

module.exports = MapType;
