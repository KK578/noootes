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
    }
});
