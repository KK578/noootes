Noootes.Elements['noootes-editor'] = Polymer({
    is: 'noootes-editor',

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

    /* https://www.polymer-project.org/1.0/docs/devguide/properties.html#multi-property-observers */
    observers: [
        '_loadNoootes(group, chapter)'
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
            reflectToAttribute: true
        },
        chapter: {
            type: String,
            value: 'Test',
            reflectToAttribute: true
        }
    },

    /* Functions specific to this element go under here. */
    _loadNoootes: function (group, chapter) {
        /* globals Firepad, CodeMirror */
        if (group && chapter) {
            var firebase = Noootes.FirebaseRef('notes/chapters/').child(group).child(chapter);

            var codeMirror = CodeMirror(this.$.firepad, {
                lineNumbers: true,
                lineWrapping: true
            });

            this._firepad = Firepad.fromCodeMirror(firebase, codeMirror);
        }
    }
});
