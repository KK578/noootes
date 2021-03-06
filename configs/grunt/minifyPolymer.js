﻿module.exports = {
    bower: {
        files: [
            {
                expand: true,
                cwd: 'browser/bower_components/',
                src: [
                    '**/*.html',
                    '!**/{index,demo}.html',
                    '!**/{demo,demos,docs,explainer,node_modules,test,tests}/**/*'
                ],
                dest: 'build/public/bower_components/'
            }
        ]
    },
    components: {
        files: [
            {
                expand: true,
                cwd: 'browser/custom_components/',
                src: ['**/*.html'],
                dest: 'build/public/custom_components/'
            },
            {
                expand: true,
                cwd: 'browser/behaviors/',
                src: ['**/*.html'],
                dest: 'build/public/behaviors/'
            }
        ]
    },
    production: {
        files: [
            {
                expand: true,
                cwd: 'build/public/',
                src: ['*.html'],
                dest: 'build/public/'
            },
            {
                expand: true,
                cwd: 'build/public/custom_components/',
                src: ['**/*.html'],
                dest: 'build/public/custom_components/'
            },
            {
                expand: true,
                cwd: 'build/public/behaviors/',
                src: ['**/*.html'],
                dest: 'build/public/behaviors/'
            }
        ]
    },
    views: {
        files: [
            {
                expand: true,
                cwd: 'browser/',
                src: ['*.html'],
                dest: 'build/public/'
            }
        ]
    }
};
