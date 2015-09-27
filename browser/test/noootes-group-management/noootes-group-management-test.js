chai.should();

describe('<noootes-group-management>', function () {
    var noootesGroup;

    before(function (done) {
        noootesGroup = document.querySelector('noootes-group-management');

        var firebase = Noootes.FirebaseRef();
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
        var button = noootesGroup.querySelector('#button-display');
        var collapse = noootesGroup.querySelector('#group-collapse-display');
        button.click();

        var handle = window.setInterval(function () {
            if (collapse.opened) {
                window.clearInterval(handle);
                done();
            }
        }, 100);
    });

    describe('Form Edit', function () {
        it('should show edit button and open collapse on click', function () {
            var button = noootesGroup.querySelector('#button-edit');
            button.style.display.should.not.equal('none');
            button.click();

            var collapse = noootesGroup.querySelector('#group-collapse-edit');
            collapse.opened.should.equal(true);
        });

        it('should set data to current data', function (done) {
            var form = noootesGroup.querySelector('#form-edit');
            form.querySelector('paper-input[name=title]').value.should.equal('Web Component Testing');
            form.querySelector('paper-input[name=description]').value.should.equal('The First Nooote');
            form.querySelector('paper-radio-group').selected.should.equal('read');

            var checkbox = form.querySelector('paper-checkbox');
            var handle = window.setInterval(function () {
                if (checkbox.checked) {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        it('should fire "iron-form-invalid" if title is not set');

        it('should call editGroup with valid inputs');
    });
});
