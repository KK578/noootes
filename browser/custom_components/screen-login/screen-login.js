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
        'form-login.iron-form-submit': '_validateFormLogin'
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
        window.addEventListener('firebase-login-error', this._handleLoginFail.bind(this));
        window.addEventListener('firebase-login-success', this._resetFormLogin.bind(this));
    },

    // All Forms
    _handleFormFail: function (form, selector, message) {
        var input = form.querySelector(selector);
        input.errorMessage = message;
        input.invalid = true;
    },

    // Form Login
    _validateFormLogin: function (event) {
        var form = this.$['form-login'];
        this.resetForm(form, false);

        var detail = event.detail;
        var inputEmail = form.querySelector('paper-input[name=email]');
        var validEmail = this.validateEmail(inputEmail);

        if (validEmail) {
            this.fire('firebase-login', detail);
        }
    },
    _handleLoginFail: function (event) {
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

        this._handleFormFail(this.$['form-login'], selector, detail.message);
    },
    _resetFormLogin: function () {
        this.resetForm(this.$['form-login'], true);
    }
});
