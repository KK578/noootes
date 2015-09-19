module.exports = {
    default: {
        description: 'Builds the current build for Development',
        tasks: [
            'notify_hooks',
            'jshint',
            'jscs'
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
