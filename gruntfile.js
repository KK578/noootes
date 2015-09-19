var path = require('path');

module.exports = function (grunt) {
    // Print timers for executing tasks
    require('time-grunt')(grunt);

    // Seperate each config from the main gruntfile to keep this small.
    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'configs/grunt/'),
        jitGrunt: {
            staticMappings: {
                notify_hooks: 'grunt-notify'
            }
        }
    });
};
