module.exports = {
    build: ['build/**/*'],
    bower: ['browser/bower_components/**/*'],
    production: [
        'build/public/custom_components/**/*.js',
        'build/public/custom_components/**/*.css',
        'build/public/behaviors/**/*.js',
        'build/public/stylesheets/'
    ],
    deploy: [
        'build/public/test',
        'build/public/scripts/browser_sync_client.js',
        'build/public/bower.html'
    ]
};
