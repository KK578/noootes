Noootes.Elements['routed-pages'] = Polymer({
    is: 'routed-pages',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    ready: function () {
        this._setupPages();
    },
    //attached: function () {},

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
    properties: {
        _selectedPage: {
            type: String
        }
    },

    /* Functions specific to this element go under here. */
    // Element Setup
    _setupPages: function () {
        var pages = this.$.pages;

        // For each page in the pages array, create its corresponding element and attach to #pages.
        // Set route to allow #pages to navigate correctly
        // It will be imported later dynamically.
        for (var i = 0; i < this.pages.length; i++) {
            var page = this.pages[i];
            var element = document.createElement(page.element);
            element.setAttribute('route', page.tag);

            Polymer.dom(pages).appendChild(element);
        }
    }
});
