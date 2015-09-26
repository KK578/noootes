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
    behaviors: [Noootes.Behaviors.FirebaseBehavior],

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

    _collapseChanged: function (n) {
        this._buttonIcon = 'arrow-drop-' + (n ? 'up' : 'down');
    },
    toggleCollapse: function () {
        this._collapseOpen = !this._collapseOpen;
    }
});
