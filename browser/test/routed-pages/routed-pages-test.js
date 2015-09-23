chai.should();

describe('<routed-pages>', function () {
    var routedPages;

    before(function () {
        routedPages = document.querySelector('routed-pages');
    });

    it('should inherit PageBehavior', function () {
        routedPages.should.have.property('pages').and.be.instanceOf(Array);
    });

    it('should template page elements from pages', function () {
        var pages = routedPages.pages;
        var pageElements = routedPages.querySelector('neon-animated-pages').childNodes;
        pageElements.length.should.equal(pages.length);

        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            var element = pageElements[i];
            element.nodeName.should.equal(page.element.toUpperCase());
            element.getAttribute('route').should.equal(page.tag);
        }
    });

    it('should change the selected page on "page-changed"', function () {
        (routedPages._selectedPage === undefined).should.equal(true);

        var detail = {
            tag: '/home/',
            title: 'Home',
            element: 'page-home'
        };
        window.dispatchEvent(new CustomEvent('page-changed', { detail: detail }));

        routedPages._selectedPage.should.equal('/home/');
    });

    it('should fire "toat-message" on failing to load the new page.', function (done) {
        window.addEventListener('toast-message', function (event) {
            event.detail.message.should.startWith('Failed to load the Fake page.');
            routedPages.selectedPage.should.equal('/home/');

            done();
        });

        var detail = {
            tag: '/fake/',
            title: 'Fake',
            element: 'fake-page'
        };
        window.dispatchEvent(new CustomEvent('page-changed', { detail: detail }));

        routedPages._selectedPage.should.equal('/home/');
    });
});
