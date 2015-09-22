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

    describe('Logout Dialog', function () {
        var dialog;

        before(function () {
            dialog = screenMain.querySelector('#dialog-logout');
        });

        it('should open Logout dialog on clicking Logout button', function (done) {
            var buttons = screenMain.querySelectorAll('.navigation-item');
            var button = buttons[buttons.length - 1];
            button.textContent.should.equal('Logout', 'Logout button is not the last navigation item in the drawer.');

            dialog.addEventListener('iron-overlay-opened', function () {
                done();
            });

            button.click();
        });

        it('should close Logout dialog without firing other events on clicking cancel button', function (done) {
            var buttons = dialog.querySelectorAll('paper-button');
            var button = buttons[0];
            button.textContent.should.equal('No');

            function assertNotCalled() {
                done(new Error('Logout event was called'));
            }

            window.addEventListener('firebase-logout', assertNotCalled);
            dialog.addEventListener('iron-overlay-closed', function () {
                window.setTimeout(function () {
                    window.removeEventListener('firebase-logout', assertNotCalled);
                    done();
                }, 1000);
            });

            button.click();
        });

        it('should close Logout dialog and fire "firebase-logout" on clicking logout button', function (done) {
            dialog.addEventListener('iron-overlay-opened', function () {
                var buttons = dialog.querySelectorAll('paper-button');
                var button = buttons[1];
                button.textContent.should.equal('Yes');

                var counter = 0;

                function end() {
                    if (++counter >= 2) {
                        done();
                    }
                }

                window.addEventListener('firebase-logout', end);
                dialog.addEventListener('iron-overlay-closed', end);
                button.click();
            });

            dialog.open();
        });
    });
});
