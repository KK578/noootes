chai.should();

describe('<page-reader>', function () {
    function listenOnce(eventName, assertions) {
        function listener(event) {
            window.removeEventListener(eventName, listener);
            assertions(event);
        }

        window.addEventListener(eventName, listener);
    }

    var pageReader;
    var readerError;

    before(function () {
        pageReader = document.querySelector('page-reader');
        readerError = pageReader.querySelector('#reader-error');
    });

    it('should display a message if no group is selected', function () {
        pageReader._selectedPage.should.equal(0);
        readerError.textContent.should.equal('No group selected. Please select a group from your Noootes.');
    });

    it('should change user and group on hashchange', function (done) {
        listenOnce('hashchange', function () {
            pageReader.user.should.equal('user');
            pageReader.code.should.equal('CODE');

            done();
        });

        window.location.hash = '/reader/user/CODE';
    });

    it('should display a message if the user doesn\'t exist', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (readerError.textContent === 'Couldn\'t find a user with the name "FakeUser".') {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        window.location.hash = '/reader/FakeUser/CODE';
    });

    it('should display a message if the group doesn\'t exist', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (readerError.textContent === 'Couldn\'t find a group with the code "CODE".') {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        window.location.hash = '/reader/WCT/CODE';
    });

    it('should display a message if the user isn\'t allowed to read the group\'s notes', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (readerError.textContent === 'You don\'t have permission to read these Noootes.') {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        window.location.hash = '/reader/Kek/WCTPRIVATE';
    });

    it('should remove messages if group is valid', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (readerError.textContent === '') {
                    pageReader._selectedPage.should.equal(1);

                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        window.location.hash = '/reader/WCT/PERMANENT';
    });

    it('should set the hash to previous valid group on changing back to #/reader/', function (done) {
        listenOnce('hashchange', function () {
            var handle = window.setInterval(function () {
                if (window.location.hash === '#/reader/WCT/PERMANENT') {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        window.location.hash = '/reader/';
    });
});
