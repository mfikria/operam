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
      const length1 = op1.length;

      if (op2 instanceof ops.Retain) {
        const length2 = op2.length;

        if (length1 < length2) {
          delta.retain(length1);

          right.replace(new ops.Retain(length2 - length1));
        } else if (length1 > length2) {
          delta.retain(length2);

          left.replace(new ops.Retain(length1 - length2));
        } else {
          delta.retain(length1);
        }
      } else if (op2 instanceof ops.Insert) {
        delta.insert(op2.value);

        left.back();
      } else if (op2 instanceof ops.Delete) {
        const value2 = op2.value;
        const length2 = value2.length;

                // delta.delete(value2);

        if (length1 < length2) {
          delta.delete(value2.substring(0, length1));
          right.replace(new ops.Delete(value2.substring(length1)));
        } else if (length1 > length2) {
          delta.delete(value2);
          left.replace(new ops.Retain(length1 - length2));
        } else {
          delta.delete(value2);
        }
      }
    }

    function handleInsert(op1, op2) {
      const value1 = op1.value;
      const length1 = op1.value.length;

      if (op2 instanceof ops.Retain) {
        const length2 = op2.length;

        if (length1 < length2) {
          delta.insert(value1);
          right.replace(new ops.Retain(length2 - length1));
        } else if (length1 > length2) {
          delta.insert(value1.substring(0, length2));

          left.replace(new ops.Insert(value1.substring(length2)));
        } else {
          delta.insert(value1);
        }
      } else if (op2 instanceof ops.Insert) {
        delta.insert(op2.value);
        left.back();
      } else if (op2 instanceof ops.Delete) {
        const value2 = op2.value;
        const length2 = value2.length;

        if (length1 > length2) {
          left.replace(new ops.Insert(value1.substring(length2)));
        } else if (length1 < length2) {
          right.replace(new ops.Delete(value2.substring(length1)));
        } else {
        }
      }
    }

    function handleDelete(op1, op2) {
      const value1 = op1.value;
      const length1 = value1.length;

      if (op2 instanceof ops.Retain) {
        delta.delete(value1);

        right.back();
      } else if (op2 instanceof ops.Insert) {
        delta.delete(value1);
        delta.insert(op2.value);
      } else if (op2 instanceof ops.Delete) {
        delta.delete(value1);
        right.back();
      }
    }

    while (left.hasNext() && right.hasNext()) {
      const op1 = left.next();
      const op2 = right.next();

      if (op1 instanceof ops.Retain) {
        handleRetain(op1, op2);
      } else if (op1 instanceof ops.Insert) {
        handleInsert(op1, op2);
      } else if (op1 instanceof ops.Delete) {
        handleDelete(op1, op2);
      }
    }

    if (left.hasNext()) {
      throw new Error('Composition failure');
    }

    while (right.hasNext()) {
      const op2 = right.next();
      op2.apply(delta);
    }

    return delta.done();
  }

  transform(left, right) {
    left = new OperationIterator(left);
    right = new OperationIterator(right);

    const deltaLeft = new StringDelta();
    const deltaRight = new StringDelta();

    function handleRetain(op1, op2) {
      const length1 = op1.length;

      if (op2 instanceof ops.Retain) {
        const length2 = op2.length;

        if (length1 > length2) {
          deltaLeft.retain(length2);
          deltaRight.retain(length2);

          left.replace(new ops.Retain(length1 - length2));
        } else if (length1 < length2) {
          deltaLeft.retain(length1);
          deltaRight.retain(length1);

          right.replace(new ops.Retain(length2 - length1));
        } else {
          deltaLeft.retain(length1);
          deltaRight.retain(length2);
        }
      } else if (op2 instanceof ops.Insert) {
        const value2 = op2.value;
        const length2 = value2.length;

        deltaLeft.retain(length2);
        deltaRight.insert(value2);

        left.back();
      } else if (op2 instanceof ops.Delete) {
        const value2 = op2.value;
        const length2 = value2.length;

        if (length1 > length2) {
          deltaRight.delete(value2);

          left.replace(new ops.Retain(length1 - length2));
        } else if (length1 < length2) {
          deltaRight.delete(value2.substring(0, length1));

          right.replace(new ops.Delete(value2.substring(length1)));
        } else {
          deltaRight.delete(value2);
        }
      }
    }

    function handleInsert(op1, op2) {
      const value1 = op1.value;
      const length1 = op1.value.length;
      deltaLeft.insert(value1);
      deltaRight.retain(length1);
      right.back();
    }

    function handleDelete(op1, op2) {
      const value1 = op1.value;
      const length1 = value1.length;

      if (op2 instanceof ops.Retain) {
        const length2 = op2.length;
        if (length1 > length2) {
          deltaLeft.delete(value1.substring(0, length2));

          left.replace(new ops.Delete(value1.substring(length2)));
        } else if (length1 < length2) {
          deltaLeft.delete(value1);

          right.replace(new ops.Retain(length2 - length1));
        } else {
          deltaLeft.delete(value1);
        }
      } else if (op2 instanceof ops.Insert) {
        const value2 = op2.value;
        const length2 = value2.length;

        deltaLeft.retain(length2);
        deltaRight.insert(value2);

        left.back();
      } else if (op2 instanceof ops.Delete) {
        const value2 = op2.value;
        const length2 = value2.length;

        if (length1 > length2) {
          left.replace(new ops.Delete(value1.substring(length2)));
        } else if (length1 < length2) {
          right.replace(new ops.Delete(value2.substring(length1)));
        } else {
        }
      }
    }

    while (left.hasNext()) {
      const op1 = left.next();

      if (right.hasNext()) {
        const op2 = right.next();

        if (op1 instanceof ops.Retain) {
          handleRetain(op1, op2);
        } else if (op1 instanceof ops.Insert) {
          handleInsert(op1, op2);
        } else if (op1 instanceof ops.Delete) {
          handleDelete(op1, op2);
        } else if (op1 instanceof ops.AnnotationUpdate) {
          handleAnnotationUpdate(op1, op2);
        }
      } else if (op1 instanceof ops.Insert) {
        const value1 = op1.value;
        deltaLeft.insert(value1);
        deltaRight.retain(value1.length);
      } else {
        throw new Error(`Transformation failure, mismatch in operation. Current left operation: ${op1.toString()}`);
      }
    }

    while (right.hasNext()) {
      const op2 = right.next();
      if (op2 instanceof ops.Insert) {
        const value2 = op2.value;

        deltaRight.insert(value2);
        deltaLeft.retain(value2.length);
      } else {
        throw new Error(`Transformation failure, mismatch in operation. Current right operation: ${op2.toString()}`);
      }
    }

    return {
      left: deltaLeft.done(),
      right: deltaRight.done()
    };
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
