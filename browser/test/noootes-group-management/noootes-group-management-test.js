chai.should();

describe('<noootes-group-management>', function () {
    function listenToEventOnClickingButton(form, eventName, inputs, button, done, assertions) {
        function listener(event) {
            if (assertions) {
                assertions(event);
            }

            window.removeEventListener(eventName, listener);
            done();
        }

        window.addEventListener(eventName, listener);

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            form.querySelector(input.name).value = input.value;
        }

        document.querySelector(button).click();
    }

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
        noootesGroup.group = '-K-9osCRSNg4n6dtFgcB';

        var data;
        var handle = window.setInterval(function () {
            data = noootesGroup._data;

            if (data) {
                data.code.should.equal('PERMANENT');
                data.title.should.equal('Owned Groups');
                data.owner.should.equal('3f8f4d76-8d58-4a56-a3f2-661dce66d085');
                data.description.should.equal('[WCT] Do not remove.');

                window.clearInterval(handle);
                done();
            }
        }, 100);
    });

    it('should use readable username', function (done) {
        var group = noootesGroup.querySelector('#group');
        var name = group.querySelector('#group-code');

        var handle = window.setInterval(function () {
            if (name.textContent === 'WCT/PERMANENT') {
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
        var form;

        before(function () {
            form = noootesGroup.querySelector('#form-edit');
            sinon.stub(noootesGroup, 'editGroup');
        });

        it('should show edit button and open collapse on click', function () {
            var button = noootesGroup.querySelector('#button-edit');
            button.style.display.should.not.equal('none');
            button.click();

            var collapse = noootesGroup.querySelector('#group-collapse-edit');
            collapse.opened.should.equal(true);
        });

        it('should set data to current data', function (done) {
            form.querySelector('paper-input[name=title]').value.should.equal('Owned Groups');
            form.querySelector('paper-input[name=description]').value.should.equal('[WCT] Do not remove.');
            form.querySelector('paper-radio-group').selected.should.equal('read');

            var checkbox = form.querySelector('paper-checkbox');
            var handle = window.setInterval(function () {
                if (checkbox.checked) {
                    window.clearInterval(handle);
                    done();
                }
            }, 100);
        });

        it('should fire "iron-form-invalid" if title is not set', function (done) {
            function assertions() {
                done();
            }

            var inputs = [
                { name: 'paper-input[name=title]', value: '' },
                { name: 'paper-input[name=description]', value: 'Not A Code' }
            ];
            var button = 'paper-button#button-edit-apply';

            listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done, assertions);
        });

        it('should call editGroup with valid inputs', function (done) {
            function assertions() {
                noootesGroup.editGroup.should.have.been.calledWithMatch({
                    code: 'PERMANENT',
                    title: 'WCT\'s Group',
                    description: '[WCT] Please do not remove.'
                }, {
                    global: 'none',
                    public: null
                });
            }

            var inputs = [
                { name: 'paper-input[name=title]', value: 'Ayyylmao' },
                { name: 'paper-input[name=description]', value: 'Not A Code' }
            ];
            var button = 'paper-button#button-edit-apply';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });
    });
});
