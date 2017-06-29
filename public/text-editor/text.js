window.onload = function () {
    // create unique identifier per client
  const userId = uuidv4();
  const heading = document.getElementById('heading');
  heading.innerHTML += `: ${userId}`;

  const socket = io('/');

    // initialize instance
  const connector = new operam.connection.SocketConnector(socket, 'text-shared');
  var currentDocument = new operam.core.Document(connector);
  const engine = new operam.OTEngine(currentDocument, userId);

  engine.start()
        .then(() => {
          const title = engine.get('title', () => {
            const result = engine.newString();
            result.set('Testing');
            return result;
          });

          const text = engine.get('text', () => {
            const result = engine.newString();
            result.set('Testing content');
            return result;
          });

          operam.TextareaBinder.bind(text, document.getElementById('text'));
          operam.TextareaBinder.bind(title, document.getElementById('title'));
        });
};
