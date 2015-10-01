Noootes.Elements['page-reader'] = Polymer({
    is: 'page-reader',

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
    listeners: {
        'pages.neon-animation-finish': 'cleanupAnimation'
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
    // NOTE: Temporary fix for https://github.com/PolymerElements/neon-animation/issues/71
    cleanupAnimation: function () {
        var pages = this.$.pages;
        var animators = pages.querySelectorAll('.neon-animating');

        for (var i = 0; i < animators.length; i++) {
            animators[i].classList.remove('neon-animating');
        }
    }
});
