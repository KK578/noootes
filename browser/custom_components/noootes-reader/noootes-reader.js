Noootes.Elements['noootes-reader'] = Polymer({
    is: 'noootes-reader',

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
        group: {
            type: String,
            value: '',
            observer: 'render'
        },
        markdown: {
            type: String,
            value: ''
        }
    },

    /* Functions specific to this element go under here. */
    render: function () {
        if (this.group) {
            this.markdown = '# Compiling Noootes...';
            this._bindOrder();
        }
    },
    _bindOrder: function () {
        var firebase = Noootes.FirebaseRef('notes/order/');

        firebase.child(this.group).once('value', function (ss) {
            var data = ss.val();

            var chapters = [];
            var chapter = data.start;

            while (chapter.next !== 'end') {
                var key = chapter.next;
                chapter = data[key];
                chapters.push({
                    key: key,
                    indentation: chapter.indentation,
                    title: chapter.title
                });
            }

            this._bindData(chapters);
        }.bind(this));
    },
    _bindData: function (chapters) {
        var notes = [];
        var counter = 0;

        function getNotes(ref, index) {
            var firebase = new Firebase(ref);

            firebase.once('value', function (ss) {
                var data = ss.val();
                notes[index] = data;

                if (++counter >= chapters.length) {
                    this._renderMarkdown(chapters, notes);
                }
            }.bind(this));
        }

        var location = Noootes.Firebase.Location + 'notes/chapters/' + this.group + '/';

        for (var i = 0; i < chapters.length; i++) {
            var chapterRef = location + chapters[i].key + '/checkpoint/o/0';
            getNotes.call(this, chapterRef, i);
        }
    },
    _renderMarkdown: function (chapters, notes) {
        var rendered = [];

        for (var i = 0; i < chapters.length; i++) {
            var chapter = chapters[i];

            var markdown = [
                '#'.repeat(chapter.indentation + 1) + ' ' + chapter.title,
                notes[i]
            ];

            rendered.push(markdown.join('\n'));
        }

        this.markdown = rendered.join('\n');
    }
});
