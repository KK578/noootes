Noootes.Elements['noootes-chapter'] = Polymer({
    is: 'noootes-chapter',

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
        chapter: {
            type: Object,
            value: {},
            observer: '_chapterChanged'
        },
        indentation: {
            type: Number,
            reflectToAttribute: true
        }
    },

    /* Functions specific to this element go under here. */
    _chapterChanged: function (n) {
        this.nextChapter = n.next;
        this.previousChapter = n.previous;
        this.indentation = n.indentation;
    }
});
