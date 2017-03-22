const OTModel = require('../data-model/ot-model');

exports.fromData = function (editor, data) {
  if (typeof data === 'undefined') return null;

  const type = data[0];
  switch (type) {
    case 'ref':
      return editor.getObject(data[1], data[2]);
    case 'value':
      return data[1];
    default:
      throw new Error(`Unknown type of data: ${type}`);
  }
};

exports.toData = function (value) {
  if (typeof value === 'undefined') return null;

  if (value instanceof OTModel) {
    return ['ref', value.objectId, value.objectType];
  }
  return ['value', value];
};
