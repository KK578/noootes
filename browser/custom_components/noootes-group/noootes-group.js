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
    behaviors: [
        Noootes.Behaviors.FirebaseBehavior,
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
        }
    },
    _collapseChanged: function (n) {
        this._buttonIcon = 'arrow-drop-' + (n ? 'up' : 'down');
    },
    _loadAccessData: function () {
        this.getGroupAccessibility(this.group, function (access) {
            var status = this.readableGroupAccessibility(access);
            this.set('_accessData.access', status);

            if (this._accessData.user) {
                this._accessDataLoaded = true;
            }
        }.bind(this));

        this.checkGroupRequestStatus(this.group, function (collaborator, request) {
            var status = this.readableGroupRequestStatus(this._data.owner, collaborator, request);
            this.set('_accessData.user', status);
            this._setApplyButtonVisibility(status);

            if (this._accessData.access) {
                this._accessDataLoaded = true;
            }
        }.bind(this));
    },
    _accessDataLoadedChanged: function (n) {
        if (n) {
            this._collapseOpen = true;
        }
    },

    // Join Groups
    _setApplyButtonVisibility: function (status) {
        this._hideApplyButton = status !== 'None';
    },
    requestAccess: function () {
        // TODO: Add security checks.
        this.applyToGroup(this.group, true);
    }
});
