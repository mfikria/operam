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
    static bind(nodes, links, diagram) {
        const ignore = false;

        diagram.addDiagramListener(
            "SelectionMoved",
            function (e) {
                const node = e.diagram.selection.first();
                if (node instanceof go.Node) {
                    console.log("Moved Node " + node.data.key + " to " + node.data.loc);
                    nodes.set(node.data.key, JSON.stringify(node.data));
                }
            }
        );

        diagram.addDiagramListener(
            "ExternalObjectsDropped",
            function (e) {
                const node = e.diagram.selection.first();
                if (node instanceof go.Node) {
                    console.log("Added Node " + node.data.key);
                    console.dir(node.data);
                    nodes.set(node.data.key, JSON.stringify(node.data));
                }
            }
        );

        diagram.addDiagramListener(
            "TextEdited",
            function (e) {
                const node = e.diagram.selection.first();
                if (node instanceof go.Node) {
                    console.log("Text Edited on Node " + node.data.key + " to " + node.data.text);
                    nodes.set(node.data.key, JSON.stringify(node.data));
                }
            }
        );

        diagram.addDiagramListener(
            "SelectionDeleting",
            function (e) {
                const obj = e.diagram.selection.first();
                if (obj instanceof go.Node) {
                    console.log("Deleted Node " + obj.data.key + ", new value: " + obj.data.loc);
                    nodes.remove(obj.data.key);
                }
            }
        );

        diagram.addDiagramListener(
            "SelectionCopied",
            function (e) {
                const node = e.diagram.selection.first();
                if (node instanceof go.Node) {
                    console.log("Copied Node " + node.data.key);
                    console.dir(node.data);
                    nodes.set(node.data.key, JSON.stringify(node.data));
                }
            }
        );

        diagram.addDiagramListener(
            "LinkRelinked",
            function (e) {
                const link = e.diagram.selection.first();
                if (link instanceof go.Link) {
                    console.log("Relinked link: " + link.data.key);
                    console.dir(link.data);
                    links.set(link.data.key, JSON.stringify(link.data));
                }
            }
        );

        diagram.model.addChangedListener((evt) => {
            if (!evt.isTransactionFinished) return;
            const tx = evt.object;
            if (tx === null) return;
            tx.changes.each((e) => {
                if (e.change === go.ChangedEvent.Insert && e.modelChange === 'linkDataArray') {
                    console.log(`${evt.propertyName} Added link:`);
                    console.dir(e.newValue);
                    links.set(e.newValue.key, JSON.stringify(e.newValue));
                } else if (e.change === go.ChangedEvent.Remove && e.modelChange === 'linkDataArray') {
                    console.log(`${evt.propertyName} Removed link:`);
                    console.dir(e.oldValue);
                    links.remove(e.oldValue.key);
                }
                // else if (e.change === go.ChangedEvent.Property && e.object instanceof go.Link &&  e.oldValue != null) {
                //     console.log("Relinked link: " + e.newValue.key);
                //     console.dir(e);
                //     links.set(e.newValue.key, JSON.stringify(e.newValue));
                // }
            });
        });

        function onNodesValueChanged(e) {
            if (e.remote) {
                let data = diagram.model.findNodeDataForKey(e.key);
                let node = JSON.parse(e.newValue);
                if (data != null) {
                    console.log("Changed node from remote:");
                    diagram.model.startTransaction();
                    for (let prop in node) {
                        diagram.model.setDataProperty(data, prop, node[prop]);
                    }
                    diagram.model.commitTransaction('Change Node');
                } else {
                    console.log("Added node from remote:");
                    diagram.model.startTransaction();
                    diagram.model.addNodeData(node);
                    diagram.model.commitTransaction('Create Node');
                }
                console.dir(node);
                diagram.rebuildParts();
            }
        }

        function onNodesValueRemoved(e) {
            if (e.remote) {
                let data = diagram.model.findNodeDataForKey(e.key);
                if (data != null) {
                    console.log("Removed node from remote: " + e.key);
                    diagram.model.startTransaction();
                    diagram.model.removeNodeData(data);
                    diagram.model.commitTransaction('Remove Node');
                }
            }
        }

        function onRelationsValueChanged(e) {
            if (e.remote) {
                let data = diagram.model.findLinkDataForKey(e.key);
                let link = JSON.parse(e.newValue);
                if (data != null) {
                    console.log("Changed link from remote:");
                    diagram.model.startTransaction();
                    for (let prop in link) {
                        diagram.model.setDataProperty(data, prop, link[prop]);
                    }
                    ;
                    diagram.model.commitTransaction('Change Link');
                } else {
                    console.log("Added link from remote:");
                    diagram.model.startTransaction();
                    diagram.model.addLinkData(link);
                    diagram.model.commitTransaction('Create Link');
                }
                console.dir(link);
                diagram.rebuildParts();
            }
        }

        function onRelationsValueRemoved(e) {
            if (e.remote) {
                let data = diagram.model.findLinkDataForKey(e.key);
                if (data != null) {
                    console.log("Removed link from remote: " + e.key);
                    diagram.model.startTransaction();
                    diagram.model.removeLinkData(data);
                    diagram.model.commitTransaction('Remove Link');
                }
            }
        }

        nodes.on('valueChanged', onNodesValueChanged);
        nodes.on('valueRemoved', onNodesValueRemoved);
        links.on('valueChanged', onRelationsValueChanged);
        links.on('valueRemoved', onRelationsValueRemoved);

    }

    static load(nodes, links, diagram) {
        diagram.model.startTransaction();
        Object.values(nodes.values).forEach(function (data) {
            diagram.model.addNodeData(JSON.parse(data));
            console.log(data);
        });
        diagram.model.commitTransaction('Init Nodes');

        diagram.model.startTransaction();
        Object.values(links.values).forEach(function (data) {
            diagram.model.addLinkData(JSON.parse(data));
            console.log(data);
        });
        diagram.model.commitTransaction('Init Links');

        diagram.rebuildParts();
    }

}

module.exports = FlowchartBinder;
