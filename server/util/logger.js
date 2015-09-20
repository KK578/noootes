module.exports = function (server, environement) {
    var morgan = require('morgan');

    switch (environement) {
        case 'developer':
            server.use(morgan('dev', {
                skip: function (req, res) {
                    // True if requesting a bower_component
                    var bower = req.originalUrl.indexOf('bower_component') !== -1;
                    // True if an error code
                    var err = res.statusCode >= 400;

                    // Skip logging if a bower_component unless it is an error.
                    return bower && !err;
                }
            }));
            break;

        case 'production':
            server.user(morgan('tiny'));
            break;
    }
};
