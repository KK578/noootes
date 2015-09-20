﻿module.exports = {
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
    },
    media: {
        files: [
            {
                expand: true,
                cwd: 'browser/media/',
                src: ['**/*.{jpg,png,ico}'],
                dest: 'build/public/media/'
            }
        ]
    }
};
