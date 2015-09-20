var browserSync = require('browser-sync');

function handleCustomElement(event, file) {
    var fs = require('fs');
    var bs = browserSync.get('Server');

    // Split file path by '/' and '\'.
    // The element is designated by the 2nd to last directory.
    var directories = file.split(/[\\\/]/);
    var element = directories[directories.length - 2];

    fs.readFile(file, { encoding: 'utf-8' }, function (err, css) {
        if (err) {
            throw err;
        }

        var detail = {
            element: element,
            style: css
        };

        // Fire event on socket for client side listener.
        bs.sockets.emit('custom-component-css', detail);
    });
}

module.exports = function (server, environment) {
    if (environment === 'developer') {
        var bs = browserSync.create('Server');

        process.nextTick(function () {
            var port = 3000;
            var proxy = 'localhost:' + parseInt(server.get('port'));

            bs.init({
                files: [
                    {
                        match: ['build/public/custom_components/**/*.css'],
                        fn: handleCustomElement
                    },
                    {
                        match: ['build/public', '!build/public/custom_components/**/*.css']
                    }
                ],
                logPrefix: 'BrowserSync',
                minify: true,
                open: false,
                reloadOnRestart: true,
                reloadDebounce: 2000,
                server: false,
                port: port,
                proxy: proxy
            });

            console.log('[BrowserSync] Loading');
        });
    }
};
