const events = ['input'];

class TextareaBinder {

  static bind(string, element) {
    let ignore = false;

    function snapshot() {
      if (ignore) return;

      string.set(element.value);
    }

    events.forEach((event) => {
      element.addEventListener(event, snapshot);
    });

    function insertText(e) {
      if (e.local) return;

      ignore = true;
      try {
        let start = element.selectionStart;
        let end = element.selectionEnd;

        const length = e.value.length;

        element.value = element.value.substring(0, e.index) +
                    e.value +
                    element.value.substring(e.index);

        if (start > e.index) start += length;
        if (end > e.index) end += length;

        element.selectionStart = start;
        element.selectionEnd = end;
      } finally {
        ignore = false;
      }
    }

    function deleteText(e) {
      if (e.local) return;

      ignore = true;
      try {
        let start = element.selectionStart;
        let end = element.selectionEnd;

        const length = e.value.length;

        element.value = element.value.substring(0, e.fromIndex) +
                    element.value.substring(e.toIndex);

        if (start > e.fromIndex) start = Math.max(e.fromIndex, start - length);
        if (end > e.fromIndex) end = Math.max(e.fromIndex, end - length);

        element.selectionStart = start;
        element.selectionEnd = end;
      } finally {
        ignore = false;
      }
    }

    string.on('insert', insertText);
    string.on('delete', deleteText);

    element.value = string.get();

    return {
      disconnect() {
        string.removeEventListener('insert', insertText);
        string.removeEventListener('delete', deleteText);

        events.forEach((event) => {
          element.removeEventListener(event, snapshot);
        });
      }
    };
  }
}

module.exports = TextareaBinder;
