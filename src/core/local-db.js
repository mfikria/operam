const Dexie = require('dexie');

class LocalDB {
  constructor(userId, documentId) {
    this.userId = userId;
    this.documentId = documentId;
    // this.db = new Dexie('operam');
    // this.db.version(1).stores({
    //   data: 'userId,state,parentHistoryId,lastSent,buffer'
    // });
  }

  store(state, parentHistoryId, lastSent, buffer) {
    // this.db.open().then(function () {
    //   this.db.data.put(
    //     {
    //       userId: this.userId,
    //       state,
    //       parentHistoryId,
    //       lastSent,
    //       buffer
    //     }
    //   );
    // });
  }

  isSync() {
    // this.db.open().then(function () {
    //   return this.db.data.get(this.userId).state === 0;
    // });
  }

  sync() {
    // this.db.open().then(function () {
    //   this.db.data.where('userId').equals(this.userId).modify({ state: 0 });
    // });
  }

  getLatest() {
    // this.db.open().then(function () {
    //   return this.db.data.get(this.userId);
    // });
  }

  getHistoryId() {
    // this.db.open().then(function () {
    //   return this.db.data.get(this.userId).parentHistoryId;
    // });
  }
}
module.exports = LocalDB;
