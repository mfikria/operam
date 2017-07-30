class Event {
  constructor(remote, data) {
    this.remote = remote;
    this.local = !remote;

    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}

Event.VALUE_CHANGED = 'valueChanged';
Event.VALUE_REMOVED = 'valueRemoved';

Event.INSERT = 'insert';
Event.DELETE = 'delete';
Event.CHANGE = 'change';

Event.LOAD_DOCUMENT = 'load document';
Event.CHANGE_DOCUMENT = 'change document';
Event.CLOSE_DOCUMENT = 'close document';
Event.RELOAD_DOCUMENT = 'reload document';

Event.CONNECT_ERROR = 'connect_error';
Event.RECONNECT = 'reconnect';
Event.DISCONNECT = 'disconnect';

module.exports = Event;