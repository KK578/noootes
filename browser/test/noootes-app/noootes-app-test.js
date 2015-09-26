/* globals sinon */
/* jshint -W030 */
chai.should();

describe('<noootes-app>', function () {
    function fire(name, detail) {
        window.dispatchEvent(new CustomEvent(name, { detail: detail }));
    }

    function listenOnce(name, callback) {
        function listener(event) {
            window.removeEventListener(name, listener);
            callback(event);
        }

        window.addEventListener(name, listener);
    }

    var testUser;
    var firebase;

    before(function () {
        firebase = document.querySelector('#firebase-auth');

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

    describe('Login', function () {
        it('should call firebase.login on "firebase-login"', function () {
            sinon.stub(firebase, 'login');

            var detail = {
                email: testUser.email,
                password: testUser.password
            };

            fire('firebase-login', detail);
            firebase.login.should.have.been.calledWith(detail);
            firebase.login.restore();
        });

        it('should fire "firebase-login-error" on "error"', function (done) {
            listenOnce('firebase-login-error', function (event) {
                event.detail.should.equal(detail);

                done();
            });

            var detail = {
                code: 'INVALID_USER',
                message: 'The specified user does not exist.'
            };
            firebase.fire('error', detail);
        });

        it('should fire "firebase-login-success" on "login"', function (done) {
            listenOnce('firebase-login-success', function () {
                var element = document.querySelector('noootes-app');
                element._selectedPage.should.equal(1);
                Noootes.Firebase.User.should.equal(detail.user);

                done();
            });

            var detail = {
                user: {
                    password: { email: 'Web@Component.Tester' }
                }
            };
            firebase.fire('login', detail);
        });
    });

    describe('Logout', function () {
        it('should call firebase.logout on "firebase-logout"', function () {
            sinon.stub(firebase, 'logout');

            fire('firebase-logout');
            firebase.logout.should.have.been.called;
            firebase.logout.restore();
        });

        it('should fire "firebase-logout-success" on "logout"', function (done) {
            listenOnce('firebase-logout-success', function () {
                var element = document.querySelector('noootes-app');
                element._selectedPage.should.equal(0);
                (Noootes.Firebase.User === undefined).should.equal(true);

                done();
            });

            firebase.fire('logout');
        });
    });

    describe('Register', function () {
        it('should call firebase.createUser on "firebase-register"', function () {
            sinon.stub(firebase, 'createUser');

            var detail = {
                email: testUser.email,
                password: testUser.password
            };

            fire('firebase-register', detail);
            firebase.createUser.should.have.been.calledWith(detail.email, detail.password);
            firebase.createUser.restore();
        });

        it('should fire "firebase-register-error" on "error"', function (done) {
            listenOnce('firebase-register-error', function (event) {
                event.detail.should.equal(detail);

                done();
            });

            var detail = {
                code: 'EMAIL_TAKEN',
                message: 'The specified user already exists.'
            };
            firebase.fire('error', detail);
        });

        it('should fire "firebase-register-success" and "toast-message" on "user-created"', function (done) {
            var counter = 0;

            function end() {
                if (++counter >= 2) {
                    done();
                }
            }

            listenOnce('toast-message', end);
            listenOnce('firebase-register-success', end);

            firebase.fire('user-created');
        });
    });

    describe('Change Email', function () {
        it('should call firebase.changeEmail on "firebase-change-email"', function () {
            sinon.stub(firebase, 'changeEmail');

            var detail = {
                email: testUser.email,
                password: testUser.password,
                newEmail: testUser.newEmail
            };

            fire('firebase-change-email', detail);
            firebase.changeEmail.should.have.been.calledWith(detail.email, detail.newEmail, detail.password);
            firebase.changeEmail.restore();
        });

        it('should fire "firebase-change-email-error" on "error"', function (done) {
            listenOnce('firebase-change-email-error', function (event) {
                event.detail.should.equal(detail);

                done();
            });

            var detail = {
                code: 'INVALID_USER',
                message: 'The specified user does not exist.'
            };
            firebase.fire('error', detail);
        });

        it('should fire "firebase-change-email-success" on "email-changed"', function (done) {
            var counter = 0;

            function end() {
                if (++counter >= 2) {
                    done();
                }
            }

            listenOnce('toast-message', end);
            listenOnce('firebase-change-email-success', end);

            firebase.fire('email-changed');
        });
    });

    describe('Change Password', function () {
        it('should call firebase.changePassword on "firebase-change-password"', function () {
            sinon.stub(firebase, 'changePassword');

            var detail = {
                email: testUser.email,
                password: testUser.password,
                newPassword: testUser.newPassword
            };

            fire('firebase-change-password', detail);
            firebase.changePassword.should.have.been.calledWith(detail.email, detail.password, detail.newPassword);
            firebase.changePassword.restore();
        });

        it('should fire "firebase-change-password-error" on "error"', function (done) {
            listenOnce('firebase-change-password-error', function (event) {
                event.detail.should.equal(detail);

                done();
            });

            var detail = {
                code: 'INVALID_USER',
                message: 'The specified user does not exist.'
            };
            firebase.fire('error', detail);
        });

        it('should fire "firebase-change-password-success" and "toast-message" on "password-changed"', function (done) {
            var counter = 0;

            function end() {
                if (++counter >= 2) {
                    done();
                }
            }

            listenOnce('toast-message', end);
            listenOnce('firebase-change-password-success', end);

            firebase.fire('password-changed');
        });
    });

    describe('Password Resets', function () {
        it('should call firebase.sendPasswordResetEmail on "firebase-reset-password"', function () {
            sinon.stub(firebase, 'sendPasswordResetEmail');

            var detail = {
                email: testUser.email
            };

            fire('firebase-reset-password', detail);
            firebase.sendPasswordResetEmail.should.have.been.calledWith(detail.email);
            firebase.sendPasswordResetEmail.restore();
        });

        it('should fire "firebase-reset-password-error" on "error"', function (done) {
            listenOnce('firebase-reset-password-error', function (event) {
                event.detail.should.equal(detail);

                done();
            });

            var detail = {
                code: 'INVALID_USER',
                message: 'The specified user does not exist.'
            };
            firebase.fire('error', detail);
        });

        it('should fire "firebase-reset-password-success" and "toast-message" on "password-reset"', function (done) {
            var counter = 0;

            function end() {
                if (++counter >= 2) {
                    done();
                }
            }

            listenOnce('toast-message', end);
            listenOnce('firebase-reset-password-success', end);

            firebase.fire('password-reset');
        });
    });

    describe('Delete Account', function () {
        it('could call firebase.removeUser on "firebase-delete-account"');
    });
});
