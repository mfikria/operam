window.onload = function () {
    // create unique identifier per client
    var id = uuidv4();
    var heading = document.getElementById('heading');
    heading.innerHTML += ': ' + id;

    var socket = io('/');

    // initialize instance
    var connector = new operam.connection.SocketConnector(operam.ModelManager.defaultType(), socket, window.location.hash || 'shared');
    var workspace = new operam.core.Workspace(connector);
    var modelManager = new operam.ModelManager(workspace);

    modelManager.open()
        .then(function () {
            var title = modelManager.get('title', function () {
                var result = modelManager.newString();
                result.set('Testing');
                return result;
            });

            var text = modelManager.get('text', function () {
                var result = modelManager.newString();
                result.set('Testing content');
                return result;
            });

            operam.TextareaBinder.bind(text, document.getElementById('text'));
            operam.TextareaBinder.bind(title, document.getElementById('title'));
        });
}