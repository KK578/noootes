module.exports = {
    build: ['build/**/*'],
    bower: ['browser/bower_components/**/*'],
    production: [
        'build/public/custom_components/*.js',
        'build/public/custom_components/*.css',
        'build/public/stylesheets/'
    ],
    wct: ['build/public/test']
};
