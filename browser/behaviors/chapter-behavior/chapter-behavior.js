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
     * @param {String} key - Key to add group before.
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

    editChapter: function (key, title, indentation) { },

    removeChapter: function (key) { },

    moveChapter: function (key, target) { },

    deleteChapter: function (key) { }
};
