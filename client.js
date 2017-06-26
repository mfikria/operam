'use strict';

exports.datatype = {
    map: require('./src/data-type/map'),
    string: require('./src/data-type/string')
};

exports.core = {
    Workspace: require('./src/core/workspace'),
    WorkspaceManager: require('./src/core/workspace-manager'),
    OperationBundle: require('./src/helper/operation-bundle')
};

exports.connection = {
    AbstractConnector: require('./src/connector/abstract-connector'),
    SocketConnector: require('./src/connector/socket-connector')
};

exports.ModelManager = require('./src/core/model-manager');
exports.TextareaBinder = require('./src/data-binding/textarea-binding');
