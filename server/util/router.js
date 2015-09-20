var path = require('path');
var fs = require('fs');

function injectBrowserSync(req, res) {
    var index = path.join(__dirname, '/../public/index.html');
    fs.readFile(index, { encoding: 'utf-8' }, function (err, data) {
        if (err) {
            throw err;
        }

        // Find last </body> tag, and prepend script to it.
        var script = '<script src="scripts/browser_sync_client.js" async></script>';
        var response = data.replace(/<\/body>(?![\s\S]*<\/body>)/i, script + '</body>');

        res.send(response);
    });
}

module.exports = function (server, environment) {
    var express = require('express');

    // Developer routes
    if (environment === 'developer') {
        // Inject BrowserSync client side handler
        server.get('/', injectBrowserSync);

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
