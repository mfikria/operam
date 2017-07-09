window.onload = function () {
    init();

    // create unique identifier per client
  const userId = `${Date.now()}_${Math.floor(Math.random() * 2000)}`;
    // const heading = document.getElementById('heading');
    // heading.innerHTML += `: ${userId}`;

  const socket = io('/');

    // initialize instance
  const connector = new operam.connection.SocketConnector(socket, 'flowchart-shared');
  const currentDocument = new operam.core.Document(connector);
  const engine = new operam.OTEngine(currentDocument, userId);

  engine.start()
        .then(() => {
          const objects = engine.get('object', () => {
            const result = engine.newMap();
            result.set('key', 'value');
            return result;
          });

          const relations = engine.get('relation', () => {
            const result = engine.newMap();
            result.set('keyRelation', 'valueRelation');
            return result;
          });

          operam.FlowchartBinder.bind(objects, myDiagram);
        });
};
