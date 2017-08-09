const ports = ['R', 'L', 'T', 'B'];
console.dir(window.myDiagram);

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function insertRandomWord(index, string, data) {
  return `${string.substr(0, index)} ${data} ${string.substr(index)}`;
}

function deleteRandomWord(index, string) {
  return (
        string.substr(0, index) +
        string.substr((index + Math.random()) % Math.floor(string.length / 2))
  );
}

function addNode() {
  const x = randomIntFromInterval(-400, 400);
  const y = randomIntFromInterval(20, 700);
  const val = `${x} ${y}`;
  const data = { text: `Test ${x} ${y}`, figure: 'Diamond', key: -9, loc: val };

  window.myDiagram.model.startTransaction();
  window.myDiagram.model.addNodeData(data);
  window.myDiagram.model.commitTransaction('Add Node');
  console.log("add node");
}

function removeNode() {
  const data = window.myDiagram.model.findNodeDataForKey(
        randomIntFromInterval(1, window.myDiagram.nodes.count) * -1
    );
  window.myDiagram.model.startTransaction();
  window.myDiagram.model.removeNodeData(data);
  window.myDiagram.model.commitTransaction('Remove Node');
  console.log("remove node");
}
myDiagram.model.startTransaction();
myDiagram.model.setDataProperty(myDiagram.model.findNodeDataForKey(), 'loc', '50 50');
myDiagram.model.commitTransaction('Remove Node');
function moveNode() {
  const x = randomIntFromInterval(-400, 400);
  const y = randomIntFromInterval(20, 700);
  const val = `${x} ${y}`;

  const data = window.myDiagram.model.findNodeDataForKey(
        randomIntFromInterval(1, window.myDiagram.nodes.count) * -1
    );
  window.myDiagram.model.startTransaction();
  window.myDiagram.model.setDataProperty(data, 'loc', val);
  window.myDiagram.model.commitTransaction('Move Node');
  console.log("move node");
}

function changeTextNode() {
  const data = window.myDiagram.model.findNodeDataForKey(
        randomIntFromInterval(1, window.myDiagram.nodes.count) * -1
    );
  window.myDiagram.model.startTransaction();
  window.myDiagram.model.setDataProperty(data, 'text', Math.random());
  window.myDiagram.model.commitTransaction('Change Text Node');
  console.log("change text node");
}

function addLink() {
  let from = -1;
  let to = -1;

  while (from === to) {
    from = randomIntFromInterval(1, window.myDiagram.nodes.count) * -1;
    to = randomIntFromInterval(1, window.myDiagram.nodes.count) * -1;
  }
  const data = { from, to, fromPort: ports[randomIntFromInterval(0, 3)], toPort: ports[randomIntFromInterval(0, 3)] };

  window.myDiagram.model.startTransaction();
  window.myDiagram.model.addLinkData(data);
  window.myDiagram.model.commitTransaction('Create Link');
  console.log("create link");
}

function removeLink() {
  const data = window.myDiagram.model.findLinkDataForKey(
        randomIntFromInterval(1, window.myDiagram.links.count) * -1
    );
  window.myDiagram.model.startTransaction();
  window.myDiagram.model.removeLinkData(data);
  window.myDiagram.model.commitTransaction('Remove Link');
  console.log("remove link");
}

function relinkLink() {
  const data = window.myDiagram.model.findLinkDataForKey(
        randomIntFromInterval(1, window.myDiagram.links.count) * -1
    );

  let from = -1;
  let to = -1;

  while (from === to) {
    from = randomIntFromInterval(1, window.myDiagram.nodes.count) * -1;
    to = randomIntFromInterval(1, window.myDiagram.nodes.count) * -1;
  }

  window.myDiagram.model.startTransaction();
  window.myDiagram.model.setDataProperty(data, 'from', from);
  window.myDiagram.model.setDataProperty(data, 'to', to);
  window.myDiagram.model.commitTransaction('Change Link');
  console.log("change link");
}

$(document).ready(() => {
  if (window.location.pathname === '/text-editor/') {
    const times = 300;
    for (let i = 0; i < times; i++) {
      $.ajax({
        url: 'http://setgetgo.com/randomword/get.php',
        cache: false,
        success(data) {
          const string = $('#text').val();
          const index = Math.random() % (string.length + 1);
          if (Math.random() >= 0.6) {
            $('#text').val(insertRandomWord(index, string, data));
          } else {
            $('#text').val(deleteRandomWord(index, string));
          }

          document.getElementById('text').dispatchEvent(new Event('input'));
        }
      });
    }
  } else if (window.location.pathname === '/flowchart-diagram/') {
    const times = 50;
    for (i = 0; i < times; i++) {
      switch (randomIntFromInterval(0, 6)) {
        case 0:
          addNode();
          break;
        case 1:
          removeNode();
          break;
        case 2:
          moveNode();
          break;
        case 3:
          changeTextNode();
          break;
        case 4:
          addLink();
          break;
        case 5:
          removeLink();
          break;
        case 6:
          relinkLink();
          break;
      }
      window.myDiagram.rebuildParts();
    }
  }
});
