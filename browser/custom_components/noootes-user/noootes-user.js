Noootes.Elements['noootes-user'] = Polymer({
    is: 'noootes-user',

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

    /* https://www.polymer-project.org/1.0/docs/devguide/properties.html#multi-property-observers */
    observers: [
        '_loadUsername(user)',
        '_loadUserAccess(group, user)'
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
        group: {
            type: String,
            value: undefined
        },
        user: {
            type: String,
            value: undefined
        }
    },

    /* Functions specific to this element go under here. */
    _loadUserAccess: function (group, user) {
        var firebase = Noootes.FirebaseRef('groups/access/collaborators');
        firebase.child(group).child(user).on('value', function (ss) {
            this._status = this.readableGroupRequestStatus(user, ss.val());
        }.bind(this));
    },
    _loadUsername: function (user) {
        this.getUsername(user, function (err, name) {
            this._username = name;
        }.bind(this));
    }
});
