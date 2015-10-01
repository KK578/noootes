chai.should();

describe('<screen-main>', function () {
    function listenToEventOnce(eventName, done, assertions) {
        function listener(event) {
            if (assertions) {
                assertions(event);
            }

            window.removeEventListener(eventName, listener);
            done();
        }

        window.addEventListener(eventName, listener);
    }

    var screenMain;

    before(function () {
        Noootes.Firebase.User = {
            password: {
                email: 'spoof@test.suite'
            }
        };

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

        for (var i = 0; i < pages.length; i++) {
            if (pages[i].title === 'Home') {
                navigationItems[i].classList.contains('iron-selected').should.equal(true);
            }
            else {
                navigationItems[i].classList.contains('iron-selected').should.equal(false);
            }
        }
    });

    it('should fire "page-changed" on changing hash location', function (done) {
        function assertions(event) {
            var detail = event.detail;
            detail.tag.should.equal('/about/');
            detail.element.should.equal('page-about');
        }

        listenToEventOnce('page-changed', done, assertions);
        window.location.hash = '/about/';
    });

    it('should fire "page-changed" on clicking a navigation item', function (done) {
        function assertions(event) {
            var detail = event.detail;
            detail.tag.should.equal('/home/');
            detail.element.should.equal('page-home');
            window.location.hash.should.equal('#/home/');
        }

        listenToEventOnce('page-changed', done, assertions);
        var item = screenMain.querySelectorAll('.navigation-item')[0];
        item.click();
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

            function end() {
                dialog.removeEventListener('iron-overlay-opened', end);
                done();
            }

            dialog.addEventListener('iron-overlay-opened', end);

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

    describe('Toolbar Updates', function () {
        it('should set user\'s email in drawer toolbar', function () {
            window.dispatchEvent(new CustomEvent('firebase-login-success'));
            var toolbar = screenMain.querySelector('#drawer-toolbar');
            toolbar.querySelector('span').textContent.should.equal('spoof@test.suite');
        });

        it('should set current page name in main toolbar', function () {
            var toolbar = screenMain.querySelector('#main-toolbar');
            toolbar.querySelector('h2').textContent.should.equal('Home');
        });

        it('should change toolbar title and subtitle on "toolbar-update"', function (done) {
            function assertions() {
                var toolbar = screenMain.querySelector('#main-toolbar');
                toolbar.querySelector('h2').textContent.should.equal('The Title');
                toolbar.querySelector('span').textContent.should.equal('The Subtitle');
            }

            listenToEventOnce('toolbar-update', done, assertions);

            var detail = {
                title: 'The Title',
                subtitle: 'The Subtitle'
            };

            window.dispatchEvent(new CustomEvent('toolbar-update', { detail: detail }));
        });

        it('should run callbacks on buttons passed via "toolbar-update"', function (done) {
            var toolbar = screenMain.querySelector('#main-toolbar');

            function click() {
                toolbar.querySelector('paper-button').click();
            }

            function assertions() {
                toolbar.querySelector('h2').textContent.should.equal('');
                toolbar.querySelector('span').textContent.should.equal('');
            }

            listenToEventOnce('toolbar-update', click, assertions);

            var button = document.createElement('paper-button');
            button.onclick = function () {
                done();
            };

            var detail = {
                buttons: [
                    button
                ]
            };

            window.dispatchEvent(new CustomEvent('toolbar-update', { detail: detail }));
        });

        it('should remove buttons on "toolbar-update" with no buttons array', function (done) {
            function assertions() {
                var toolbar = screenMain.querySelector('#main-toolbar');
                toolbar.querySelector('h2').textContent.should.equal('Just a Title');
                toolbar.querySelector('span').textContent.should.equal('');
                toolbar.querySelector('#toolbar-buttons').childNodes.length.should.equal(0);
            }

            listenToEventOnce('toolbar-update', done, assertions);

            var detail = {
                title: 'Just a Title'
            };

            window.dispatchEvent(new CustomEvent('toolbar-update', { detail: detail }));
        });
    });
});
