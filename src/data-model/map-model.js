const OTModel = require('./ot-model');
const map = require('../data-type/map');
const dataValues = require('../helper/data-values');

class MapModel extends OTModel {

  constructor(document) {
    super(document);

    this.values = {};

    this.apply({
      operation: document.current
    });
    document.apply = this.apply.bind(this);
  }

  apply(data) {
    data.operation.apply({
      remove: (id, oldValue) => {
        const old = this.values[id];
        delete this.values[id];

        this.document.queueEvent('valueRemoved', {
          key: id,
          oldValue: old
        });
      },

      set: (id, oldValue, newValue) => {
        const value = dataValues.fromData(this.document, newValue);
        const old = this.values[id];
        this.values[id] = value;

        this.document.queueEvent('valueChanged', {
          key: id,
          oldValue: old,
          newValue: value
        });
      }
    });
  }

  containsKey(key) {
    return typeof this.values[key] !== 'undefined';
  }

  get(key, factory) {
    let value = this.values[key];
    if (value) return value;

    if (factory) {
      const model = this.document.model;
      model.performEdit(() => {
        value = this.values[key] = factory(model);

        this.document.send(map.delta()
                    .set(key, dataValues.toData(null), dataValues.toData(value))
                    .done(),
                );
      });
    }

    return value || null;
  }

  remove(key) {
    const old = this.values[key];
    if (typeof old !== 'undefined') {
      this.document.send(map.delta()
                .set(key, dataValues.toData(null)),
            );
    }
  }

  set(key, value) {
    if (value === null || typeof value === 'undefined') {
      throw new Error('Value undefined');
    }

    const old = this.values[key];
    this.document.send(map.delta()
            .set(key, dataValues.toData(old), dataValues.toData(value))
            .done(),
        );
  }
}

module.exports = MapModel;
