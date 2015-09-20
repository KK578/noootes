module.exports = {
    options: {
        config: 'configs/.jscsrc'
    },
    server: {
        src: [
            'gruntfile.js',
            'configs/grunt/*.js',
            'server/**/*.js'
        ]
    },
    components: {
        src: ['browser/custom_components/**/*.js']
    },
    views: {
        src: ['browser/scripts/**/*.js']
    },
    wct: {
        src: ['browser/test/**/*.js']
    }
};
