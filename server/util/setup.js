module.exports = function (server) {
    var path = require('path');
    var ejs = require('ejs');

    // Setup renderer for HTML
    server.set('views', path.join(__dirname, '/../public/'));
    server.engine('html', ejs.renderFile);
    server.set('view engine', 'html');

    // GZIP
    server.use(require('compression')());
};
