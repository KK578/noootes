module.exports = {
    options: {
        mangle: {},
        screwIE8: true
    },
    bower: {
        files: [
            {
                expand: true,
                cwd: 'browser/bower_components/',
                src: [
                    '**/*.js',
                    '!**/*.min.js',
                    '!**/{gruntfile,gulpfile}.js',
                    '!**/{demo,demos,docs,explainer,node_modules,test,tests}/**/*'
                ],
                dest: 'build/public/bower_components/'
            }
        ]
    }
};
