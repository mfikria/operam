const MapOperation = require('./map-operation');
const OperationSequence = require('../../helper/operation-sequence');
const OTHandler = require('../ot-handler');

class MapHandler extends OTHandler {
  constructor() {
    super();
    this.values = {};
  }

  set(key, currentValue, newValue) {
    const current = this.values[key];
    if (current) {
      if (current.newValue !== currentValue) {
        throw new Error('newValue of previous set does not match currentValue of this set');
      }

      current.newValue = newValue;
    } else {
      this.values[key] = {
        oldValue: currentValue,
        newValue
      };
    }

    return this;
  }

  remove(key, currentValue) {
    return this.set(key, currentValue, null);
  }

  done() {
    const result = [];

    for (const key in this.values) {
      if (!this.values.hasOwnProperty(key)) continue;

      const value = this.values[key];
      result.push(new MapOperation.Set(key, value.oldValue, value.newValue));
    }

    return new OperationSequence(result);
  }
}

module.exports = MapHandler;
