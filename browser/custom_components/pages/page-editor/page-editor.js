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
        this._setupToolbar();
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
    listeners: {
        'pages.neon-animation-finish': 'cleanupAnimation'
    },

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
        _group: {
            type: String,
            value: '',
            observer: '_groupChanged'
        },
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
    _setupToolbar: function () {
        var button = document.createElement('paper-button');
        var span = document.createElement('span');
        span.textContent = 'Preview';
        button.appendChild(span);
        button.onclick = this.togglePage.bind(this);

        this._toolbar = {
            title: 'Noootes Editor',
            subtitle: '',
            buttons: [
                button
            ]
        };
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

                this.fire('toolbar-update', this._toolbar);
            }
            else {
                var page = document.querySelector('page-reader');

                // Prefer to load the group from reader, in order to keep preview and editor linked.
                if (page.user && page.code) {
                    this._forceGroup(page.user, page.code);
                }
                else if (this.user && this.code) {
                    this._forceGroup(this.user, this.code);
                }
            }
        }
    },
    _forceGroup: function (user, code) {
        var hash = '#/editor/' + user + '/' + code;
        history.replaceState(null, null, hash);
        this._checkHash();
    },

    // Group
    _loadGroup: function (user, code) {
        this._selectedPage = 0;

        if (!user || !code) {
            this._group = '';
            this._errorMessage = 'No group selected. Please select a group from your Noootes.';
            return;
        }

        this.getUid(user, function (err, uid) {
            if (err) {
                this._errorMessage = 'Couldn\'t find a user with the name "' + user + '".';
                return;
            }

            this.searchGroup(uid, code, function (key) {
                if (key) {
                    this._group = key;
                }
                else {
                    this._errorMessage = 'Couldn\'t find a group with the code "' + code + '".';
                    this._group = '';
                }
            }.bind(this));
        }.bind(this));
    },
    _groupChanged: function (n) {
        if (n) {
            var firebase = Noootes.FirebaseRef('groups/access/test');
            firebase.child(n).set(null, function (err) {
                if (err) {
                    this._errorMessage = 'You don\'t have permission to write to these Noootes.';
                    this._group = '';
                }
                else {
                    this._errorMessage = '';
                    this._selectedPage = 1;

                    this.getGroupMetadata(this._group, function (metadata) {
                        this._toolbar.title = this.user + '/' + this.code;
                        this._toolbar.subtitle = metadata.title;

                        this.fire('toolbar-update', this._toolbar);
                    }.bind(this));
                }
            }.bind(this));
        }
    },

    // Editor/Preview
    togglePage: function () {
        var span = this._toolbar.buttons[0].querySelector('span');

        switch (this._selectedPage) {
            case 1:
                // Currently Editor
                this.$.preview.render();
                span.textContent = 'Editor';
                this._selectedPage = 2;
                return;

            case 2:
                // Currently Preview
                this._selectedPage = 1;
                span.textContent = 'Preview';
                return;

            default:
                return;
        }
    },
    // NOTE: Temporary fix for https://github.com/PolymerElements/neon-animation/issues/71
    cleanupAnimation: function () {
        var pages = this.$.pages;
        var animators = pages.querySelectorAll('.neon-animating');

        for (var i = 0; i < animators.length; i++) {
            animators[i].classList.remove('neon-animating');
        }
    }
});
