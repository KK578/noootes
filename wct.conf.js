module.exports = {
    suites: ['build/public/test/'],
    plugins: {
        local: {
            disabled: true,
            browsers: [
                'chrome'
            ]
        },
        sauce: {
            disabled: true,
            browsers: [
                'Windows 10/internet explorer',
                'Windows 10/edge',
                'OS X 10.10/chrome',
                'OS X 10.10/firefox',
                'OS X 10.10/safari'
            ]
        }
    }
};
