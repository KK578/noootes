chai.should();

describe('<noootes-editor>', function () {
    var noootesEditor;

    before(function (done) {
        noootesEditor = document.querySelector('noootes-editor');

        var firebase = Noootes.FirebaseRef();
        firebase.authWithPassword({
            email: 'Web@Component.Tester',
            password: 'WebComponentTester'
        }, function (err, user) {
            Noootes.Firebase.User = user;
            done();
        });
    });

    it('should select first chapter on group being set', function (done) {
        noootesEditor.group = '-K-9osCRSNg4n6dtFgcB';
        var indicator = noootesEditor.querySelector('#chapter-container');

        var handle = window.setInterval(function () {
            if (noootesEditor.chapter === '-K-OQciTe2Q7ltENcAx7') {
                indicator.textContent.should.equal('Chapter 1: First');
                window.clearInterval(handle);
                done();
            }
        }, 100);
    });

    it('should setup firepad with chapter and group set', function (done) {
        var firepad = noootesEditor.querySelector('#firepad');

        var handle = window.setInterval(function () {
            if (noootesEditor._firepad) {
                if (firepad.textContent.match(/Firepad Loaded./)) {
                    window.clearInterval(handle);
                    done();
                }
            }
        }, 100);
    });

    it('should cleanup on removing group', function (done) {
        noootesEditor.group = '';

        var handle = window.setInterval(function () {
            if (noootesEditor.chapter === '') {
                (noootesEditor._firepad === undefined).should.equal(true);
                var firepad = noootesEditor.querySelector('#firepad');
                firepad.innerHTML.should.equal('');

                window.clearInterval(handle);
                done();
            }
        }, 100);
    });
});
