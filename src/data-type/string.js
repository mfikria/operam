const StringType = require('./string/string-type');
const StringHandler = require('./string/string-handler');

exports.StringType = StringType;
exports.newType = function (options) {
  return new StringType(options);
};

exports.StringHandler = StringHandler;
exports.delta = function () {
  return new StringHandler();
};
