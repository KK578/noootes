chai.should();

describe('<screen-main>', function () {
    var screenMain;

    before(function () {
        screenMain = document.querySelector('screen-main');
    });

    it('should inherit PageBehavior', function () {
        screenMain.should.have.property('pages');
    });

    it('should template navigation items from PageBehavior', function () {
        var pages = screenMain.pages;

        var navigationItems = screenMain.querySelectorAll('.navigation-item');
        for (var i = 0; i < pages.length; i++) {
            navigationItems[i].textContent.should.equal(pages[i].title);
        }
    });

    it('should set hash to "#/home/" on first navigation', function (done) {
        function assertions() {
            window.location.hash.should.equal('#/home/');
            done();
        }

        if (window.location.hash === '') {
            window.addEventListener('hashchange', assertions);
        }
        else {
            assertions();
        }
    });

    it('should select Home navigation item on first navigation', function () {
        var pages = screenMain.pages;
        var navigationItems = screenMain.querySelectorAll('.navigation-item');

        screenMain._selectedPage.should.equal('/home/');

        for (var i = 0; i < pages.length; i++) {
            if (pages[i].title === 'Home') {
                navigationItems[i].classList.contains('iron-selected').should.equal(true);
            }
            else {
                navigationItems[i].classList.contains('iron-selected').should.equal(false);
            }
        }
    });
});
