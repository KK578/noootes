Noootes.Elements['noootes-group'] = Polymer({
    is: 'noootes-group',

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
        group: {
            type: String,
            value: undefined,
            observer: '_groupChanged'
        },
        _data: {
            type: Object,
            value: undefined,
            observer: '_dataChanged'
        },
        _username: {
            type: String,
            value: undefined
        },

        // Access
        _accessData: {
            type: Object
        },
        _accessDataLoaded: {
            type: Boolean,
            value: false,
            observer: '_accessDataLoadedChanged'
        },
        _buttonIcon: {
            type: String,
            value: 'arrow-drop-down'
        },
        _collapseOpen: {
            type: Boolean,
            value: false
        }
    },

    /* Functions specific to this element go under here. */
    // Property Observers
    _groupChanged: function (n) {
        if (n) {
            this._location = Noootes.Firebase.Location + 'groups/metadata/' + n;
        }
    },
    _dataChanged: function (n) {
        if (n) {
            this._getUsername(n.owner);
        }
    },

    // TODO: Move to firebase behavior method.
    _getUsername: function (uid) {
        if (uid) {
            var location = Noootes.Firebase.Location + 'users/usernames/uid/' + uid;
            var firebase = new Firebase(location);

            firebase.once('value', function (ss) {
                this._username = ss.val();
            }.bind(this));
        }
    },

    // Access Data
    toggleCollapse: function () {
        if (!this._accessDataLoaded) {
            this._loadAccessData();
        }
        else {
            this._collapseOpen = !this._collapseOpen;
        }
    },
    _loadAccessData: function () {
        var data = {};
        var self = this;

        function done() {
            if (data.global && data.user) {
                self._setAccessStrings(data);
            }
        }

        var user = Noootes.Firebase.User;
        var location = Noootes.Firebase.Location + 'groups/access';
        var firebase = new Firebase(location);

        firebase.child('global/' + this.group).on('value', function (ss) {
            data.global = ss.val() || 'N/A';
            done();
        });

        firebase.child('collaborators/' + this.group).child(user.uid).on('value', function (ss) {
            data.user = ss.val() || 'N/A';
            done();
        });
    },
    _setAccessStrings: function (data) {
        function global(access) {
            var result;

            switch (access) {
                case 'read':
                    result = 'Read';
                    break;

                case 'write':
                    result = 'Read/Write';
                    break;

                case 'N/A':
                    /* falls through */
                default:
                    result = 'None';
                    break;
            }

            return result;
        }

        function user(uid, collab, request) {
            var result;

            if (Noootes.Firebase.User.uid === uid) {
                result = 'Owner';
            }
            else {
                switch (collab) {
                    case 'read':
                        result = 'Read';
                        break;

                    case 'write':
                        result = 'Read/Write';
                        break;

                    case 'N/A':
                        /* falls through */
                    default:
                        result = request ? 'Under Request' : 'None';
                        break;
                }
            }

            return result;
        }

        this._accessData = {
            global: global(data.global),
            user: user(this._data.owner, data.user)
        };
        this._accessDataLoaded = true;
    },
    _accessDataLoadedChanged: function (n) {
        if (n) {
            this._collapseOpen = true;
        }
    }
});
