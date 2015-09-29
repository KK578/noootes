Noootes.Elements['page-editor'] = Polymer({
    is: 'page-editor',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    ready: function () {
        this._attachListeners();
    },
    attached: function () {
        this._checkHash();
    },

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    behaviors: [
        Noootes.Behaviors.FirebaseBehavior,
        Noootes.Behaviors.GroupBehavior
    ],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    //listeners: {},

    /* https://www.polymer-project.org/1.0/docs/devguide/properties.html#multi-property-observers */
    observers: [
        '_loadGroup(user, code)'
    ],

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
            value: 0
        },
        _errorMessage: {
            type: String,
            value: 'No group selected. Please select a group from your Noootes.'
        }
    },

    /* Functions specific to this element go under here. */
    _attachListeners: function () {
        window.addEventListener('hashchange', this._checkHash.bind(this));
    },
    // Hash Change
    _checkHash: function () {
        var hash = window.location.hash.split('/');

        // Only care if first hash [0 = '#'], is the editor page.
        if (hash[1] === 'editor') {
            // Ensure that following editor exists a username and a code.
            if (hash.length >= 4) {
                this.user = hash[2];
                this.code = hash[3];
            }
        }
    },
    _loadGroup: function (user, code) {
        this.getUid(user, function (err, uid) {
            if (err) {
                this._errorMessage = 'Couldn\'t find a user with the name "' + user + '".';
                return;
            }

            this.searchGroup(uid, code, function (key) {
                if (key) {
                    this._errorMessage = '';
                    this._group = key;
                }
                else {
                    this._errorMessage = 'Couldn\'t find a group with the code "' + code + '".';
                    this._group = '';
                }
            }.bind(this));
        }.bind(this));
    }
});
