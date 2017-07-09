const events = ['input'];

class FlowchartBinder {
  static bind(map, diagram) {
    const ignore = false;
      diagram.model.addChangedListener((e) => {
          if (e.isTransactionFinished) {
              const tx = e.object;
              if (tx === null) return;
              if (tx instanceof go.Transaction && window.console) {
                  // window.console.log(tx.toString());
                  tx.changes.each((c) => {
                      switch (c.modelChange) {
                          case 'nodeDataArray':
                              if (c.change === go.ChangedEvent.Insert) {
                                  console.log(`${e.propertyName} added node with key: ${c.newValue.key}`);
                              } else if (c.change === go.ChangedEvent.Remove) {
                                  console.log(`${e.propertyName} removed node with key: ${c.oldValue.key}`);
                              }
                              break;

                          default:
                      }
                  });
              }
          }
      });

  }
}

module.exports = FlowchartBinder;