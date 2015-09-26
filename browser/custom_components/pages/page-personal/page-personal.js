Noootes.Elements['page-personal'] = Polymer({
    is: 'page-personal',

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
        'form-create.iron-form-submit': '_validateFormCreate'
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
        _ownedLocation: {
            type: String,
            value: undefined
        },
        _ownedLocationSet: {
            type: Boolean,
            value: false
        }
    },

    /* Functions specific to this element go under here. */
    setOwnedLocation: function () {
        var user = Noootes.Firebase.User;
        this._ownedLocation = Noootes.Firebase.Location + 'users/personal/' + user.uid + '/owned';
        this._ownedLocationSet = true;
    },

    // Form Create
    _validateFormCreate: function (event) {
        var form = this.$['form-create'];
        this.resetForm(form, false);

        var detail = event.detail;
        var inputCode = form.querySelector('paper-input[name=code]');

        var validCode = this.validateCode(inputCode);

        if (validCode) {
            this._searchGroup(detail.code, function (freeCode) {
                if (freeCode) {
                    this._createGroup(detail);
                }
                else {
                    this.handleFormFail(form, 'paper-input[name=code]',
                        'Code "' + detail.code + '" already exists.');
                }
            }.bind(this));
        }
    },
    _searchGroup: function (code, callback) {
        var uid = Noootes.Firebase.User.uid;
        var firebase = Noootes.FirebaseRef('groups/access/id/');

        firebase.child(uid).child(code).once('value', function (ss) {
            callback(!ss.val());
        });
    },
    _createGroup: function (detail) {
        var firebase = Noootes.FirebaseRef();
        var user = Noootes.Firebase.User;
        var key = firebase.push().key();

        firebase.child('users/personal/' + user.uid + '/owned/' + key).set(true);
        firebase.child('groups/access/id/' + user.uid).child(detail.code).set(key);
        firebase.child('groups/metadata/' + key).set({
            code: detail.code,
            title: detail.title,
            owner: user.uid,
            description: detail.description
        });
    }
});
