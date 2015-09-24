chai.should();

describe('<noootes-group>', function () {
    var noootesGroup;

    before(function (done) {
        noootesGroup = document.querySelector('noootes-group');

        var firebase = new Firebase(Noootes.Firebase.Location);
        firebase.authWithPassword({
            email: 'Web@Component.Tester',
            password: 'WebComponentTester'
        }, done);
    });

    it('should fetch data from firebase on changing group', function (done) {
        noootesGroup.group = '-JzwgEvXhmCq6xVh7Wja';

        var data;
        var handle = window.setInterval(function () {
            data = noootesGroup._data;

            if (data) {
                data.code.should.equal('WCT');
                data.title.should.equal('Web Component Testing');
                data.owner.should.equal('bdcdc03c-01b8-4080-b77c-40df9b64067b');
                data.description.should.equal('The First Nooote');

                window.clearInterval(handle);
                done();
            }
        }, 100);
    });

    it('should use readable username', function (done) {
        var info = noootesGroup.querySelector('paper-item');
        var name = info.querySelector('#group-name');

        var handle = window.setInterval(function () {
            if (name.textContent === 'Kek/Web Component Testing') {
                window.clearInterval(handle);
                done();
            }
        }, 100);
    });
});
