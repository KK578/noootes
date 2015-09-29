Noootes.Elements['noootes-chapter-list'] = Polymer({
    is: 'noootes-chapter-list',

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
        'chapters-template.dom-change': '_setupChapterList'
    },

    /* https://www.polymer-project.org/1.0/docs/devguide/properties.html#multi-property-observers */
    observers: [
        '_loadChapters(group)'
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
        selected: {
            type: String,
            value: ''
        },
        _selectedChapter: {
            type: String,
            value: '',
            observer: '_selectedChapterChanged'
        },

        _editMode: {
            type: Boolean,
            value: false
        }
    },

    /* Functions specific to this element go under here. */
    // Load
    _loadChapters: function (group) {
        this._location = Noootes.Firebase.Location + 'notes/order/' + group;
    },

    // Order
    _setupChapterList: function () {
        var container = this.$['chapters-container'];
        var length = container.childNodes.length;

        if (length > 1) {
            this._sortChapterList();
        }
    },
    _sortChapterList: function () {
        // Chapter Number Methods
        function incrementChapter(numbers, indentation) {
            if (indentation === undefined) {
                return [];
            }

            var newNumbers = numbers.slice(0, indentation + 1);
            newNumbers[indentation] = ++newNumbers[indentation] || 1;

            return newNumbers;
        }

        function chapterNumbersToString(numbers) {
            return numbers.join('.');
        }

        var container = this.$['chapters-container'];
        var chapterNumbers = [];

        // Setup by first moving the start tag to the top.
        var node = container.querySelector('#start');
        var insert = container.firstChild;

        do {
            chapterNumbers = incrementChapter(chapterNumbers, node.indentation);
            node.chapterNumber = chapterNumbersToString(chapterNumbers);

            // On the first call this will ensure that #start is the firstChild of the container
            container.insertBefore(node, insert.nextSibling);

            // Move to the next chapter.
            insert = node;
            node = container.querySelector('#' + node.nextChapter);
        }
        while (node.nextChapter);
    },

    // Selected Chapter
    _selectedChapterChanged: function (n) {
        if (!this._editMode) {
            this.selected = n;
        }
    },

    // Edit Mode
    toggleMode: function () {
        this._editMode = !this._editMode;

        if (!this._editMode) {
            // On exiting edit mode, match private chapter to public chapter.
            this._selectedChapter = this.selected;
        }
    },
    _getIcon: function (edit) {
        return edit ? 'done' : 'create';
    }
});
