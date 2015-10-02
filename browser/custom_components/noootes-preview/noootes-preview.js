Noootes.Elements['noootes-preview'] = Polymer({
    is: 'noootes-preview',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    //ready: function () {},
    attached: function () {
        if (!window.MathJax) {
            /* globals MathJax */
            var script = document.createElement('script');
            script.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js' +
                '?config=AM_HTMLorMML-full';
            script.onload = function () {
                MathJax.Hub.Config({
                    asciimath2jax: {
                        delimiters: [
                            ['$$', '$$']
                        ]
                    }
                });
            };

            document.head.appendChild(script);
        }
    },

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    //behaviors: [],

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
        markdown: {
            type: String,
            value: ''
        }
    },

    /* Functions specific to this element go under here. */
    render: function () {
        var editor = this.parentNode.querySelector('noootes-editor');

        // Add selected chapter as title.
        var selected = editor.querySelector('#chapters-container').selectedItem;
        var title = '#'.repeat(selected.indentation + 1) + ' ' + selected.chapter.title;

        this.markdown = title + '\n\n' + editor.getText();
        this.async(function () {
            MathJax.Hub.Queue([
                'Typeset',
                MathJax.Hub,
                this.$.markdown
            ]);
        });
    }
});
