Noootes.Elements['screen-login'] = Polymer({
    is: 'screen-login',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    ready: function () {
        this._attachListeners();
    },
    //attached: function () {},

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    behaviors: [Noootes.Behaviors.FormBehavior],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'form-login.iron-form-submit': '_validateFormLogin',
        'form-register.iron-form-submit': '_validateFormRegister'
    },

    /**
     * https://www.polymer-project.org/1.0/docs/devguide/properties.html
     *
     * Notes:
     *  type {constructor}
     *  value {boolean, number, string, function}
     *  reflectToAttribute {boolean}
     *  readOnly {boolean}
     *  notify {boolean}
     *  computed {string}
     *  observer {string}
     */
    properties: {
        _stringsLogin: {
            type: Object,
            value: {
                title: 'Login',
                change: 'Forgot your password?',
                submit: 'Login'
            }
        },
        _forgottenPassword: {
            type: Boolean,
            value: false,
            observer: '_changeStringsLogin'
        }
    },

    /* Functions specific to this element go under here. */
    // Element Setup
    _attachListeners: function () {
        window.addEventListener('firebase-login-error', this._handleFailLogin.bind(this));
        window.addEventListener('firebase-login-success', this._resetFormLogin.bind(this));

        window.addEventListener('firebase-reset-password-error',
            this._handleFailResetPassword.bind(this));
        window.addEventListener('firebase-reset-password-success',
            this._resetFormResetPassword.bind(this));

        window.addEventListener('firebase-register-error', this._handleFailRegister.bind(this));
        window.addEventListener('firebase-register-success', this._resetFormRegister.bind(this));
    },

    // Form Login
    _validateFormLogin: function (event) {
        var form = this.$['form-login'];
        this.resetForm(form, false);

        var detail = event.detail;
        var inputEmail = form.querySelector('paper-input[name=email]');
        var validEmail = this.validateEmail(inputEmail);

        if (validEmail) {
            if (this._forgottenPassword) {
                this.fire('firebase-reset-password', {
                    email: detail.email
                });
            }
            else {
                this.fire('firebase-login', detail);
            }
        }
    },
    _handleFailLogin: function (event) {
        var detail = event.detail;
        var selector;

        switch (detail.code) {
            case 'INVALID_USER':
                selector = 'paper-input[name=email]';
                break;

            case 'INVALID_PASSWORD':
                selector = 'paper-input[name=password]';
                break;

            default:
                return;
        }

        this.handleFormFail(this.$['form-login'], selector, detail.message);
    },
    _resetFormLogin: function () {
        this.resetForm(this.$['form-login'], true);
    },
    // Toggles between Login and Password Reset forms
    changeForm: function () {
        this._forgottenPassword = !this._forgottenPassword;
        this.resetForm(this.$['form-login'], true);
    },
    _changeStringsLogin: function (n) {
        if (n) {
            this._stringsLogin = {
                title: 'Reset Password',
                change: 'Cancel',
                submit: 'Send Password Reset Email'
            };
        }
        else {
            this._stringsLogin = {
                title: 'Login',
                change: 'Forgot your password?',
                submit: 'Login'
            };
        }
    },
    _handleFailResetPassword: function (event) {
        var detail = event.detail;
        var selector;

        switch (detail.code) {
            case 'INVALID_USER':
                selector = 'paper-input[name=email]';
                break;

            default:
                return;
        }

        this.handleFormFail(this.$['form-login'], selector, detail.message);
    },
    _resetFormResetPassword: function () {
        this.changeForm();
    },

    // Form Register
    _validateFormRegister: function (event) {
        var form = this.$['form-register'];
        // Ensure all previous error messages are cleared first.
        this.resetForm(form, false);

        var detail = event.detail;
        var inputEmail = form.querySelector('paper-input[name=email]');
        var inputUsername = form.querySelector('paper-input[name=username]');
        var inputPassword = form.querySelector('paper-input[name=password]');
        var inputConfirm = form.querySelector('paper-input[name=confirm]');

        var validEmail = this.validateEmail(inputEmail);
        var validUsername = this.validateUsername(inputUsername);
        var validPasswords = this.validateMatch(inputPassword, inputConfirm);

        if (validEmail && validUsername && validPasswords) {
            this.validateUsernameAvailable(inputUsername, function () {
                // Stash username locally to allow firebase-register to return status.
                this._stash = {
                    email: detail.email,
                    username: detail.username
                };

                this.fire('firebase-register', {
                    email: detail.email,
                    password: detail.password
                });
            }.bind(this));
        }
    },
    _handleFailRegister: function (event) {
        var detail = event.detail;
        var selector;

        switch (detail.code) {
            case 'EMAIL_TAKEN':
                selector = 'paper-input[name=email]';
                break;

            default:
                return;
        }

        this.handleFormFail(this.$['form-register'], selector, detail.message);
        // Registration failed, stash is no longer required.
        this._stash = undefined;
    },
    _resetFormRegister: function () {
        // Only stash username after firebase-register-success.
        // This allows checks for the email not already being taken to be done.
        if (this._stash) {
            this._stashUsername();
        }

        this.resetForm(this.$['form-register'], true);
    },

    // Usernames
    _stashUsername: function () {
        var location = Noootes.Firebase.Location + 'users/stashed/' + this._stash.username;
        var firebase = new Firebase(location);

        firebase.set(this._stash.email);

        this._stash = undefined;
    }
});
