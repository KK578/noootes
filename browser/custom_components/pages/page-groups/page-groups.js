Noootes.Elements['page-groups'] = Polymer({
    is: 'page-groups',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    //ready: function () {},
    //attached: function () {},

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    behaviors: [
        Noootes.Behaviors.FirebaseBehavior,
        Noootes.Behaviors.FormBehavior
    ],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'form-search.iron-form-submit': '_validateFormSearch'
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
        _location: {
            type: String,
            value: undefined
        },
        _locationSet: {
            type: Boolean,
            value: false
        }
    },

    /* Functions specific to this element go under here. */
    setLocation: function () {
        this._location = Noootes.Firebase.Location + 'groups/public';
        this._locationSet = true;
    },

    // Form Search
    _validateFormSearch: function (event) {
        var form = this.$['form-search'];
        this.resetForm(form, false);

        var detail = event.detail;
        var inputUser = form.querySelector('paper-input[name=user]');
        var inputCode = form.querySelector('paper-input[name=code]');

        var validUser = this.validateUsername(inputUser);
        var validCode = this.validateCode(inputCode);

        if (validUser && validCode) {
            this._searchGroup(detail.user, detail.code);
        }
    },
    _handleFailSearch: function (err) {
        var selector;
        var message;

        switch (err) {
            case 'INVALID_NAME':
                selector = 'paper-input[name=user]';
                message = 'The specified username was not found.';
                break;

            case 'INVALID_CODE':
                selector = 'paper-input[name=code]';
                message = 'The specified code was not found.';
                break;

            default:
                return;
        }

        this.handleFormFail(this.$['form-search'], selector, message);
    },
    _searchGroup: function (user, code) {
        this.getUid(user, function (err, uid) {
            if (err) {
                this._handleFailSearch('INVALID_NAME');
                return;
            }

            var location = Noootes.Firebase.Location + 'groups/access/id/';
            var firebase = new Firebase(location);

            firebase.child(uid).child(code).once('value', function (ss) {
                var data = ss.val();

                if (data) {
                    this._groupSearchResult = data;
                }
                else {
                    this._handleFailSearch('INVALID_CODE');
                }
            }.bind(this));
        }.bind(this));
    }
});
