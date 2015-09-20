module.exports = {
    bower: {
        files: [
            {
                expand: true,
                cwd: 'browser/bower_components/',
                src: [
                    '**/*.min.js',
                    '!**/{demo,demos,docs,explainer,node_modules,test,tests}/**/*'
                ],
                dest: 'build/public/bower_components/'
            }
        ]
    }
};
