const OperationHandler = require('./operation-handler');
const OperationWrapper = require('./operation-wrapper');
const OperationIterator = require('../helper/operation-iterator');
const OperationSequence = require('../helper/operation-sequence');
const OperationComposer = require('../helper/operation-composer');

const StringType = require('../data-type/string/string-type');
const MapType = require('../data-type/map/map-type');

function idComparator(a, b) {
  if (a.operationId < b.operationId) {
    return -1;
  } else if (a.operationId > b.operationId) {
    return 1;
  }
  return 0;
}

class OperationManager {
  compose(left, right) {
    const iteratorLeft = new OperationIterator(left, idComparator);
    const iteratorRight = new OperationIterator(right, idComparator);

    const result = [];

    while (iteratorLeft.hasNext()) {
      const op1 = iteratorLeft.next();

      let handled = false;

      while (iteratorRight.hasNext()) {
        const op2 = iteratorRight.next();

        const compared = idComparator(op1, op2);
        if (compared > 0) {
          result.push(op2);
        } else if (compared < 0) {
          iteratorRight.back();
          break;
        } else {
          if (op1 instanceof OperationWrapper && op2 instanceof OperationWrapper) {
            if (op1.dataType !== op2.dataType) {
              throw new Error(`Operations  have different types: ${op1.dataType} vs ${op2.dataType}`);
            }

            const dataType = OperationManager.DATA_TYPES[op1.dataType];
            const composed = dataType.compose(op1.operation, op2.operation);
            iteratorLeft.replace(new OperationWrapper(op1.operationId, op1.dataType, composed, op1.token));
          }

          handled = true;
          break;
        }
      }

      if (!handled) {
        result.push(op1);
      }
    }

    while (iteratorRight.hasNext()) {
      result.push(iteratorRight.next());
    }

    result.sort(idComparator);
    return new OperationSequence(result);
  }

  transform(left, right) {
    const iteratorLeft = new OperationIterator(left, idComparator);
    const iteratorRight = new OperationIterator(right, idComparator);

    const deltaLeft = [];
    const deltaRight = [];

    while (iteratorLeft.hasNext()) {
      const op1 = iteratorLeft.next();

      let handled = false;

      while (iteratorRight.hasNext()) {
        const op2 = iteratorRight.next();

        const compared = idComparator(op1, op2);
        if (compared > 0) {
          deltaRight.push(op2);
        } else if (compared < 0) {
          iteratorRight.back();
          break;
        } else {
          if (op1 instanceof OperationWrapper && op2 instanceof OperationWrapper) {
            if (op1.dataType !== op2.dataType) {
              throw new Error(`Operations  have different types: ${op1.dataType} vs ${op2.dataType}`);
            }

            const dataType = OperationManager.DATA_TYPES[op1.dataType];
            const transformed = dataType.transform(op1.operation, op2.operation);
            deltaLeft.push(new OperationWrapper(op1.operationId, op1.dataType, transformed.left, op1.token));
            deltaRight.push(new OperationWrapper(op2.operationId, op2.dataType, transformed.right, op2.token));
          }

          handled = true;
          break;
        }
      }

      if (!handled) {
        deltaLeft.push(op1);
      }
    }

    while (iteratorRight.hasNext()) {
      deltaRight.push(iteratorRight.next());
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
    OperationSequence.asArray(op).forEach((subOp) => {
      if (!(subOp instanceof OperationWrapper)) {
        throw new Error(`Unsupported operation: ${subOp.toString()}`);
      }
      result.push([
        'operation',
        subOp.operationId,
        subOp.dataType,
        OperationManager.DATA_TYPES[subOp.dataType].serializeObject(subOp.operation),
        subOp.token
      ]);
    });

    return result;
  }

  static deserializeObject(json) {
    const operationHandler = new OperationHandler();

    json.forEach((data) => {
      if (data[0] !== 'operation') {
        throw new Error(`Data is invalid: ${data.toString()}`);
      }
      operationHandler.setOperation(
          data[1],
          data[2],
          OperationManager.DATA_TYPES[data[2]].deserializeObject(data[3]),
          data[4]
      );
    });

    return operationHandler.done();
  }

  newOperationComposer() {
    return new OperationComposer(this);
  }
}

OperationManager.DATA_TYPES = {
  map: new MapType(),
  string: new StringType()
};

module.exports = OperationManager;
