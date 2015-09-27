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
    listeners: {
        'form-edit.iron-form-submit': '_validateFormEdit'
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
            type: Object,
            value: {}
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
            value: false,
            observer: '_collapseChanged'
        },

        // Members
        _memberIcon: {
            type: String,
            value: 'arrow-drop-down'
        },
        _memberCollapseOpen: {
            type: Boolean,
            value: false,
            observer: '_memberCollapseChanged'
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

    // Access Data
    toggleCollapse: function () {
        if (!this._accessDataLoaded) {
            this._loadAccessData();
        }
        else {
            this._collapseOpen = !this._collapseOpen;
            this._editCollapseOpen = false;
        }
    },
    _collapseChanged: function (n) {
        this._buttonIcon = 'arrow-drop-' + (n ? 'up' : 'down');
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

    // Edit
    toggleEditCollapse: function () {
        this._loadEditData();
        this._editCollapseOpen = !this._editCollapseOpen;
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

        this.getGroupVisibility(this.group, function (isPublic) {
            data.public = isPublic;
            this.set('_editData.public', isPublic);
        }.bind(this));

        this.set('_editData', data);
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

    // Members
    toggleMemberCollapse: function () {
        this._memberCollapseOpen = !this._memberCollapseOpen;
    },
    _memberCollapseChanged: function (n) {
        this._memberIcon = 'arrow-drop-' + (n ? 'up' : 'down');
    }
});
