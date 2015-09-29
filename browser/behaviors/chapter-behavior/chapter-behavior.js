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

    addChapter: function (key, title, indentation) { },

    editChapter: function (key, title, indentation) { },

    removeChapter: function (key) { },

    moveChapter: function (key, target) { },

    deleteChapter: function (key) { }
};
