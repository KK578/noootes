chai.should();

describe('<noootes-reader>', function () {
    var noootesReader;

    before(function (done) {
        noootesReader = document.querySelector('noootes-reader');

        var firebase = Noootes.FirebaseRef();
        firebase.authWithPassword({
            email: 'Web@Component.Tester',
            password: 'WebComponentTester'
        }, function (err, user) {
            Noootes.Firebase.User = user;
            done();
        });
    });

    it('should show compiling message on changing group', function () {
        noootesReader.group = '-K-9osCRSNg4n6dtFgcB';

        var rendered = noootesReader.querySelector('#markdown');
        rendered.textContent.should.match(/Compiling Noootes.../);
    });

    it('should render each chapter\'s titles with it\'s chapter number', function (done) {
        var handle = window.setInterval(function () {
            var text = noootesReader.markdown;

            if (text !== '# Compiling Noootes...') {
                text.should.match(/# 1 First\n/m);
                text.should.match(/## 1.1 Sub Chapter\n/m);
                text.should.match(/### 1.1.1 Level 3\n/m);
                text.should.match(/## 1.2 Second Inner\n/m);
                text.should.match(/# 2 Second\n/m);

                window.clearInterval(handle);
                done();
            }
        }, 100);
    });
});
