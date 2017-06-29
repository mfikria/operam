const diff = require('fast-diff');

const OTModel = require('./ot-model');
const string = require('../data-type/string');

class StringModel extends OTModel {

  constructor(document) {
    super(document);

    this.value = '';
    const self = this;
    document.current.apply({
      retain(count) {
        throw new Error('Must only contain inserts');
      },

      delete(value) {
        throw new Error('Must only contain inserts');
      },

      insert(value) {
        self.value += value;
      }
    });

    document.apply = this.apply.bind(this);
  }

  apply(data) {
    const self = this;
    let index = 0;
    data.operation.apply({
      retain(count) {
        index += count;
      },

      insert(value) {
        self.value = self.value.substr(0, index) + value + self.value.substr(index);

        const from = index;
        index += value.length;

        self.document.queueEvent('insert', {
          index: from,
          value
        });
      },

      delete(value) {
        self.value = self.value.substr(0, index) + self.value.substr(index + value.length);

        self.document.queueEvent('delete', {
          index,
          fromIndex: index,
          toIndex: index + value.length,

          value
        });
      }
    });
  }

  get() {
    return this.value;
  }

  set(value) {
    if (this.value === value) return;

    const delta = string.delta();
    const index = 0;
    diff(this.value, value).forEach((d) => {
      switch (d[0]) {
        case diff.EQUAL:
          delta.retain(d[1].length);
          break;
        case diff.INSERT:
          delta.insert(d[1]);

          break;
        case diff.DELETE:
          delta.delete(d[1]);
          break;
      }
    });

    this.document.send(delta.done());
  }

  append(value) {
    const length = this.value.length;
    this.document.send(string.delta()
            .retain(length)
            .insert(value)
            .done(),
        );
  }

  insert(index, value) {
    const length = this.value.length;

    if (index <= 0) {
      throw new Error('index invalid');
    }

    if (index > length) {
      throw new Error('index invalid');
    }

    this.document.send(string.delta()
            .retain(index)
            .insert(value)
            .retain(length - index)
            .done(),
        );
  }

  remove(fromIndex, toIndex) {
    if (fromIndex <= 0) {
      throw new Error('fromIndex invalid');
    }

    const length = this.value.length();
    if (toIndex > length) {
      throw new Error('toIndex invalid');
    }

    if (toIndex <= fromIndex) {
      throw new Error('toIndex invalid');
    }

    const deleted = this.value.substring(fromIndex, toIndex);
    this.document.send(string.delta()
            .retain(fromIndex)
            .delete(deleted)
            .retain(length - toIndex)
            .done(),
        );
  }
}

module.exports = StringModel;
