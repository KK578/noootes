module.exports = {
    options: {
        config: 'configs/.jscsrc'
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
