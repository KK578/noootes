chai.should();

describe('<noootes-app>', function () {
    function listenToResponseOnFiringEvent(firedEvent, responseEvent, eventDetail, done, assertions) {
        function listener(event) {
            if (assertions) {
                assertions(event);
            }

            window.removeEventListener(responseEvent, listener);
            done();
        }

        window.addEventListener(responseEvent, listener);
        window.dispatchEvent(new CustomEvent(firedEvent, { detail: eventDetail }));
    }

    var testUser;

    before(function () {
        var name = 'wct-tester-' + Math.round(50000 * Math.random());
        var email = name + '@test.suite';
        var password = 'wct-tester';
        testUser = {
            email: email,
            password: password,
            newEmail: 'new-' + email,
            newPassword: 'new-' + password
        };
    });

    after(function (done) {
        var firebase = document.querySelector('#firebase-auth');

        firebase.addEventListener('user-removed', function () {
            done();
        });

        firebase.addEventListener('error', function (event) {
            console.log(new Error('Failed to remove ' + testUser.email));
            console.log(event);
            done();
        });

        firebase.removeUser(testUser.newEmail, testUser.newPassword);
    });

    /////////////////////////////////////////////
    // Initial Login Test
    /////////////////////////////////////////////
    it('should fire "firebase-login-error" on "firebase-login" with unregistered email', function (done) {
        function assertions(event) {
            event.detail.code.should.equal('INVALID_USER');
            event.detail.message.should.equal('The specified user does not exist.');
        }

        var detail = {
            email: testUser.email,
            password: testUser.password
        };

        listenToResponseOnFiringEvent('firebase-login', 'firebase-login-error', detail, done, assertions);
    });

    /////////////////////////////////////////////
    // Registration Tests
    /////////////////////////////////////////////
    it('should register new user and fire "toast-message" on "firebase-register"', function (done) {
        var counter = 0;

        function end() {
            if (++counter === 2) {
                done();
            }
        }

        function toastAssertions(event) {
            event.detail.message.should.equal('Successfully registered your account!\nPlease log in.');

            window.removeEventListener('toast-message', toastAssertions);
            end();
        }

        var detail = {
            email: testUser.email,
            password: testUser.password
        };

        window.addEventListener('toast-message', toastAssertions);
        listenToResponseOnFiringEvent('firebase-register', 'firebase-register-success', detail, end);
    });

    it('should fire "firebase-register-error" on "firebase-register" with the same email', function (done) {
        function assertions(event) {
            event.detail.code.should.equal('EMAIL_TAKEN');
            event.detail.message.should.equal('The specified email address is already in use.');
        }

        var detail = {
            email: testUser.email,
            password: testUser.password
        };

        listenToResponseOnFiringEvent('firebase-register', 'firebase-register-error', detail, done, assertions);
    });

    /////////////////////////////////////////////
    // Login Tests
    /////////////////////////////////////////////
    it('should fire "firebase-login-error" on "firebase-login" with incorrect password ', function (done) {
        function assertions(event) {
            event.detail.code.should.equal('INVALID_PASSWORD');
            event.detail.message.should.equal('The specified password is incorrect.');
        }

        var detail = {
            email: testUser.email,
            password: 'ThisIsn\'tThePassword'
        };

        listenToResponseOnFiringEvent('firebase-login', 'firebase-login-error', detail, done, assertions);
    });

    it('should fire "firebase-login-success" on "firebase-login" with the correct user details', function (done) {
        function assertions(event) {
            event.detail.user.password.email.should.equal(testUser.email);

            var element = document.querySelector('noootes-app');
            element._selectedPage.should.equal(1);
        }

        var detail = {
            email: testUser.email,
            password: testUser.password
        };

        listenToResponseOnFiringEvent('firebase-login', 'firebase-login-success', detail, done, assertions);
    });

    /////////////////////////////////////////////
    // Logout Test
    /////////////////////////////////////////////
    it('should fire "firebase-logout-success" on "firebase-logout"', function (done) {
        function assertions() {
            var element = document.querySelector('noootes-app');
            element._selectedPage.should.equal(0);
        }

        var detail = {};

        listenToResponseOnFiringEvent('firebase-logout', 'firebase-logout-success', detail, done, assertions);
    });

    /////////////////////////////////////////////
    // Change Email Tests
    /////////////////////////////////////////////
    it('should fire "firebase-change-email-error" on "firebase-change-email" with invalid email', function (done) {
        function assertions(event) {
            event.detail.code.should.equal('INVALID_USER');
            event.detail.message.should.equal('The specified user does not exist.');
        }

        var detail = {
            email: 'not-' + testUser.email,
            password: testUser.password,
            newEmail: testUser.newEmail
        };

        listenToResponseOnFiringEvent('firebase-change-email', 'firebase-change-email-error', detail, done, assertions);
    });

    it('should fire "firebase-change-email-error" on "firebase-change-email" with invalid password', function (done) {
        function assertions(event) {
            event.detail.code.should.equal('INVALID_PASSWORD');
            event.detail.message.should.equal('The specified password is incorrect.');
        }

        var detail = {
            email: testUser.email,
            password: 'not-' + testUser.password,
            newEmail: testUser.newEmail
        };

        listenToResponseOnFiringEvent('firebase-change-email', 'firebase-change-email-error', detail, done, assertions);
    });

    it('should fire "firebase-change-email-error" on "firebase-change-email" with a new email that is already in use', function (done) {
        function assertions(event) {
            event.detail.code.should.equal('EMAIL_TAKEN');
            event.detail.message.should.equal('The specified email address is already in use.');
        }

        var detail = {
            email: testUser.email,
            password: testUser.password,
            newEmail: testUser.email
        };

        listenToResponseOnFiringEvent('firebase-change-email', 'firebase-change-email-error', detail, done, assertions);
    });

    it('should fire "firebase-change-email-success" on "firebase-change-email" with the correct user details', function (done) {
        var detail = {
            email: testUser.email,
            password: testUser.password,
            newEmail: testUser.newEmail
        };

        listenToResponseOnFiringEvent('firebase-change-email', 'firebase-change-email-success', detail, done);
    });

    /////////////////////////////////////////////
    // Change Password Tests
    /////////////////////////////////////////////
    it(' should fire "firebase-change-password-error" on "firebase-change-password" with invalid user email', function (done) {
        function assertions(event) {
            event.detail.code.should.equal('INVALID_USER');
            event.detail.message.should.equal('The specified user does not exist.');
        }

        var detail = {
            email: 'not-' + testUser.newEmail,
            password: testUser.password,
            newPassword: testUser.newPassword
        };

        listenToResponseOnFiringEvent('firebase-change-password', 'firebase-change-password-error', detail, done, assertions);
    });

    it('should fire "firebase-change-password-error" on "firebase-change-password" with invalid password', function (done) {
        function assertions(event) {
            event.detail.code.should.equal('INVALID_PASSWORD');
            event.detail.message.should.equal('The specified password is incorrect.');
        }

        var detail = {
            email: testUser.newEmail,
            password: 'not-' + testUser.password,
            newPassword: testUser.newPassword
        };

        listenToResponseOnFiringEvent('firebase-change-password', 'firebase-change-password-error', detail, done, assertions);
    });

    it('should fire "firebase-change-password-success" on "firebase-change-password" with correct user details', function (done) {
        var detail = {
            email: testUser.newEmail,
            password: testUser.password,
            newPassword: testUser.newPassword
        };

        listenToResponseOnFiringEvent('firebase-change-password', 'firebase-change-password-success', detail, done);
    });

    it('could fire "firebase-delete-account-success" on "firebase-delete-account"');
});
