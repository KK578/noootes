Noootes.Elements['screen-login'] = Polymer({
    is: 'screen-login',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    //ready: function () {},
    //attached: function () {},

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    behaviors: [Noootes.Behaviors.FormBehavior],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'form-register.iron-form-submit': 'validateFormRegister'
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
    // Form Register
    validateFormRegister: function (event) {
        var form = this.$['form-register'];
        // Ensure all previous error messages are cleared first.
        this.resetForm(form, false);

        var detail = event.detail;
        var inputEmail = form.querySelector('paper-input[name=email]');
        var inputPassword = form.querySelector('paper-input[name=password]');
        var inputConfirm = form.querySelector('paper-input[name=confirm]');

        var validEmail = this.validateEmail(inputEmail);
        var validPasswords = this.validateMatch(inputPassword, inputConfirm);

        if (validEmail && validPasswords) {
            this.fire('firebase-register', {
                email: detail.email,
                password: detail.password
            });
        }
    }
});
