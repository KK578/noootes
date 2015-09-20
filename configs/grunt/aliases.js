module.exports = {
    default: {
        description: 'Builds the current build for Development',
        tasks: [
            'notify_hooks',
            'lint',
            'bower:developer',
            'build-bower',
            'build-components',
            'build-media',
            'build-server',
            'build-views',
            'build-wct'
        ]
    },
    lint: {
        description: 'Lints the project to check for Javascript errors and Code Style',
        tasks: [
            'jshint',
            'jscs'
        ]
    },
    build: {
        description: 'Builds the current build for Production',
        tasks: [
            'notify_hooks',
            'lint',
            'bower:production',
            'build-bower',
            'build-components',
            'build-media',
            'build-server',
            'build-views',
            'build-wct'
        ]
    },
    serve: {
        description: 'Serve the current build as Developer',
        tasks: [
            'notify_hooks',
            'express:developer',
            'watch'
        ]
    },
    'serve:public': {
        description: 'Serve the current build as Developer',
        tasks: [
            'notify_hooks',
            'express:developerPublic',
            'watch'
        ]
    },
    'serve:production': {
        description: 'Serve the current build as Production',
        tasks: [
            'notify_hooks',
            'express:production',
            'watch'
        ]
    },
    'build-bower': {
        description: 'Build bower_components',
        tasks: [
            'newer:minifyPolymer:bower',
            'newer:minifyPolymerCSS:bower',
            'newer:uglify:bower',
            'sync:bower'
        ]
    },
    'build-components': {
        description: 'Build custom_components',
        tasks: [
            'newer:minifyPolymer:components',
            'newer:sass:components',
            'newer:uglify:components'
        ]
    },
    'build-media': {
        description: 'Build media files',
        tasks: [
            'sync:media'
        ]
    },
    'build-server': {
        descript: 'Build node server files',
        tasks: [
            'newer:uglify:server'
        ]
    },
    'build-views': {
        description: 'Build views',
        tasks: [
            'newer:minifyPolymer:views',
            'newer:sass:views',
            'newer:uglify:views'
        ]
    },
    'build-wct': {
        description: 'Build web component tests',
        tasks: [
            'sync:wct',
            'wctSuite'
        ]
    }
};
