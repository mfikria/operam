'use strict';

exports.datatype = {
    map: require('./src/data-type/map'),
    string: require('./src/data-type/string')
};

exports.core = {
    Document: require('./src/core/document'),
    DocumentManager: require('./src/core/document-manager'),
    OperationBundle: require('./src/helper/operation-bundle')
};

exports.connection = {
    OTConnector: require('./src/connector/ot-connector'),
    SocketConnector: require('./src/connector/socket-connector')
};

exports.OTEngine = require('./src/core/ot-engine');
exports.TextareaBinder = require('./src/data-binding/textarea-binder');
exports.FlowchartBinder = require('./src/data-binding/flowchart-binder');
