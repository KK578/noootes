chai.should();

describe('<noootes-chapter>', function () {
    var noootesChapter;

    before(function () {
        noootesChapter = document.querySelector('noootes-chapter');
    });

    it('should set text content on chapter change', function () {
        noootesChapter.chapter = {
            next: 'end',
            previous: 'start',
            indentation: 1,
            title: 'A Test Chapter'
        };
        noootesChapter.chapterNumber = '1.1';

        noootesChapter.textContent.should.equal('1.1A Test Chapter');
        noootesChapter.indentation.should.equal(1);
    });
});
