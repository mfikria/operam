const doLater = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;

class LocalLock {
  constructor() {
    this.queue = [];
    this.acquired = false;
  }

  acquire(cb) {
    return new Promise((resolve, reject) => {
      if (this.acquired) {
        this.queue.push({
          callback: cb,
          resolve,
          reject
        });
        return;
      }

      this.acquired = true;

      cb(this.createdDoneCallback(resolve, reject));
    });
  }

  createdDoneCallback(resolve, reject) {
    let used = false;
    return (err, result) => {
      if (used) return;

      if (err !== null) {
        reject(err);
      } else {
        resolve(result);
      }

      used = true;
      if (this.queue.length === 0) {
        this.acquired = false;
      } else {
        const next = this.queue[0];
        this.queue.splice(0, 1);

        doLater(function () {
          const done = this.createdDoneCallback(next.resolve, next.reject);
          next.callback(done);
        });
      }
    };
  }
}

module.exports = function () {
  const lock = new LocalLock();

  return function (cb) {
    return lock.acquire(cb);
  };
};
