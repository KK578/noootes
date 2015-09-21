module.exports = {
    options: {
        jshintrc: 'configs/.jshintrc'
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
            jshintrc: 'configs/wct.jshintrc'
        },
        src: ['browser/test/**/*.js']
    }
};
