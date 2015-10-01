chai.should();

describe('<noootes-preview>', function () {
    var noootesPreview;

    before(function () {
        noootesPreview = document.querySelector('noootes-preview');

        var editor = document.querySelector('noootes-editor');
        editor.getText = function () {
            return 'Test Suites!';
        };

        var container = document.querySelector('#chapters-container');
        var fakeChapter = document.querySelector('fake-chapter');

        container.selectedItem = fakeChapter;
        fakeChapter.indentation = 3;
        fakeChapter.chapter = { title: 'The Title' };
    });

    it('should set markdown to editor\'s text on render', function () {
        noootesPreview.render();
        noootesPreview.markdown.should.match(/Test Suites!/);
    });

    it('should prepend the title to the start as a header', function () {
        noootesPreview.markdown.should.match(/^#### The Title/);
    });
});
