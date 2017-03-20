class Event {
  constructor(remote, data) {
    this.remote = remote;
    this.local = !remote;

    Object.keys(data).forEach(k => this[k] = data[k]);
  }
}

exports.Event = Event;
exports.VALUE_CHANGED = 'valueChanged';
exports.VALUE_REMOVED = 'valueRemoved';

exports.INSERT = 'insert';
exports.DELETE = 'delete';

exports.LOAD_DOCUMENT = 'load document';
exports.CHANGE_DOCUMENT = 'change document';
exports.CLOSE_DOCUMENT = 'close document';
