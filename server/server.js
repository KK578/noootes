module.exports = function (environment) {
    var server = require('express');

    var util = require('./util/util.js');
    util.setup(server);

    return server;
};
