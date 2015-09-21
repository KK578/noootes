chai.should();

describe('<splash-screen>', function () {
    var splashScreen;

    before(function () {
        splashScreen = document.querySelector('splash-screen');
    });

    it('should contain inner elements', function () {
        splashScreen.innerHTML.should.match(/<h1>Loading...<\/h1>/);
    });

    // NOTE: Potential for a race condition to occur here as testing requires sequential calls.
    it('should add class to body while animating', function () {
        splashScreen.runAnimation();
        document.body.classList.contains('splash-animating').should.equal(true);
    });

    it('should remove class from body and remove itself from document after running animation', function (done) {
        splashScreen.addEventListener('neon-animation-finish', function () {
            document.body.classList.contains('splash-animating').should.equal(false);
            splashScreen = document.querySelector('splash-screen');

            var result = splashScreen === null ?
                undefined :
                new Error('splash-screen element not deleted');

            done(result);
        });
    });
});
