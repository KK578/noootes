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
    behaviors: [Noootes.Behaviors.ChapterBehavior],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'chapters-template.dom-change': '_setupChapterList'
    },

    /* https://www.polymer-project.org/1.0/docs/devguide/properties.html#multi-property-observers */
    observers: [
        '_loadChapters(group)',
        '_setPreviewChapterNumber(_selectedChapter, _addType)'
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
        this._setContainerTop();
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
        var container = this.$['chapters-container'];
        var chapterNumbers = [];

        // Setup by first moving the start tag to the top.
        var node = container.querySelector('#start');
        var insert = container.firstChild;

        do {
            chapterNumbers = this.incrementChapter(chapterNumbers, node.indentation);
            node.chapterNumber = this.chapterNumbersToString(chapterNumbers);

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
    _setContainerTop: function () {
        var container = this.$['chapters-container'];
        var toolbar = this.$['chapter-toolbar'];

        function set(duration) {
            container.style.top = toolbar.clientHeight + 'px';

            if (duration < 300) {
                this.async(set.bind(this, duration + 10), 10);
            }
        }

        set.call(this, 0);
    },
    _getIcon: function (edit) {
        return edit ? 'done' : 'create';
    },

    // Changing Menus
    toggleMode: function () {
        this._editMode = !this._editMode;
        this._openMenu('main');

        if (!this._editMode) {
            // On exiting edit mode, match private chapter to public chapter.
            this._selectedChapter = this.selected;
        }
    },
    _openMenu: function (menu) {
        this._menusOpen = {
            main: menu === 'main',
            add: menu === 'add',
            edit: menu === 'edit',
            move: menu === 'move',
            delete: menu === 'delete'
        };

        this._setContainerTop();
    },

    // Add Menu
    openMenuAdd: function () {
        this._openMenu('add');
        this._addType = 'child';
    },
    _submitFormAdd: function (event) {
        var detail = event.detail;

        var chapter = this.$['chapters-container'].querySelector('#' + this._selectedChapter);
        var indentation;
        switch (detail.type) {
            case 'child':
                indentation = chapter.indentation + 1;
                break;

            case 'sibling':
                indentation = chapter.indentation;
                break;

            default:
                return;
        }

        // TODO: Need to getLastChild of selectedChapter.
        this.addChapter(this.group, this._selectedChapter, detail.title, indentation);

        this._openMenu('main');
    },
    _setPreviewChapterNumber: function (key, type) {
        if (!key || !type) {
            return;
        }

        // TODO: Change to getLastChild.
        var chapter = this.$['chapters-container'].querySelector('#' + key);
        // TODO: Chapter-Behavior add function for splitting chapter numbers.
        var chapterNumbers = chapter.chapterNumber.split('.');
        var indentation;
        switch (type) {
            case 'child':
                indentation = chapter.indentation + 1;
                break;

            case 'sibling':
                indentation = chapter.indentation;
                break;

            default:
                return;
        }

        chapterNumbers = this.incrementChapter(chapterNumbers, indentation);
        this._addPreview = this.chapterNumbersToString(chapterNumbers);
    }
    // Edit Menu
    // Move Menu
    // Delete Menu
});
