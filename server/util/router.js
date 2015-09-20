module.exports = function (server, environment) {
    var path = require('path');
    var express = require('express');

    // Developer routes
    if (environment === 'developer') {
        server.use('/bower', express.static(
            path.join(__dirname, '/../../browser/bower_components/'))
        );
    }

    // Serve static HTML from public directory
    server.use('/', express.static(path.join(__dirname, '/../public/')));

    // 404 Error page
    server.use('*', function (req, res) {
        res.status(404).render(path.join(__dirname, '/../public/404.html'));
    });
};
