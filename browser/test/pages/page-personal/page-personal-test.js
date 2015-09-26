chai.should();

describe('<page-personal>', function () {
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

        form.querySelector(button).click();
    }

    var pagePersonal;

    before(function (done) {
        pagePersonal = document.querySelector('page-personal');

        var firebase = Noootes.FirebaseRef();
        firebase.authWithPassword({
            email: 'Web@Component.Tester',
            password: 'WebComponentTester'
        }, function (err, user) {
            Noootes.Firebase.User = user;
            done();
        });
    });

    describe('Owned Groups', function () {
        it('should set location for firebase-collection on clicking button', function () {
            var firebase = pagePersonal.querySelector('#firebase-groups-owned');
            (firebase.location === undefined).should.equal(true);

            var button = pagePersonal.querySelector('#button-groups-owned');
            button.click();
            firebase.location.should.equal('https://noootes-staging.firebaseio.com/users/personal/3f8f4d76-8d58-4a56-a3f2-661dce66d085/owned');
        });

        it('should template items from firebase-collection', function (done) {
            var container = pagePersonal.querySelector('#container-groups-owned');
            var handle = window.setInterval(function () {
                if (container.childNodes.length > 1) {
                    window.clearInterval(handle);
                    done();
                }
            }, 500);
        });

        it('should set group property on templated items', function () {
            var container = pagePersonal.querySelector('#container-groups-owned');
            var children = container.childNodes;

            for (var i = 0; i < children.length - 1; i++) {
                if (i === children.length) {
                    children[i].nodeName.should.equal('TEMPLATE');
                }
                else {
                    children[i].group.should.match(/.{20}/);
                }
            }
        });
    });

    describe('Create Group', function () {
        var form;

        before(function (done) {
            form = pagePersonal.querySelector('#form-create');
            window.setTimeout(done, 0);
        });

        it('should fire "iron-form-invalid" with empty inputs', function (done) {
            var inputs = [
                { name: 'paper-input[name=code]', value: '' },
                { name: 'paper-input[name=title]', value: '' },
                { name: 'paper-input[name=description]', value: '' }
            ];
            var button = 'paper-button#button-create';

            listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done);
        });

        it('should fire "iron-form-submit" with any input', function (done) {
            var inputs = [
                { name: 'paper-input[name=code]', value: 'Not a Code' },
                { name: 'paper-input[name=title]', value: 'The Title' },
                { name: 'paper-input[name=description]', value: 'The Description' }
            ];
            var button = 'paper-button#button-create';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done);
        });

        it('should show an error message with an invalid code', function (done) {
            function assertions() {
                var codeInput = form.querySelector('paper-input[name=code]');
                codeInput.errorMessage.should.equal('Please enter a valid code.');
                codeInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=code]', value: 'Not a Code' },
                { name: 'paper-input[name=title]', value: 'The Title' },
                { name: 'paper-input[name=description]', value: 'The Description' }
            ];
            var button = 'paper-button#button-create';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message registering the same code again', function (done) {
            function assertions() {
                var codeInput = form.querySelector('paper-input[name=code]');
                var handle = window.setInterval(function () {
                    if (codeInput.errorMessage === 'Code "PERMANENT" already exists.') {
                        codeInput.invalid.should.equal(true);

                        window.clearInterval(handle);
                        done();
                    }
                }, 100);
            }

            var inputs = [
                { name: 'paper-input[name=code]', value: 'PERMANENT' },
                { name: 'paper-input[name=title]', value: 'The Title' },
                { name: 'paper-input[name=description]', value: 'The Description' }
            ];
            var button = 'paper-button#button-create';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, assertions);
        });

        // TODO: Find way to test that the group was properly made without going online.
        it('should create group with all valid input', function (done) {
            Firebase.goOffline();

            var inputs = [
                { name: 'paper-input[name=code]', value: 'WCTTEST' },
                { name: 'paper-input[name=title]', value: 'The Title' },
                { name: 'paper-input[name=description]', value: 'The Description' }
            ];
            var button = 'paper-button#button-create';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done);
        });
    });

    describe('Joined Groups', function () {
        it('has no tests written yet.');
    });
});
