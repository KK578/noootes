var path = require('path');
var fs = require('fs');

function getBowerComponents(req, res) {
    var glob = require('glob');
    var bower = path.join(__dirname, '/../public/bower.html');

    fs.readFile(bower, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
        }

        // Find all bower_components that contain an index.html at their root.
        glob('*/index.html', { cwd: 'browser/bower_components/' }, function (err, files) {
            if (err) {
                throw err;
            }

            // Elements are rendered by finding the 'component' item in the object.
            // All elements are listed as 'element-name/index.html', so slice after the '/'.
            var elements = files.map(function (indexPath) {
                return { component: indexPath.split('/')[0] };
            });

            // Most unreliable section, find the empty array [], and replace with element list.
            res.send(html.replace(/\[\]/i, JSON.stringify(elements)));
        });
    });
}

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

        // Redirect to use staging Firebase while in development.
        server.get('/scripts/noootes.js', function (req, res) {
            res.redirect('/scripts/noootes-staging.js');
        });

        server.get('/bower', getBowerComponents);
        server.use('/bower', express.static(
            path.join(__dirname, '/../../browser/bower_components/'))
        );
    }

    server.post('/form.html', function (req, res) {
        res.render(path.join(__dirname, '/../public/form.html'));
    });

    // Serve static HTML from public directory
    server.use('/', express.static(path.join(__dirname, '/../public/')));

    // 404 Error page
    server.use('*', function (req, res) {
        res.status(404).render(path.join(__dirname, '/../public/404.html'));
    });
};
