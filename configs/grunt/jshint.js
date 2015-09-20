module.exports = {
    options: {
        jshintrc: 'configs/.jshintrc'
    },
    node: {
        src: [
            'gruntfile.js',
            'configs/grunt/*.js'
        ]
    },
    components: {
        src: ['browser/custom_components/**/*.js']
    }
};
