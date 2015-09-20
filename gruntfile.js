var path = require('path');

module.exports = function (grunt) {
    // Print timers for executing tasks
    require('time-grunt')(grunt);

    // Seperate each config from the main gruntfile to keep this small.
    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'configs/grunt/'),
        jitGrunt: {
            staticMappings: {
                bower: 'grunt-bower-task',
                minifyPolymer: 'grunt-minify-polymer',
                minifyPolymerCSS: 'grunt-minify-polymer',
                notify_hooks: 'grunt-notify'
            }
        }
    });

    grunt.registerTask('wctSuite', 'Creates suite.js for loading WCT Tests', function () {
        var path = require('path');
        var glob = require('glob');

        var done = this.async();
        var directory = 'build/public/test/';

        glob('**/*/*.html', { cwd: directory }, function (err, files) {
            if (err) {
                throw err;
            }

            var filePath = path.join(directory, 'suite.js');
            var file = 'WCT.loadSuites(' + JSON.stringify(files) + ');';
            grunt.file.write(filePath, file);

            var message = files.length + ' ' +
                grunt.util.pluralize(files.length, 'test/tests') + ' loaded into WCT Suite.';
            grunt.log.ok(message);
            done();
        });
    });
};
