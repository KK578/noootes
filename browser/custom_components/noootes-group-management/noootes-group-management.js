Noootes.Elements['noootes-group-management'] = Polymer({
    is: 'noootes-group-management',

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
        Noootes.Behaviors.FormBehavior,
        Noootes.Behaviors.GroupBehavior
    ],

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
        _owned: {
            type: Boolean,
            computed: '_isOwner(_data)'
        },
        _username: {
            type: String,
            value: undefined
        },

        // Access
        _accessData: {
            type: Object,
            value: {}
        },
        _accessDataLoaded: {
            type: Boolean,
            value: false,
            observer: '_accessDataLoadedChanged'
        },
        _collapseOpen: {
            type: Boolean,
            value: false
        },

        // Members
        _memberCollapseOpen: {
            type: Boolean,
            value: false
        },
        _memberLocationSet: {
            type: Boolean,
            value: false
        }
    },

    /* Functions specific to this element go under here. */
    // Property Observers
    _groupChanged: function (n) {
        if (n) {
            this._accessDataLoaded = false;
            this._collapseOpen = false;
            this._location = Noootes.Firebase.Location + 'groups/metadata/' + n;
        }
    },
    _dataChanged: function (n) {
        if (n) {
            this.getUsername(n.owner, function (err, name) {
                this._username = name;
            }.bind(this));
        }
    },
    _isOwner: function (data) {
        return data.owner === Noootes.Firebase.User.uid;
    },

    // All Collapses
    _getArrowIcon: function (open) {
        return 'arrow-drop-' + (open ? 'up' : 'down');
    },

    // Access Collapse
    toggleCollapse: function () {
        if (!this._accessDataLoaded) {
            this._loadAccessData();
        }
        else {
            this._collapseOpen = !this._collapseOpen;
        }

        this._editCollapseOpen = false;
        this._memberCollapseOpen = false;
    },
    _loadAccessData: function () {
        this.checkGroupGlobalStatus(this.group, function (global) {
            var status = this.readableGroupGlobalStatus(global);
            this.set('_accessData.global', status);

            if (this._accessData.user) {
                this._accessDataLoaded = true;
            }
        }.bind(this));

        this.checkGroupRequestStatus(this.group, function (collaborator, request) {
            var status = this.readableGroupRequestStatus(this._data.owner, collaborator, request);
            this.set('_accessData.user', status);

            if (this._accessData.global) {
                this._accessDataLoaded = true;
            }
        }.bind(this));
    },
    _accessDataLoadedChanged: function (n) {
        if (n) {
            this._collapseOpen = true;
        }
    },
    navigateToNoootes: function (event) {
        var target = event.target;
        while (!target.getAttribute('target')) {
            target = target.parentNode;
        }

        var page = target.getAttribute('target');
        var hash = [
            '/',
            page,
            '/',
            this._username,
            '/',
            this._data.code
        ].join('');

        window.location.hash = hash;
    },

    // Edit Collapse
    toggleEditCollapse: function () {
        this._loadEditData();
    },
    _loadEditData: function () {
        var data = this._data;

        switch (this._accessData.global) {
            case 'Read':
                data.global = 'read';
                break;

            case 'Read/Write':
                data.global = 'write';
                break;

            default:
                data.global = 'none';
                break;
        }

        this.set('_editData', data);

        this.getGroupVisibility(this.group, function (isPublic) {
            data.public = isPublic;
            this.set('_editData.public', isPublic);
            this._editCollapseOpen = !this._editCollapseOpen;
        }.bind(this));
    },
    _validateFormEdit: function (event) {
        var detail = event.detail;

        var meta = {
            code: this._data.code,
            title: detail.title,
            description: detail.description,
            owner: this._data.owner
        };
        var access = {
            global: detail.global,
            public: detail.public
        };

        this.editGroup(this.group, meta, access);
        this._editCollapseOpen = false;
    },

    // Members Collapse
    toggleMemberCollapse: function () {
        if (!this._memberLocation) {
            this._memberLocation = Noootes.Firebase.Location +
                'groups/access/collaborators/' + this.group;
        }

        this._memberCollapseOpen = !this._memberCollapseOpen;
    },
    toggleRequestCollapse: function () {
        if (!this._requestLocation) {
            this._requestLocation = Noootes.Firebase.Location +
                'groups/access/requests/' + this.group;
        }

        this._requestCollapseOpen = !this._requestCollapseOpen;
    }
});
