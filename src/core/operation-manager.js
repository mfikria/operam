const OTType = require('../data-type/ot-type');

const map = require('../data-type/map');
const string = require('../data-type/string');

const CombinedDelta = require('./operation-handler');
const OperationIterator = require('../helper/operation-iterator');
const OperationSequence = require('../helper/operation-sequence');
const ops = require('./operation-wrapper');

function idComparator(a, b) {
  return a.operationId < b.operationId ? -1 : (a.operationId > b.operationId ? 1 : 0);
}

class OperationManager extends OTType {
  compose(left, right) {
    const it1 = new OperationIterator(left, idComparator);
    const it2 = new OperationIterator(right, idComparator);

    const result = [];

    while (it1.hasNext) {
      const op1 = it1.next();

      let handled = false;

      while (it2.hasNext) {
        const op2 = it2.next();

        const compared = idComparator(op1, op2);
        if (compared > 0) {
          result.push(op2);
          continue;
        } else if (compared < 0) {
          it2.back();
        } else {
          if (op1 instanceof ops.OperationWrapper && op2 instanceof ops.OperationWrapper) {
            if (op1.dataType != op2.dataType) {
              throw new Error(`Operations with id \`${op1.operationId
                                }\` have different types: ${op1.dataType} vs ${
                                op2.dataType}`);
            }

            const type = OperationManager.DATA_TYPES[op1.dataType];
            if (!type) {
              throw `Can not compose, unknown type: ${op1.dataType}`;
            }

            const composed = type.compose(op1.operation, op2.operation);
            it1.replace(new ops.OperationWrapper(op1.operationId, op1.dataType, composed));
          }

          handled = true;
        }
        break;
      }

      if (!handled) {
        result.push(op1);
      }
    }

    while (it2.hasNext) {
      result.push(it2.next());
    }

    result.sort(idComparator);
    return new OperationSequence(result);
  }

  transform(left, right) {
    const it1 = new OperationIterator(left, idComparator);
    const it2 = new OperationIterator(right, idComparator);

    const deltaLeft = [];
    const deltaRight = [];

    while (it1.hasNext) {
      const op1 = it1.next();

      let handled = false;

      while (it2.hasNext) {
        const op2 = it2.next();

        const compared = idComparator(op1, op2);
        if (compared > 0) {
          deltaRight.push(op2);
          continue;
        } else if (compared < 0) {
          it2.back();
        } else {
          if (op1 instanceof ops.OperationWrapper && op2 instanceof ops.OperationWrapper) {
            if (op1.dataType != op2.dataType) {
              throw `Can not compose, operations with id \`${op1.operationId
                                }\` have different types: ${op1.dataType} vs ${
                                op2.dataType}`;
            }

            const type = OperationManager.DATA_TYPES[op1.dataType];
            if (!type) {
              throw `Can not compose, unknown type: ${op1.dataType}`;
            }

            const transformed = type.transform(op1.operation, op2.operation);
            deltaLeft.push(new ops.OperationWrapper(op1.operationId, op1.dataType, transformed.left));
            deltaRight.push(new ops.OperationWrapper(op2.operationId, op2.dataType, transformed.right));
          }

          handled = true;
        }

        break;
      }

      if (!handled) {
        deltaLeft.push(op1);
      }
    }

    while (it2.hasNext) {
      deltaRight.push(it2.next());
    }

    deltaLeft.sort(idComparator);
    deltaRight.sort(idComparator);
    return {
      left: new OperationSequence(deltaLeft),
      right: new OperationSequence(deltaRight)
    };
  }

  static serializeObject(op) {
    const result = [];
    OperationSequence.asArray(op)
            .forEach((subOp) => {
              if (subOp instanceof ops.OperationWrapper) {
                result.push([
                  'update',
                  subOp.operationId,
                  subOp.dataType,

                  OperationManager.DATA_TYPES[subOp.dataType].serializeObject(subOp.operation)
                ]);
              } else {
                throw new Error(`Unsupported operation: ${subOp}`);
              }
            });

    return result;
  }

  static deserializeObject(json) {
    const delta = new CombinedDelta();

    json.forEach((data) => {
      switch (data[0]) {
        case 'update':
          delta.update(data[1], data[2], OperationManager.DATA_TYPES[data[2]].deserializeObject(data[3]));
          break;
        default:
          throw new Error(`Unsupported type of operation: ${data[0]}`);
      }
    });

    return delta.done();
  }

  static delta() {
    return new CombinedDelta();
  }
}

OperationManager.DATA_TYPES = {
  map: map.newType(),
  string: string.newType()
};

module.exports = OperationManager;
