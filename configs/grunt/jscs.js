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
        options: {
            config: 'configs/wct.jscsrc'
        },
        src: ['browser/test/**/*.js']
    }
};
