const StringType = require('./string/string-type');
const StringDelta = require('./string/string-delta');

exports.StringType = StringType;
exports.newType = function (options) {
  return new StringType(options);
};

exports.StringDelta = StringDelta;
exports.delta = function () {
  return new StringDelta();
};
