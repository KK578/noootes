Noootes.Elements['noootes-app'] = Polymer({
    is: 'noootes-app',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    //ready: function () {},
    //attached: function () {},

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    //behaviors: [],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    //listeners: {},

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
        _location: {
            type: String,
            value: Noootes.Firebase
        }
    },

    /* Functions specific to this element go under here. */
    _startFirebaseEvent: function (event, eventName, callback) {
        if (!this._firebaseEventOngoing) {
            this._firebaseEventOngoing = true;
            this.lastFirebaseEvent = eventName;

            var detail = event ? event.detail : undefined;
            callback(this.$['firebase-auth'], detail);
        }
    },
    // Wrapper functions for firebase-auth methods.
    login: function (event) {
        this._startFirebaseEvent(event, 'firebase-login', function (auth, detail) {
            auth.login(detail);
        });
    },
    logout: function () {
        this._startFirebaseEvent(undefined, 'firebase-logout', function (auth) {
            auth.logout();
        });
    },
    register: function (event) {
        this._startFirebaseEvent(event, 'firebase-register', function (auth, detail) {
            auth.createUser(detail.email, detail.password);
        });
    },
    changeEmail: function (event) {
        this._startFirebaseEvent(event, 'firebase-change-email', function (auth, detail) {
            auth.changeEmail(detail.email, detail.newEmail, detail.password);
        });
    },
    changePassword: function (event) {
        this._startFirebaseEvent(event, 'firebase-change-password', function (auth, detail) {
            auth.changePassword(detail.email, detail.password, detail.newPassword);
        });
    },
    resetPassword: function (event) {
        this._startFirebaseEvent(event, 'firebase-reset-password', function (auth, detail) {
            auth.sendPasswordResetEmail(detail.email);
        });
    }
});
