module.exports = {
    options: {
        spawn: false,
        interrupt: true
    },
    bower: {
        files: ['bower.json'],
        tasks: ['build-bower']
    },
    components: {
        files: ['browser/custom_components/**/*', 'browser/behaviors/**/*'],
        tasks: [
            'jshint:components',
            'jscs:components',
            'build-components'
        ]
    },
    media: {
        files: ['browser/media/**/*'],
        tasks: ['build-media']
    },
    server: {
        options: {
            reload: true
        },
        files: [
            'gruntfile.js',
            'configs/grunt/*.js',
            'server/**/*.js'
        ],
        tasks: [
            'express:developer:stop',
            'jshint:server',
            'jscs:server',
            'build-server',
            'express:developer'
        ]
    },
    scss: {
        files: ['browser/stylesheets/partials/*.scss'],
        tasks: ['sass']
    },
    views: {
        files: [
            'browser/*.html',
            'browser/stylesheets/*.scss',
            'browser/scripts/*.js'
        ],
        tasks: [
            'jshint:views',
            'jscs:views',
            'build-views'
        ]
    },
    wct: {
        files: ['browser/test/**/*'],
        tasks: [
            'jshint:wct',
            'jscs:wct',
            'build-wct'
        ]
    }
};
