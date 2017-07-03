const MapType = require('./map/map-type');
const MapHandler = require('./map/map-handler');

exports.MapType = MapType;
exports.newType = function (options) {
  return new MapType(options);
};

exports.MapHandler = MapHandler;
exports.delta = function () {
  return new MapHandler();
};
