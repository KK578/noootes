Noootes.Behaviors.ChapterBehavior = {
    ////////////////////
    // Chapter Numbering
    ////////////////////
    /**
     * Handles ordering of chapter numbers
     *
     * @param {Array} numbers - Chapter number set.
     * @param {Number} indentation - Indentation of new chapter.
     * @returns {Array} Updated numbers array.
     */
    incrementChapter: function (numbers, indentation) {
        if (indentation === undefined) {
            return [];
        }

        var newNumbers = numbers.slice(0, indentation + 1);
        newNumbers[indentation] = ++newNumbers[indentation] || 1;

        return newNumbers;
    },

    /**
     * Stringify chapter numbers.
     *
     * @param {Array} numbers - Chapter number set.
     * @returns {String} Stringified chapter numbers.
     */
    chapterNumbersToString: function (numbers) {
        return numbers.join('.');
    },

    /////////////////
    // Chapter Search
    /////////////////
    /**
     * Finds the next chapter that has the same or lower indentation as the given chapter.
     *
     * @param {HTMLElement} container - Element that contains all chapters.
     * @param {String} key - Chapter key to start search from.
     * @returns {String} Chapter key of input key's next sibling or parent.
     */
    getNextSibling: function (container, key) {
        var start = container.querySelector('#' + key);
        var lastChild = container.querySelector(start.nextChapter);

        // Standard linked list traversal until the node has an indentation that matches
        // or is lower (indicates the chapter is the last child of it's parent.)
        while (lastChild.indentation > start.indentation) {
            lastChild = container.querySelector(lastChild.nextChapter);
        }

        return lastChild;
    },

    /**
     * Finds the last child chapter of the given key, or itself.
     *
     * @param {HTMLElement} container - Element that contains all chapters.
     * @param {String} key - Chapter key to start search from.
     * @returns {String} Chapter key of input key's last child.
     */
    getLastChild: function (container, key) {
        var start = container.querySelector('#' + key);
        var targetIndentation = start.indentation + 1;
        var nextChapter = start;
        // If the loop finds no sibling chapters, and as chapters should not be allowed if
        // their indentation is not <= (previousChapter.indentation + 1), the given key must
        // have no sibling elements, and for calculation purposes can be treated as the last
        // child of itself.
        var lastChild = start;

        do {
            nextChapter = container.querySelector('#' + nextChapter.nextChapter);

            // If the chapter's indentation is 1 higher than this chapter's indentation,
            // it indicates that it is a direct child of the chapter.
            if (nextChapter.indentation === targetIndentation) {
                lastChild = nextChapter;
            }
        }
        while (nextChapter.indentation > start.indentation);

        return lastChild;
    },

    ////////////////////////
    // Chapter Order Editing
    ////////////////////////
    /**
     * Add new chapter to Noootes before the target key.
     *
     * @param {String} group - Group ID.
     * @param {String} key - Chapter Key to add new chapter before.
     * @param {String} title - Title of new chapter.
     * @param {Number} indentation - Indentation of new chapter.
     */
    addChapter: function (group, key, title, indentation) {
        var firebase = Noootes.FirebaseRef('notes/order/' + group);
        var newChapterKey = firebase.push().key();

        firebase.transaction(function (data) {
            var newChapter = {
                title: title,
                indentation: indentation,
                next: key,
                previous: data[key].previous
            };

            data[newChapterKey] = newChapter;
            // Attach new key to previous in chain.
            data[data[key].previous].next = newChapterKey;
            // Attach new key to next in chain.
            data[key].previous = newChapterKey;

            return data;
        });
    },

    /**
     * Edit the title and indentation of key.
     *
     * @param {String} group - Group ID.
     * @param {String} key - Chapter Key to edit
     * @param {String} title - New title of chapter.
     * @param {Number} indentation - New indentation of chapter.
     */
    editChapter: function (group, key, title, indentation) {
        var firebase = Noootes.FirebaseRef('notes/order/' + group);

        // NOTE: Though it is possible to just use firebase.set here, use transaction to
        // keep parity with all other chapter editing functions.
        // https://www.firebase.com/docs/web/api/firebase/transaction.html
        firebase.transaction(function (data) {
            data[key].title = title;
            // Currently not allowing indentation changes.
            //data[key].indentation = indentation;

            return data;
        });
    },

    /**
     * Remove chapter key from Linked list, running callback on data.
     *
     * @param {String} group - Group ID.
     * @param {String} key - Chapter key to remove.
     * @param {Function} callback - Function to run on data after removing from list.
     */
    removeChapter: function (group, key, callback) {
        var firebase = Noootes.FirebaseRef('notes/order/' + group);

        firebase.transaction(function (data) {
            // Unlink from previous key.
            data[data[key].previous].next = data[key].next;
            // Relink chain to next key.
            data[data[key].next].previous = data[key].previous;

            // Physical data handling is to be done by the callback.
            if (callback) {
                data = callback(data);
            }

            return data;
        });
    },

    /**
     * Move chapter from current position to before target key position.
     *
     * @param {String} group - Group ID.
     * @param {String} key - Chapter key to move.
     * @param {String} target - Chapter Key to move chapter before.
     */
    moveChapter: function (group, key, target) {
        this.removeChapter(group, key, function (data) {
            // Key is now isolated from chain, relink to chain before target.
            data[key].next = target;
            data[key].previous = data[target].previous;
            // Link target's previous to inserted chapter.
            data[data[target].previous].next = key;
            // Link target to inserted chapter.
            data[target].previous = key;

            return data;
        });
    },

    /**
     * Delete chapter and it's data.
     *
     * @param {String} group - Group ID.
     * @param {String} key - Key of chapter to delete.
     */
    deleteChapter: function (group, key) {
        this.removeChapter(group, key, function (data) {
            // Very Delete. Much Destruct. Wow.
            data[key] = null;

            return data;
        });
    }
};
