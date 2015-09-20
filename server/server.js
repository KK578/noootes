module.exports = function (environment) {
    var server = require('express');

    var util = require('./util/util.js');
    util.setup(server);
    util.logger(server, environment);
    util.router(server, environment);

    return server;
};
