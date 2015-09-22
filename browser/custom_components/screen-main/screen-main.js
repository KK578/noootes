Noootes.Elements['screen-main'] = Polymer({
    is: 'screen-main',

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
        var hash = window.location.hash.split('#')[1];
        window.location.hash = hash ? hash : '/home/';
        this._checkHash();
    },

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    behaviors: [Noootes.Behaviors.PageBehavior],

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
    properties: {},

    /* Functions specific to this element go under here. */
    // Element Setup
    _attachListeners: function () {
        window.addEventListener('hashchange', this._checkHash.bind(this));
    },

    // Hash Location
    _checkHash: function () {
        var hash = window.location.hash.split('/');

        // Enforce slash immediately after hash symbol and slash after the first element.
        if (hash[0] !== '#' || hash.length < 3) {
            this._forceHome();
        }

        var route = '/' + hash[1] + '/';
        for (var i = 0; i < this.pages.length; i++) {
            if (route === this.pages[i].tag) {
                this._handlePageChange(this.pages[i]);
                return;
            }
        }

        // If function has not returned by this point, the hash location is invalid.
        // Force change back to home if this has occurred.
        this._forceHome();
    },
    _handlePageChange: function (page) {
        if (this._selectedPage !== page.tag) {
            this.fire('page-changed', page);
        }

        this._selectedPage = page.tag;
    },
    _forceHome: function () {
        history.replaceState(null, null, '#/home/');
        this._checkHash();
    },
    // Tap listener for navigation-items
    changePage: function (e) {
        var event = Polymer.dom(e).event;
        var hash = event.model.item.tag;

        window.location.hash = hash;
        this.$['drawer-container'].closeDrawer();
    }
});
