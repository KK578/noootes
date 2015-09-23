chai.should();

describe('<screen-login>', function () {
    function listenToEventOnClickingButton(form, eventName, inputs, button, done, assertions) {
        function listener(event) {
            if (assertions) {
                assertions(event);
            }

            window.removeEventListener(eventName, listener);
            done();
        }

        window.addEventListener(eventName, listener);

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            form.querySelector(input.name).value = input.value;
        }

        form.querySelector(button).click();
    }

    function listenToResponseOnFiringEvent(form, eventName, eventDetail, inputs, done, assertions) {
        function listener(event) {
            if (assertions) {
                assertions(event);
            }

            window.removeEventListener(eventName, listener);
            done();
        }

        window.addEventListener(eventName, listener);

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            form.querySelector(input.name).value = input.value;
        }

        window.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));
    }

    describe('Login Form', function () {
        var form;

        before(function (done) {
            form = document.querySelector('#form-login');
            // HACK: There may be a race condition with paper-button#button-login. Allow DOM to finish initialising fully by calling this asynchronously.
            window.setTimeout(done, 0);
        });

        it('should fire "iron-form-invalid" with empty inputs', function (done) {
            var inputs = [
                { name: 'paper-input[name=email]', value: '' },
                { name: 'paper-input[name=password]', value: '' }
            ];
            var button = 'paper-button#button-login';

            listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done);
        });

        it('should fire "iron-form-submit" with any input', function (done) {
            function assertions(event) {
                event.detail.email.should.equal('NotAnEmail');
                event.detail.password.should.equal('AnyPassword');
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' }
            ];
            var button = 'paper-button#button-login';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message with an invalid email', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('Please enter a valid email.');
                emailInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' }
            ];
            var button = 'paper-button#button-login';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should fire "firebase-login" with all valid input', function (done) {
            function assertions(event) {
                event.detail.email.should.equal('Email@test.com');
                event.detail.password.should.equal('AnyPassword');
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'Email@test.com' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' }
            ];
            var button = 'paper-button#button-login';

            listenToEventOnClickingButton(form, 'firebase-login', inputs, button, done, assertions);
        });

        it('should show an error message on "firebase-login-error[code=INVALID_USER]"', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('The specified user does not exist.');
                emailInput.invalid.should.equal(true);
            }

            var detail = {
                code: 'INVALID_USER',
                message: 'The specified user does not exist.'
            };
            var inputs = [];

            listenToResponseOnFiringEvent(form, 'firebase-login-error', detail, inputs, done, assertions);
        });

        it('should show an error message on "firebase-login-error[code=INVALID_PASSWORD]"', function (done) {
            function assertions() {
                var passwordInput = form.querySelector('paper-input[name=password]');
                passwordInput.errorMessage.should.equal('The specified password is incorrect.');
                passwordInput.invalid.should.equal(true);
            }

            var detail = {
                code: 'INVALID_PASSWORD',
                message: 'The specified password is incorrect.'
            };
            var inputs = [];

            listenToResponseOnFiringEvent(form, 'firebase-login-error', detail, inputs, done, assertions);
        });

        it('should clear inputs on "firebase-login-success"', function (done) {
            function assertions() {
                form.querySelector('paper-input[name=email]').value.should.not.equal('Email@test.com');
                form.querySelector('paper-input[name=password]').value.should.not.equal('AnyPassword');
            }

            var detail = {};
            var inputs = [
                { name: 'paper-input[name=email]', value: 'Email@test.com' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' }
            ];

            listenToResponseOnFiringEvent(form, 'firebase-login-success', detail, inputs, done, assertions);
        });

        it('should change form layout on clicking button', function (done) {
            var title = form.parentNode.parentNode.querySelector('h1');
            var loginButton = form.querySelector('paper-button#button-login');
            var changeButton = form.querySelector('paper-button#button-change');

            function listener() {
                var element = document.querySelector('screen-login');
                element._forgottenPassword.should.equal(true);

                loginButton.textContent.should.equal('Send Password Reset Email');
                changeButton.textContent.should.equal('Cancel');

                changeButton.removeEventListener('click', listener);
                done();
            }

            changeButton.addEventListener('click', listener);

            title.textContent.should.equal('Login');
            loginButton.textContent.should.equal('Login');
            changeButton.textContent.should.equal('Forgot your password?');
            changeButton.click();
        });

        it('should fire "firebase-reset-password" event', function (done) {
            function assertions(event) {
                event.detail.email.should.equal('Reset@test.com');
                event.detail.should.not.have.property('password');
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'Reset@test.com' }
            ];
            var button = 'paper-button#button-login';

            form.querySelector(button).textContent.should.equal('Send Password Reset Email');
            listenToEventOnClickingButton(form, 'firebase-reset-password', inputs, button, done, assertions);
        });

        it('should show an error message on "firebase-reset-password-error[Code=INVALID_USER]"', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('The specified user does not exist.');
                emailInput.invalid.should.equal(true);
            }

            var detail = {
                code: 'INVALID_USER',
                message: 'The specified user does not exist.'
            };
            var inputs = [];

            listenToResponseOnFiringEvent(form, 'firebase-reset-password-error', detail, inputs, done, assertions);
        });

        it('should clear inputs on "firebase-reset-password-success"', function (done) {
            function assertions() {
                form.querySelector('paper-input[name=email]').value.should.not.equal('Reset@test.com');
            }

            var detail = {};
            var inputs = [
                { name: 'paper-input[name=email]', value: 'Reset@test.com' }
            ];

            listenToResponseOnFiringEvent(form, 'firebase-reset-password-success', detail, inputs, done, assertions);
        });
    });

    describe('Register Form', function () {
        var form;

        before(function () {
            form = document.querySelector('#form-register');
        });

        it('should fire "iron-form-invalid" with empty inputs', function (done) {
            var inputs = [
                { name: 'paper-input[name=email]', value: '' },
                { name: 'paper-input[name=username]', value: '' },
                { name: 'paper-input[name=password]', value: '' },
                { name: 'paper-input[name=confirm]', value: '' }
            ];
            var button = 'paper-button#button-register';

            listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done);
        });

        it('should fire "iron-form-submit" with any input', function (done) {
            function assertions(event) {
                event.detail.email.should.equal('NotAnEmail');
                event.detail.username.should.equal('A Username');
                event.detail.password.should.equal('AnyPassword');
                event.detail.confirm.should.equal('AnotherPassword');
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=username]', value: 'A Username' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=confirm]', value: 'AnotherPassword' }
            ];
            var button = 'paper-button#button-register';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message with an invalid email', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('Please enter a valid email.');
                emailInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=username]', value: 'AUsername' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=confirm]', value: 'AnyPassword' }
            ];
            var button = 'paper-button#button-register';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message with an invalid username', function (done) {
            function assertions() {
                var usernameInput = form.querySelector('paper-input[name=username]');
                usernameInput.errorMessage.should.equal('Alphanumeric characters only.');
                usernameInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=username]', value: '#A Username' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=confirm]', value: 'AnyPassword' }
            ];
            var button = 'paper-button#button-register';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show error messages with unmatching passwords', function (done) {
            function assertions() {
                var passwordInput = form.querySelector('paper-input[name=password]');
                passwordInput.errorMessage.should.equal('The values did not match.');
                passwordInput.invalid.should.equal(true);

                passwordInput = form.querySelector('paper-input[name=confirm]');
                passwordInput.errorMessage.should.equal('The values did not match.');
                passwordInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'Email@test.com' },
                { name: 'paper-input[name=username]', value: 'AUsername' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=confirm]', value: 'AnotherPassword' }
            ];
            var button = 'paper-button#button-register';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show all error messages with all bad input', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('Please enter a valid email.');
                emailInput.invalid.should.equal(true);

                var usernameInput = form.querySelector('paper-input[name=username');
                usernameInput.errorMessage.should.equal('Alphanumeric characters only.');
                usernameInput.invalid.should.equal(true);

                var passwordInput = form.querySelector('paper-input[name=password]');
                passwordInput.errorMessage.should.equal('The values did not match.');
                passwordInput.invalid.should.equal(true);

                passwordInput = form.querySelector('paper-input[name=confirm]');
                passwordInput.errorMessage.should.equal('The values did not match.');
                passwordInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=username]', value: '#A Username' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=confirm]', value: 'AnotherPassword' }
            ];
            var button = 'paper-button#button-register';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message with valid inputs but a username in use', function (done) {
            function assertions() {
                var usernameInput = form.querySelector('paper-input[name=username]');
                usernameInput.errorMessage.should.equal('That username is already taken.');
                usernameInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'Email@test.com' },
                { name: 'paper-input[name=username]', value: 'Kek' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=confirm]', value: 'AnyPassword' }
            ];
            var button = 'paper-button#button-register';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should fire "firebase-register" with all valid input', function (done) {
            function assertions(event) {
                event.detail.email.should.equal('Email@test.com');
                event.detail.password.should.equal('AnyPassword');
            }

            var randomUsername = 'NoTrollPls' + Math.floor((Math.random() * 50000));

            var inputs = [
                { name: 'paper-input[name=email]', value: 'Email@test.com' },
                { name: 'paper-input[name=username]', value: randomUsername },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=confirm]', value: 'AnyPassword' }
            ];
            var button = 'paper-button#button-register';

            listenToEventOnClickingButton(form, 'firebase-register', inputs, button, done, assertions);
        });

        it('should show an error message on "firebase-register-error[code=EMAIL_TAKEN]"', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('The specified user is already in use.');
                emailInput.invalid.should.equal(true);
            }

            var detail = {
                code: 'EMAIL_TAKEN',
                message: 'The specified user is already in use.'
            };
            var inputs = [];

            listenToResponseOnFiringEvent(form, 'firebase-register-error', detail, inputs, done, assertions);
        });

        it('should clear inputs on "firebase-register-success"', function (done) {
            function assertions() {
                form.querySelector('paper-input[name=email]').value.should.not.equal('Email@test.com');
                form.querySelector('paper-input[name=username]').value.should.not.equal('AUsername');
                form.querySelector('paper-input[name=password]').value.should.not.equal('AnyPassword');
                form.querySelector('paper-input[name=confirm]').value.should.not.equal('AnyPassword');
            }

            var detail = {};
            var inputs = [
                { name: 'paper-input[name=email]', value: 'Email@test.com' },
                { name: 'paper-input[name=username]', value: 'AUsername' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=confirm]', value: 'AnyPassword' }
            ];

            listenToResponseOnFiringEvent(form, 'firebase-register-success', detail, inputs, done, assertions);
        });
    });
});
