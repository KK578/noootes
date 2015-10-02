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
    behaviors: [
        Noootes.Behaviors.ChapterBehavior,
        Noootes.Behaviors.FormBehavior
    ],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'chapters-template.dom-change': '_setupChapterList',
        'form-add.iron-form-submit': '_submitFormAdd',
        'form-edit.iron-form-submit': '_submitFormEdit',
        'form-delete.iron-form-submit': '_submitFormDelete'
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
            value: '',
            notify: true
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
        this._selectedChapter = '';
        this._location = Noootes.Firebase.Location + 'notes/order/' + group;
        this._setContainerTop();
    },

    // Order
    _setupChapterList: function () {
        var container = this.$['chapters-container'];
        var length = container.childNodes.length;

        if (length > 1) {
            this._sortChapterList();

            // If the data only consists of the template, start and end, Add a new chapter.
            if (length <= 3) {
                this.addChapter(this.group, 'end', 'My Notes', 0);
            }

            if (!this._selectedChapter) {
                this._selectFirstChapter();
            }
        }
        else {
            var firebase = this.$['firebase-chapter-list'].query;

            if (firebase) {
                // HACK: Loads data to check if it exists, as accessing _data always returns [].
                // Perhaps change to only load start/end?
                firebase.once('value', function (ss) {
                    if (!ss.val()) {
                        // If no content is found, set up start and end.
                        firebase.set({
                            start: { next: 'end' },
                            end: { previous: 'start' }
                        });
                    }
                });
            }
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
    _selectFirstChapter: function () {
        this._selectedChapter = this.$['chapters-container'].childNodes[1].id;
    },

    // Edit Mode
    _setContainerTop: function () {
        var container = this.$['chapters-container'];
        var toolbar = this.$['chapter-toolbar'];

        function set(duration) {
            var height = toolbar.clientHeight;
            container.style.top = height + 'px';
            container.style.height = 'calc(100% - ' + height + 'px)';

            if (duration < 300) {
                this.async(set.bind(this, duration + 10), 10);
            }
        }

        set.call(this, 0);
    },
    _drawerTitle: function (mode) {
        return mode ? 'Edit Chapters' : 'Chapters';
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
    resetMenus: function () {
        this.resetForm(this.$['form-add'], true);

        this._openMenu('main');
    },

    // Add Menu
    openMenuAdd: function () {
        this._openMenu('add');
        this._addType = 'child';
    },
    _submitFormAdd: function (event) {
        var detail = event.detail;

        var container = this.$['chapters-container'];
        var chapter = container.querySelector('#' + this._selectedChapter);
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

        var insertTarget = this.getNextSibling(container, this._selectedChapter);
        this.addChapter(this.group, insertTarget.id, detail.title, indentation);

        this.resetMenus();
    },
    _setPreviewChapterNumber: function (key, type) {
        if (!key || !type) {
            return;
        }

        var container = this.$['chapters-container'];
        var selected = container.querySelector('#' + key);

        var indentation;
        switch (type) {
            case 'child':
                indentation = selected.indentation + 1;
                break;

            case 'sibling':
                indentation = selected.indentation;
                break;

            default:
                return;
        }

        // TODO: Chapter-Behavior add function for splitting chapter numbers.
        var chapter = this.getLastChild(container, key);
        var chapterNumbers = chapter.chapterNumber.split('.');
        chapterNumbers = this.incrementChapter(chapterNumbers, indentation);
        this._addPreview = this.chapterNumbersToString(chapterNumbers);
    },

    // Edit Menu
    openMenuEdit: function () {
        var title = this.$['chapters-container'].selectedItem.chapter.title;
        var input = this.$['form-edit'].querySelector('paper-input[name=title]');
        input.value = title;

        this._openMenu('edit');
    },
    _submitFormEdit: function (event) {
        var detail = event.detail;
        this.editChapter(this.group, this._selectedChapter, detail.title);

        this.resetMenus();
    },

    // Move Menu
    openMenuMove: function () {
        this._openMenu('move');
    },

    // Delete Menu
    openMenuDelete: function () {
        this._openMenu('delete');
    },
    _submitFormDelete: function () {
        var chapter = this._selectedChapter;
        this._selectFirstChapter();
        this.deleteChapter(this.group, chapter);

        this.resetMenus();
    }
});
