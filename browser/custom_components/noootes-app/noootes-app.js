Noootes.Elements['noootes-app'] = Polymer({
    is: 'noootes-app',

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
    behaviors: [Noootes.Behaviors.FirebaseBehavior],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'firebase-auth.error': '_firebaseError',
        'firebase-auth.login': '_firebaseLogin',
        'firebase-auth.logout': '_firebaseLogout',
        'firebase-auth.user-created': '_firebaseRegister',
        'firebase-auth.email-changed': '_firebaseChangeEmail',
        'firebase-auth.password-changed': '_firebaseChangePassword',
        'firebase-auth.password-reset': '_firebaseResetPassword'
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
        _selectedPage: {
            type: Number,
            value: 0,
            observer: 'validateAuthenticated'
        },
        _location: {
            type: String,
            value: Noootes.Firebase.Location
        },
        _firebaseEventOngoing: {
            type: Boolean,
            value: false
        }
    },

    /* Functions specific to this element go under here. */
    // Element Setup
    _attachListeners: function () {
        // Listen to firebase events fired by other elements.
        window.addEventListener('firebase-login', this.login.bind(this));
        window.addEventListener('firebase-logout', this.logout.bind(this));
        window.addEventListener('firebase-register', this.register.bind(this));
        window.addEventListener('firebase-change-email', this.changeEmail.bind(this));
        window.addEventListener('firebase-change-password', this.changePassword.bind(this));
        window.addEventListener('firebase-reset-password', this.resetPassword.bind(this));
    },

    // Ensures that only one firebase-auth method is being called at a time.
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
    },

    // Firebase-Auth Events.
    // Error handler
    _firebaseError: function (event) {
        var detail = event.detail;
        var allowedErrors = [
            'INVALID_USER',
            'INVALID_PASSWORD',
            'EMAIL_TAKEN'
        ];

        // For errors that are handled, fire the corresponding error event name.
        // For all other errors, they are handled by toasting to the user.
        // TODO: Improve error handling?
        if (allowedErrors.indexOf(detail.code) !== -1) {
            this.fire(this.lastFirebaseEvent + '-error', detail);
        }
        else {
            var message = detail.code + '\n' + detail.message;
            this.fire('toast-message', {
                message: message
            });
        }

        // Allow any new events to happen.
        this._firebaseEventOngoing = false;
    },

    // Successful event handlers
    _fireSuccessEvent: function (eventName, event) {
        this._firebaseEventOngoing = false;

        var detail = event ? event.detail : undefined;
        this.fire(eventName + '-success', detail);
    },
    _firebaseLogin: function (event) {
        // Login was successful, change to main-screen and fire event for listening elements.
        this._selectedPage = 1;
        Noootes.Firebase.User = event.detail.user;
        this._fireSuccessEvent('firebase-login', event);
    },
    _firebaseLogout: function () {
        // Logout was successful, change to login-screen and fire event for listening elements.
        this._selectedPage = 0;
        Noootes.Firebase.User = undefined;
        this._fireSuccessEvent('firebase-logout');
    },
    _firebaseRegister: function () {
        // Registration was successful, fire event for listening elements
        //  and display message to user.
        // TODO: Copy email/password from register form to login form?
        this.fire('toast-message', {
            message: 'Successfully registered your account!\nPlease log in.'
        });
        this._fireSuccessEvent('firebase-register');
    },
    _firebaseChangeEmail: function () {
        // TODO: Force user to relogin? Automatically relog user?
        this.fire('toast-message', { message: 'Successfully changed email!' });
        this._fireSuccessEvent('firebase-change-email');
    },
    _firebaseChangePassword: function () {
        // TODO: Force user to relogin? Automatically relog user?
        this.fire('toast-message', { message: 'Successfully changed password!' });
        this._fireSuccessEvent('firebase-change-password');
    },
    _firebaseResetPassword: function () {
        this.fire('toast-message', {
            message: 'Successfully sent password reset.\nPlease check your email.'
        });
        this._fireSuccessEvent('firebase-reset-password');
    },

    // On Login
    validateAuthenticated: function (n) {
        if (n === 1) {
            var user = this.$['firebase-auth'].user;

            if (!user) {
                this._selectedPage = 0;
                this.fire('toast-message', { message: 'You\'re not logged in!' });
            }
        }
    }
});
