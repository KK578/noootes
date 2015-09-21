module.exports = {
    suites: ['build/public/test/'],
    plugins: {
        sauce: {
            disabled: true,
            browsers: [
                'Windows 8.1/internet explorer',
                'OS X 10.10/chrome',
                'OS X 10.10/firefox',
                'OS X 10.10/safari'
            ]
        }
    }
};
