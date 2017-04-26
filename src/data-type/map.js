const MapType = require('./map/map-type');
const MapDelta = require('./map/map-delta');

exports.MapType = MapType;
exports.newType = function (options) {
  return new MapType(options);
};

exports.MapDelta = MapDelta;
exports.delta = function () {
  return new MapDelta();
};
