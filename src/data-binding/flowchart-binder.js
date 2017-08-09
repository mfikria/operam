const events = ['input'];

function mapToJson(map) {
  return JSON.stringify([...map]);
}

function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

function strMapToObj(strMap) {
  const obj = Object.create(null);
  for (const [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

function objToStrMap(obj) {
  const strMap = new Map();
  for (const k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

class FlowchartBinder {
  constructor() {
    this.loaded = false;
  }
  static bind(nodes, links, diagram) {
    const ignore = false;

    diagram.model.addChangedListener((evt) => {
      if (!evt.isTransactionFinished) return;
      const tx = evt.object;
      if (tx === null) return;
      if (!this.loaded) return;
      let dataNewLoc = null;
      let dataNewLink = null;
      let addNode = false;
      console.dir(evt);
      tx.changes.each((e) => {
        if (e.change === go.ChangedEvent.Insert && e.modelChange === 'nodeDataArray') {
          nodes.set(e.newValue.key, JSON.stringify(e.newValue));
          addNode = true;
          console.log(1);
        } else if (e.change === go.ChangedEvent.Remove && e.modelChange === 'nodeDataArray') {
          nodes.remove(e.oldValue.key);
          console.log(2);
        } else if (e.change === go.ChangedEvent.Property && e.diagram === null) {
          if (e.propertyName === 'loc' && !addNode) {
            dataNewLoc = e.object;
            console.log(3);
          } else if (e.propertyName === 'text' && e.object.hasOwnProperty('loc')) {
            nodes.set(e.object.key, JSON.stringify(e.object));
            console.log(4);
          } else if (e.propertyName === 'text' && !e.object.hasOwnProperty('loc')) {
            const data = {
              from: e.object.from,
              fromPort: e.object.fromPort,
              key: e.object.key,
              to: e.object.to,
              toPort: e.object.toPort,
              visible: e.object.visible
            };
            links.set(data.key, JSON.stringify(data));
            console.log(41);
          } else if (e.modelChange === 'linkFromKey' || e.modelChange === 'linkFromPortId' || e.modelChange === 'linkToKey' || e.modelChange === 'linkToPortId') {
            dataNewLink = {
              from: e.object.from,
              fromPort: e.object.fromPort,
              key: e.object.key,
              to: e.object.to,
              toPort: e.object.toPort,
              visible: e.object.visible
            };
            console.log(5);
          }
        } else if (e.change === go.ChangedEvent.Insert && e.modelChange === 'linkDataArray') {
          const data = {
            from: e.newValue.from,
            fromPort: e.newValue.fromPort,
            key: e.newValue.key,
            to: e.newValue.to,
            toPort: e.newValue.toPort,
            visible: e.newValue.visible
          };
          links.set(data.key, JSON.stringify(data));
          console.log(6);
        } else if (e.change === go.ChangedEvent.Remove && e.modelChange === 'linkDataArray') {
          links.remove(e.oldValue.key);
          console.log(7);
        }
      });
      if (dataNewLoc !== null) {
        nodes.set(dataNewLoc.key, JSON.stringify(dataNewLoc));
      }
      if (dataNewLink !== null) {
        links.set(dataNewLink.key, JSON.stringify(dataNewLink));
      }
    });


    function onNodesValueChanged(e) {
      if (e.remote) {
        const data = diagram.model.findNodeDataForKey(e.key);
        const node = JSON.parse(e.newValue);
        if (data != null) {
                    // console.log("Changed node from remote:");
          diagram.model.startTransaction();
          for (const prop in node) {
            diagram.model.setDataProperty(data, prop, node[prop]);
          }
          diagram.model.commitTransaction('Change Node');
        } else {
                    // console.log("Added node from remote:");
          diagram.model.startTransaction();
          diagram.model.addNodeData(node);
          diagram.model.commitTransaction('Create Node');
        }
                // console.dir(node);
        diagram.rebuildParts();
      }
    }

    function onNodesValueRemoved(e) {
      if (e.remote) {
        const data = diagram.model.findNodeDataForKey(e.key);
        if (data != null) {
                    // console.log("Removed node from remote: " + e.key);
          diagram.model.startTransaction();
          diagram.model.removeNodeData(data);
          diagram.model.commitTransaction('Remove Node');
        }
         diagram.rebuildParts();
      }
    }

    function onRelationsValueChanged(e) {
      if (e.remote) {
        const data = diagram.model.findLinkDataForKey(e.key);
        const link = JSON.parse(e.newValue);
        if (data != null) {
                    // console.log("Changed link from remote:");
          diagram.model.startTransaction();
          for (const prop in link) {
            diagram.model.setDataProperty(data, prop, link[prop]);
          }

          diagram.model.commitTransaction('Change Link');
        } else {
                    // console.log("Added link from remote:");
          diagram.model.startTransaction();
          diagram.model.addLinkData(link);
          diagram.model.commitTransaction('Create Link');
        }
                // console.dir(link);
        diagram.rebuildParts();
      }
    }

    function onRelationsValueRemoved(e) {
      if (e.remote) {
        const data = diagram.model.findLinkDataForKey(e.key);
        if (data != null) {
                    // console.log("Removed link from remote: " + e.key);
          diagram.model.startTransaction();
          diagram.model.removeLinkData(data);
          diagram.model.commitTransaction('Remove Link');
        }
          diagram.rebuildParts();
      }
    }

    nodes.on('valueChanged', onNodesValueChanged);
    nodes.on('valueRemoved', onNodesValueRemoved);
    links.on('valueChanged', onRelationsValueChanged);
    links.on('valueRemoved', onRelationsValueRemoved);
  }

  static load(nodes, links, diagram) {
    diagram.model.startTransaction();
    Object.values(nodes.values).forEach((data) => {
      diagram.model.addNodeData(JSON.parse(data));
            // console.log(data);
    });
    diagram.model.commitTransaction('Init Nodes');

    diagram.model.startTransaction();
    Object.values(links.values).forEach((data) => {
      diagram.model.addLinkData(JSON.parse(data));
            // console.log(data);
    });
    diagram.model.commitTransaction('Init Links');

    diagram.rebuildParts();
    this.loaded = true;
  }

}

module.exports = FlowchartBinder;
