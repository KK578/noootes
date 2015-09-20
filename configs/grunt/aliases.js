module.exports = {
    default: {
        description: 'Builds the current build for Development',
        tasks: [
            'notify_hooks',
            'lint',
            'bower:developer'
        ]
    },
    build: {
        description: 'Builds the current build for Production',
        tasks: [
            'notify_hooks',
            'lint',
            'bower:production'
        ]
    },
    lint: {
        description: 'Lints the project to check for Javascript errors and Code Style',
        tasks: [
            'jshint',
            'jscs'
        ]
    }
};
