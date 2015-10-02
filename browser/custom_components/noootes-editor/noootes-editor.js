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
    behaviors: [Noootes.Behaviors.FirebaseBehavior],

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
            reflectToAttribute: true
        },
        _selectedItem: {
            type: Object,
            observer: '_chapterChanged'
        }
    },

    /* Functions specific to this element go under here. */
    _loadNoootes: function (group, chapter) {
        if (this._firepad) {
            this._unbindFirepad();
        }

        /* globals Firepad, CodeMirror */
        if (group && chapter) {
            this.getUsername(Noootes.Firebase.User.uid, function (err, name) {
                if (err) {
                    throw err;
                }

                var firebase = Noootes.FirebaseRef('notes/chapters/').child(group).child(chapter);

                var codeMirror = CodeMirror(this.$.firepad, {
                    lineNumbers: true,
                    lineWrapping: true
                });

                this._firepad = Firepad.fromCodeMirror(firebase, codeMirror, {
                    defaultText: ' ',
                    userId: name
                });
            }.bind(this));
        }
    },
    _chapterChanged: function (n) {
        if (n) {
            var number = n.chapterNumber;
            var title = n.chapter.title;

            this._chapterInfo = 'Chapter ' + number + ': ' + title;
        }
    },

    // Cleanup
    _unbindFirepad: function () {
        this._firepad.firebaseAdapter_.saveCheckpoint_();
        this._firepad.dispose();
        this._firepad = undefined;

        var firepad = this.$.firepad;
        while (firepad.firstChild) {
            firepad.removeChild(firepad.firstChild);
        }
    },

    // Text
    getText: function () {
        return this._firepad.getText();
    }
});
