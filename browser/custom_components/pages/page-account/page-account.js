Noootes.Elements['page-account'] = Polymer({
    is: 'page-account',

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
        'form-email.iron-form-submit': '_validateFormEmail',
        'form-password.iron-form-submit': '_validateFormPassword'
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
    properties: {},

    /* Functions specific to this element go under here. */
    // Element Setup
    _attachListeners: function () {
        window.addEventListener('firebase-change-email-error', this._handleFailEmail.bind(this));
        window.addEventListener('firebase-change-email-success', this._resetFormEmail.bind(this));

        window.addEventListener('firebase-change-password-error',
            this._handleFailPassword.bind(this));
        window.addEventListener('firebase-change-password-success',
            this._resetFormPassword.bind(this));
    },

    // Email Form
    _validateFormEmail: function (event) {
        var form = this.$['form-email'];
        this.resetForm(form, false);

        var detail = event.detail;
        var inputEmail = form.querySelector('paper-input[name=email]');
        var inputNewEmail = form.querySelector('paper-input[name=newEmail');
        var inputConfirm = form.querySelector('paper-input[name=confirm]');

        var validEmail = this.validateEmail(inputEmail);
        var validNewEmail = this.validateEmail(inputNewEmail);

        if (validEmail && validNewEmail) {
            var validNewEmails = this.validateMatch(inputNewEmail, inputConfirm);
            var validUser = this.validateUser(inputEmail);

            if (validUser && validNewEmails) {
                this.fire('firebase-change-email', {
                    email: detail.email,
                    password: detail.password,
                    newEmail: detail.newEmail
                });
            }
        }
    },
    _handleFailEmail: function (event) {
        var detail = event.detail;
        var selector;

        switch (detail.code) {
            case 'INVALID_USER':
                selector = 'paper-input[name=email]';
                break;

            case 'INVALID_PASSWORD':
                selector = 'paper-input[name=password]';
                break;

            case 'EMAIL_TAKEN':
                selector = 'paper-input[name=newEmail]';
                break;

            default:
                return;
        }

        this.handleFormFail(this.$['form-email'], selector, detail.message);
    },
    _resetFormEmail: function () {
        this.resetForm(this.$['form-email'], true);
    },

    // Password Form
    _validateFormPassword: function (event) {
        var form = this.$['form-password'];
        this.resetForm(form, false);

        var detail = event.detail;
        var inputEmail = form.querySelector('paper-input[name=email]');
        var inputNewPassword = form.querySelector('paper-input[name=newPassword');
        var inputConfirm = form.querySelector('paper-input[name=confirm]');

        var validEmail = this.validateEmail(inputEmail);
        var validPasswords = this.validateMatch(inputNewPassword, inputConfirm);

        if (validEmail && validPasswords) {
            var validUser = this.validateUser(inputEmail);

            if (validUser) {
                this.fire('firebase-change-password', {
                    email: detail.email,
                    password: detail.password,
                    newPassword: detail.newPassword
                });
            }
        }
    },
    _handleFailPassword: function (event) {
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

        this.handleFormFail(this.$['form-password'], selector, detail.message);
    },
    _resetFormPassword: function () {
        this.resetForm(this.$['form-password'], true);
    }
});
