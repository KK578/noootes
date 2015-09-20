module.exports = {
    default: {
        description: 'Builds the current build for Development',
        tasks: [
            'notify_hooks',
            'lint',
            'bower:developer',
            'build-bower'
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
            'build-bower'
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
    }
};
