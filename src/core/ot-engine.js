const EventEmitter = require('events');
const Event = require('../helper/events');
const MapModel = require('../data-model/map-model');
const StringModel = require('../data-model/string-model');
const OperationSequence = require('../helper/operation-sequence');
const OperationHandler = require('../operation/operation-handler');
const OperationManager = require('../operation/operation-manager');
const StackTrace = require('stacktrace-js');
const uuidv4 = require('uuid/v4');

class OTEngine {
  constructor(document) {
    this.document = document;
    this.lastObjectId = 0;

    this.factories = {};

    this.documents = {};
    this.values = {};
    this.objects = {};

    this.events = new EventEmitter();

    this.operationManager = new OperationManager();
    this.avgExecTime = [];

    document.on(Event.CHANGE, (change) => {
      if (!change.local) {
        change.operation.apply(this.changeHandler);
      }

      this.events.emit(Event.CHANGE, change);
    });

    this.changeHandler = {
      setOperation: (id, type, change) => {
        if (typeof this.values[id] !== 'undefined') {
          const current = this.values[id];
          const composed = OperationManager.DATA_TYPES[type].compose(current, change);

          this.values[id] = composed;

          const editor = this.documents[id];
          this.remote = true;
          editor.apply({
            operation: change,
            local: false,
            remote: true
          });
        } else {
          this.values[id] = change;

          const object = this.createObject(id, type);
          this.objects[id] = object;
        }
      }
    };

    this.registerType('map', e => new MapModel(e));
    this.registerType('string', e => new StringModel(e));

    this.root = this.getObject('root', 'map');
    this.root.on(Event.VALUE_CHANGED, data => this.events.emit('valueChanged', data));
    this.root.on(Event.VALUE_REMOVED, data => this.events.emit('valueRemove', data));
  }

  registerType(type, factory) {
    this.factories[type] = factory;
    return this;
  }

  newMap() {
    return this.newObject('map');
  }

  newString() {
    return this.newObject('string');
  }

  newObject(type) {
    const objectId = `${this.document.operationId}-${this.lastObjectId++}`;
    // const objectId = uuidv4();
    return this.getObject(objectId, type);
  }

  start() {
    return this.document.open()
            .then(initial => initial.apply(this.changeHandler));
  }

  close() {
    this.document.close();
  }

  performEdit(callback) {
    this.document.performEdit(callback);
  }

  apply(id, type, op) {
    if (typeof this.values[id] !== 'undefined') {
      const current = this.values[id];
      const composed = OperationManager.DATA_TYPES[type].compose(current, op);

      this.values[id] = composed;
    } else {
      this.values[id] = op;
    }

    const editor = this.documents[id];
    if (editor) {
      this.remote = false;
      editor.apply({
        operation: op,
        local: true,
        remote: false
      });

      editor.queueEvent(Event.CHANGE, op);
    }
    this.document.apply(new OperationHandler()
            .setOperation(id, type, op)
            .done(),
        );
  }

  getObject(id) {
    const object = this.objects[id];
    return object || null;
  }

  queueEvent(id, type, data) {
    const editor = this.documents[id];
    editor.events.emit(type, new Event(this.remote, data));
  }

  getObject(id, type) {
    let object = this.objects[id];
    if (typeof object !== 'undefined') return object;

    this.values[id] = new OperationSequence([]);
    object = this.createObject(id, type);
    this.objects[id] = object;

    return object;
  }

  createObject(id, type) {
    const editor = this.createDocument(id, type);
    this.documents[id] = editor;
    return this.factories[type](editor);
  }

  createDocument(id, type) {
    const self = this;
    return {
      objectId: id,
      objectType: type,

      events: new EventEmitter(),

      model: self,

      getObject(id, type) {
        return self.getObject(id, type);
      },

      queueEvent(type, data) {
        self.queueEvent(id, type, data);
      },

      get current() {
        return self.values[this.objectId];
      },

      send(op) {
        self.apply(this.objectId, this.objectType, op);
      },

      apply(op, local) {
        throw new Error('No hook for applying data registered');
      }
    };
  }

  containsKey(key) {
    return this.root.containsKey(key);
  }

  get(key, factory) {
    return this.root.get(key, factory);
  }

  remove(key) {
    return this.root.remove(key);
  }

  set(key, value) {
    return this.root.set(key, value);
  }

  on(event, listener) {
    return this.events.on(event, listener);
  }
}

module.exports = OTEngine;
