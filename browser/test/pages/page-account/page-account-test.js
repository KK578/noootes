chai.should();

describe('<page-account>', function () {
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

    describe('Change Email Form', function () {
        var form;
        var testUser;

        before(function (done) {
            form = document.querySelector('#form-email');

            var name = 'wct-tester-' + Math.round(50000 * Math.random());
            var email = name + '@test.suite';
            var password = 'wct-tester';
            testUser = {
                email: email,
                newEmail: 'new-' + email,
                password: password
            };

            // Mock currently logged in user.
            Noootes.Firebase.User = {
                password: {
                    email: testUser.email
                }
            };

            // HACK: There may be a race condition with paper-button#button-email. Allow DOM to finish initialising fully by calling this asynchronously.
            window.setTimeout(done, 0);
        });

        it('should fire "iron-form-invalid" with empty inputs', function (done) {
            var inputs = [
                { name: 'paper-input[name=email]', value: '' },
                { name: 'paper-input[name=password]', value: '' },
                { name: 'paper-input[name=newEmail]', value: '' },
                { name: 'paper-input[name=confirm]', value: '' }
            ];
            var button = 'paper-button#button-email';

            listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done);
        });

        it('should fire "iron-form-submit" with any input', function (done) {
            function assertions(event) {
                event.detail.email.should.equal('NotAnEmail');
                event.detail.password.should.equal('AnyPassword');
                event.detail.newEmail.should.equal('AnotherFakeEmail');
                event.detail.confirm.should.equal('SomeText');
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=newEmail]', value: 'AnotherFakeEmail' },
                { name: 'paper-input[name=confirm]', value: 'SomeText' }
            ];
            var button = 'paper-button#button-email';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message with an invalid current email', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('Please enter a valid email.');
                emailInput.invalid.should.equal(true);

                var newEmailInput = form.querySelector('paper-input[name=newEmail]');
                newEmailInput.errorMessage.should.equal('');
                newEmailInput.invalid.should.equal(false);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=newEmail]', value: 'ASlightly@Valid.Email' },
                { name: 'paper-input[name=confirm]', value: 'ASlightly@Valid.Email' }
            ];
            var button = 'paper-button#button-email';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message with an invalid new email', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('');
                emailInput.invalid.should.equal(false);

                var newEmailInput = form.querySelector('paper-input[name=newEmail]');
                newEmailInput.errorMessage.should.equal('Please enter a valid email.');
                newEmailInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'Hey@An.Email' },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=newEmail]', value: 'Nope' },
                { name: 'paper-input[name=confirm]', value: 'Nope' }
            ];
            var button = 'paper-button#button-email';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message if current email is not the current logged in user', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('That isn\'t your email!');
                emailInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'not-' + testUser.email },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=newEmail]', value: 'ASlightly@Valid.Email' },
                { name: 'paper-input[name=confirm]', value: 'ASlightly@Valid.Email' }
            ];
            var button = 'paper-button#button-email';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message if new emails do not match', function (done) {
            function assertions() {
                var newEmailInput = form.querySelector('paper-input[name=newEmail]');
                newEmailInput.errorMessage.should.equal('The values did not match.');
                newEmailInput.invalid.should.equal(true);

                var confirmInput = form.querySelector('paper-input[name=confirm]');
                confirmInput.errorMessage.should.equal('The values did not match.');
                confirmInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: testUser.email },
                { name: 'paper-input[name=password]', value: 'AnyPassword' },
                { name: 'paper-input[name=newEmail]', value: 'ASlightly@Valid.Email' },
                { name: 'paper-input[name=confirm]', value: 'Whoops@Valid.Email' }
            ];
            var button = 'paper-button#button-email';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('could show an error message if new email matches current email');

        it('should fire "firebase-change-email" with all valid input', function (done) {
            function assertions(event) {
                event.detail.email.should.equal(testUser.email);
                event.detail.password.should.equal(testUser.password);
                event.detail.newEmail.should.equal(testUser.newEmail);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: testUser.email },
                { name: 'paper-input[name=password]', value: testUser.password },
                { name: 'paper-input[name=newEmail]', value: testUser.newEmail },
                { name: 'paper-input[name=confirm]', value: testUser.newEmail }
            ];
            var button = 'paper-button#button-email';

            listenToEventOnClickingButton(form, 'firebase-change-email', inputs, button, done, assertions);
        });

        it('should show an error message on "firebase-change-email-error[code=EMAIL_TAKEN]"', function (done) {
            function assertions() {
                var newEmail = form.querySelector('paper-input[name=newEmail]');
                newEmail.errorMessage.should.equal('The specified user is already in use.');
                newEmail.invalid.should.equal(true);
            }

            var detail = {
                code: 'EMAIL_TAKEN',
                message: 'The specified user is already in use.'
            };
            var inputs = [];

            listenToResponseOnFiringEvent(form, 'firebase-change-email-error', detail, inputs, done, assertions);
        });

        it('should show an error message on "firebase-change-email-error[code=INVALID_USER]"', function (done) {
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

            listenToResponseOnFiringEvent(form, 'firebase-change-email-error', detail, inputs, done, assertions);
        });

        it('should show an error message on "firebase-change-email-error[code=INVALID_PASSWORD]"', function (done) {
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

            listenToResponseOnFiringEvent(form, 'firebase-change-email-error', detail, inputs, done, assertions);
        });

        it('should clear inputs on "firebase-change-email-success"', function (done) {
            function assertions() {
                form.querySelector('paper-input[name=email]').value.should.not.equal(testUser.email);
                form.querySelector('paper-input[name=password]').value.should.not.equal(testUser.password);
                form.querySelector('paper-input[name=newEmail]').value.should.not.equal(testUser.newEmail);
                form.querySelector('paper-input[name=confirm]').value.should.not.equal(testUser.newEmail);
            }

            var detail = {};
            var inputs = [
                { name: 'paper-input[name=email]', value: testUser.email },
                { name: 'paper-input[name=password]', value: testUser.password },
                { name: 'paper-input[name=newEmail]', value: testUser.newEmail },
                { name: 'paper-input[name=confirm]', value: testUser.newEmail }
            ];

            listenToResponseOnFiringEvent(form, 'firebase-change-email-success', detail, inputs, done, assertions);
        });
    });

    describe('Change Password Form', function () {
        var form;
        var testUser;

        before(function (done) {
            form = document.querySelector('#form-password');

            var name = 'wct-tester-' + Math.round(50000 * Math.random());
            var email = name + '@test.suite';
            var password = 'wct-tester';
            testUser = {
                email: email,
                password: password,
                newPassword: 'new-' + password
            };

            // Mock currently logged in user.
            Noootes.Firebase.User = {
                password: {
                    email: testUser.email
                }
            };

            // HACK: There may be a race condition with paper-button#button-password. Allow DOM to finish initialising fully by calling this asynchronously.
            window.setTimeout(done, 0);
        });

        it('should fire "iron-form-invalid" with empty inputs', function (done) {
            var inputs = [
                { name: 'paper-input[name=email]', value: '' },
                { name: 'paper-input[name=password]', value: '' },
                { name: 'paper-input[name=newPassword]', value: '' },
                { name: 'paper-input[name=confirm]', value: '' }
            ];
            var button = 'paper-button#button-password';

            listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done);
        });

        it('should fire "iron-form-submit" with any input', function (done) {
            function assertions(event) {
                event.detail.email.should.equal('NotAnEmail');
                event.detail.password.should.equal('SomePassword');
                event.detail.newPassword.should.equal('MorePassword');
                event.detail.confirm.should.equal('VeryPassword');
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'NotAnEmail' },
                { name: 'paper-input[name=password]', value: 'SomePassword' },
                { name: 'paper-input[name=newPassword]', value: 'MorePassword' },
                { name: 'paper-input[name=confirm]', value: 'VeryPassword' }
            ];
            var button = 'paper-button#button-password';

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
                { name: 'paper-input[name=password]', value: 'SomePassword' },
                { name: 'paper-input[name=newPassword]', value: 'MorePassword' },
                { name: 'paper-input[name=confirm]', value: 'MorePassword' }
            ];
            var button = 'paper-button#button-password';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message if current email is not the current logged in user', function (done) {
            function assertions() {
                var emailInput = form.querySelector('paper-input[name=email]');
                emailInput.errorMessage.should.equal('That isn\'t your email!');
                emailInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: 'not-' + testUser.email },
                { name: 'paper-input[name=password]', value: 'SomePassword' },
                { name: 'paper-input[name=newPassword]', value: 'MorePassword' },
                { name: 'paper-input[name=confirm]', value: 'MorePassword' }
            ];
            var button = 'paper-button#button-password';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show error messages if new passwords do not match', function (done) {
            function assertions() {
                var newPasswordInput = form.querySelector('paper-input[name=newPassword]');
                newPasswordInput.errorMessage.should.equal('The values did not match.');
                newPasswordInput.invalid.should.equal(true);

                var confirmInput = form.querySelector('paper-input[name=confirm]');
                confirmInput.errorMessage.should.equal('The values did not match.');
                confirmInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: testUser.email },
                { name: 'paper-input[name=password]', value: 'SomePassword' },
                { name: 'paper-input[name=newPassword]', value: 'APassword' },
                { name: 'paper-input[name=confirm]', value: 'NotTheSamePassword' }
            ];
            var button = 'paper-button#button-password';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should fire "firebase-change-password" with all valid input', function (done) {
            function assertions(event) {
                event.detail.email.should.equal(testUser.email);
                event.detail.password.should.equal(testUser.password);
                event.detail.newPassword.should.equal(testUser.newPassword);
                event.detail.should.not.have.property('confirm');
            }

            var inputs = [
                { name: 'paper-input[name=email]', value: testUser.email },
                { name: 'paper-input[name=password]', value: testUser.password },
                { name: 'paper-input[name=newPassword]', value: testUser.newPassword },
                { name: 'paper-input[name=confirm]', value: testUser.newPassword }
            ];
            var button = 'paper-button#button-password';

            listenToEventOnClickingButton(form, 'firebase-change-password', inputs, button, done, assertions);
        });

        it('should show an error message on "firebase-change-password-error[code=INVALID_USER]"', function (done) {
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

            listenToResponseOnFiringEvent(form, 'firebase-change-password-error', detail, inputs, done, assertions);
        });

        it('should show an error message on "firebase-change-password-error[code=INVALID_PASSWORD]"', function (done) {
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

            listenToResponseOnFiringEvent(form, 'firebase-change-password-error', detail, inputs, done, assertions);
        });

        it('should clear inputs on "firebase-change-password-success"', function (done) {
            function assertions() {
                form.querySelector('paper-input[name=email]').value.should.not.equal(testUser.email);
                form.querySelector('paper-input[name=password]').value.should.not.equal(testUser.password);
                form.querySelector('paper-input[name=newPassword]').value.should.not.equal(testUser.newPassword);
                form.querySelector('paper-input[name=confirm]').value.should.not.equal(testUser.newPassword);
            }

            var detail = {};
            var inputs = [
                { name: 'paper-input[name=email]', value: testUser.email },
                { name: 'paper-input[name=password]', value: testUser.password },
                { name: 'paper-input[name=newPassword]', value: testUser.newPassword },
                { name: 'paper-input[name=confirm]', value: testUser.newPassword }
            ];

            listenToResponseOnFiringEvent(form, 'firebase-change-password-success', detail, inputs, done, assertions);
        });
    });
});
