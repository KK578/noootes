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
    wct: {
        src: ['browser/test/**/*.js']
    }
};
