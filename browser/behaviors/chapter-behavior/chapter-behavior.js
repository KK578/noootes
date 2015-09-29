Noootes.Behaviors.ChapterBehavior = {
    incrementChapter: function (numbers, indentation) {
        if (indentation === undefined) {
            return [];
        }

        var newNumbers = numbers.slice(0, indentation + 1);
        newNumbers[indentation] = ++newNumbers[indentation] || 1;

        return newNumbers;
    },
    chapterNumbersToString: function (numbers) {
        return numbers.join('.');
    },

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

    removeChapter: function (key) { },

    moveChapter: function (key, target) { },

    deleteChapter: function (key) { }
};
