const OTType = require('../ot-type');

const OperationIterator = require('../../helper/operation-iterator');
const OperationSequence = require('../../helper/operation-sequence');
const ops = require('./map-operation');

function keyComparator(a, b) {
  return a.key < b.key ? -1 : (a.key > b.key ? 1 : 0);
}

class MapType extends OTType {
  compose(left, right) {
    const it1 = new OperationIterator(left, keyComparator);
    const it2 = new OperationIterator(right, keyComparator);

    const result = [];

    while (it1.hasNext) {
      const op1 = it1.next();

      let handled = false;

      while (it2.hasNext) {
        const op2 = it2.next();

        const compared = keyComparator(op1, op2);
        if (compared > 0) {
          result.push(op2);
          continue;
        } else if (compared < 0) {
          it2.back();
        } else {
          if (op1 instanceof ops.Set && op2 instanceof ops.Set) {
            it1.replace(new ops.Set(op1.key, op1.oldValue, op2.newValue));
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

    result.sort(keyComparator);
    return new OperationSequence(result);
  }

  transform(left, right) {
    const it1 = new OperationIterator(left, keyComparator);
    const it2 = new OperationIterator(right, keyComparator);

    const deltaLeft = [];
    const deltaRight = [];

    while (it1.hasNext) {
      const op1 = it1.next();

      let handled = false;

      while (it2.hasNext) {
        const op2 = it2.next();

        const compared = keyComparator(op1, op2);
        if (compared > 0) {
          deltaRight.push(op2);
          continue;
        } else if (compared < 0) {
          it2.back();
        } else {
          if (op1 instanceof ops.Set && op2 instanceof ops.Set) {
            deltaRight.push(new ops.Set(op1.key, op1.newValue, op2.newValue));
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

    deltaLeft.sort(keyComparator);
    deltaRight.sort(keyComparator);
    return {
      left: new OperationSequence(deltaLeft),
      right: new OperationSequence(deltaRight)
    };
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
