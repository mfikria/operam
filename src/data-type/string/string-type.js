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
    const result = [];
    OperationSequence.asArray(op)
            .forEach((subOp) => {
              if (subOp instanceof ops.Retain) {
                result.push(['retain', subOp.length]);
              } else if (subOp instanceof ops.Insert) {
                result.push(['insert', subOp.value]);
              } else if (subOp instanceof ops.Delete) {
                result.push(['delete', subOp.value]);
              } else {
                throw new Error(`Unsupported operation: ${subOp}`);
              }
            });

    return result;
  }

  deserializeObject(json) {
    if (!Array.isArray(json)) {
      throw new Error(`Given input is not an array, got: ${json}`);
    }

    const delta = new StringDelta();
    json.forEach((op) => {
      switch (op[0]) {
        case 'retain':
          delta.retain(op[1]);
          break;
        case 'insert':
          delta.insert(op[1]);
          break;
        case 'delete':
          delta.delete(op[1]);
          break;
        default:
          throw new Error(`Unknown operation: ${op}`);
      }
    });

    return delta.done();
  }
}

module.exports = StringType;