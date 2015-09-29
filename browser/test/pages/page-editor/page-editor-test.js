chai.should();

describe('<page-editor>', function () {
    function listenOnce(eventName, assertions) {
        function listener(event) {
            window.removeEventListener(eventName, listener);
            assertions(event);
        }

        window.addEventListener(eventName, listener);
    }

    var pageEditor;
    var editorError;

    before(function () {
        pageEditor = document.querySelector('page-editor');
        editorError = pageEditor.querySelector('#editor-error');
    });

    it('should display a message if no group is selected', function () {
        pageEditor._selectedPage.should.equal(0);
        editorError.textContent.should.equal('No group selected. Please select a group from your Noootes.');
    });

    it('should change user and group on hashchange', function (done) {
        listenOnce('hashchange', function () {
            pageEditor.user.should.equal('user');
            pageEditor.code.should.equal('CODE');

            done();
        });

        window.location.hash = '/editor/user/CODE';
    });

    it('should display a message if the user doesn\'t exist', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (editorError.textContent === 'Couldn\'t find a user with the name "FakeUser".') {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        window.location.hash = '/editor/FakeUser/CODE';
    });

    it('should display a message if the group doesn\'t exist', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (editorError.textContent === 'Couldn\'t find a group with the code "CODE".') {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        window.location.hash = '/editor/WCT/CODE';
    });

    it('should display a message if the user isn\'t allowed to write to the group', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (editorError.textContent === 'You don\'t have permission to write to these Noootes.') {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        window.location.hash = '/editor/Kek/WCTPRIVATE';
    });

    it('should remove messages if group is valid', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (editorError.textContent === '') {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);

            pageEditor._selectedPage.should.equal(1);
        });

        window.location.hash = '/editor/WCT/PERMANENT';
    });
});
