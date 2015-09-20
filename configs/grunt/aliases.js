module.exports = {
    default: {
        description: 'Builds the current build for Development',
        tasks: [
            'notify_hooks',
            'lint',
            'bower:developer',
            'build-bower',
            'build-components'
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
            'build-components'
        ]
    },
    'build-bower': {
        description: 'Build bower_components',
        tasks: [
            'newer:minifyPolymer:bower',
            'newer:minifyPolymerCSS:bower',
            'newer:uglify:bower',
            'newer:copy:bower'
        ]
    },
    'build-components': {
        description: 'Build custom_components',
        tasks: [
            'newer:minifyPolymer:components',
            'newer:sass:components',
            'newer:uglify:components'
        ]
    }
};
