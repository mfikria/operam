const OTModel = require('./ot-model');
const map = require('../data-type/map');
const dataValues = require('../helper/data-values');

class MapModel extends OTModel {

  constructor(workspace) {
    super(workspace);

    this.values = {};

    this.apply({
      operation: workspace.current
    });
    workspace.apply = this.apply.bind(this);
  }

  apply(data) {
    data.operation.apply({
      remove: (id, oldValue) => {
        const old = this.values[id];
        delete this.values[id];

        this.workspace.queueEvent('valueRemoved', {
          key: id,
          oldValue: old
        });
      },

      set: (id, oldValue, newValue) => {
        const value = dataValues.fromData(this.workspace, newValue);
        const old = this.values[id];
        this.values[id] = value;

        this.workspace.queueEvent('valueChanged', {
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
      const model = this.workspace.model;
      model.performEdit(() => {
        value = this.values[key] = factory(model);

        this.workspace.send(map.delta()
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
      this.workspace.send(map.delta()
                .set(key, dataValues.toData(null)),
            );
    }
  }

  set(key, value) {
    if (value === null || typeof value === 'undefined') {
      throw new Error('Value undefined');
    }

    const old = this.values[key];
    this.workspace.send(map.delta()
            .set(key, dataValues.toData(old), dataValues.toData(value))
            .done(),
        );
  }
}

module.exports = MapModel;
