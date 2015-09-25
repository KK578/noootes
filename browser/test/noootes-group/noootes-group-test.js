chai.should();

describe('<noootes-group>', function () {
    var noootesGroup;

    before(function (done) {
        noootesGroup = document.querySelector('noootes-group');

        var firebase = new Firebase(Noootes.Firebase.Location);
        firebase.authWithPassword({
            email: 'Web@Component.Tester',
            password: 'WebComponentTester'
        }, function (err, user) {
            Noootes.Firebase.User = user;
            done();
        });
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
        var group = noootesGroup.querySelector('#group');
        var name = group.querySelector('#group-code');

        var handle = window.setInterval(function () {
            if (name.textContent === 'Kek/WCT') {
                window.clearInterval(handle);
                done();
            }
        }, 100);
    });

    it('should open collapse on clicking button', function (done) {
        var button = noootesGroup.querySelector('#group-button');
        var collapse = noootesGroup.querySelector('#group-collapse');
        button.click();

        var handle = window.setInterval(function () {
            if (collapse.opened) {
                window.clearInterval(handle);
                done();
            }
        }, 100);
    });

    it('should show access status in iron-collapse', function () {
        var statusAccess = noootesGroup.querySelector('#group-status-access');
        statusAccess.textContent.should.equal('Global Access Status: Read');

        var statusRequest = noootesGroup.querySelector('#group-status-request');
        statusRequest.textContent.should.equal('Your Status: Read');
    });

    it('should remove all data on removing group', function () {
        noootesGroup.group = '';

        (noootesGroup._data === undefined).should.equal(true);
        var group = noootesGroup.querySelector('#group');
        group.textContent.should.equal('');
    });
});
