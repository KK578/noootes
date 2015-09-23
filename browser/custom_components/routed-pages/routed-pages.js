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
        this._attachListeners();
    },
    //attached: function () {},

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    behaviors: [Noootes.Behaviors.PageBehavior],

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
    },
    _attachListeners: function () {
        window.addEventListener('page-changed', this._handlePageChange.bind(this));
    },

    // Page Changes
    _handlePageChange: function (event) {
        var page = event.detail;
        var element = page.element;

        function success() {
            this._selectedPage = page.tag;
        }

        function error() {
            history.replaceState(null, null, '#' + this._selectedPage);

            this.fire('hashchange');
            this.fire('toast-message', {
                message: 'Failed to load "' + page.title + '" page.\n' +
                    'Please check your internet connection and refresh.'
            });
        }

        // Check global array of imported elements, import if element is not present.
        if (!Noootes.Elements[element]) {
            var href = 'custom_components/pages/' + element + '/' + element + '.html';
            this.importHref(href, success.bind(this), error.bind(this));
        }
        else {
            // Otherwise, element is already imported, can change page immediately.
            success.call(this);
        }
    },

    // Animations
    // NOTE: Temporary fix for https://github.com/PolymerElements/neon-animation/issues/71
    cleanupAnimation: function () {
        var pages = this.$.pages;
        var animators = pages.querySelectorAll('.neon-animating');

        for (var i = 0; i < animators.length; i++) {
            animators[i].classList.remove('neon-animating');
        }
    }
});
