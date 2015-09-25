chai.should();

describe('<page-groups>', function () {
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

    var pageGroups;

    before(function (done) {
        pageGroups = document.querySelector('page-groups');

        var firebase = new Firebase(Noootes.Firebase.Location);
        firebase.authWithPassword({
            email: 'Web@Component.Tester',
            password: 'WebComponentTester'
        }, done);
    });

    describe('Search', function () {
        var form;

        before(function (done) {
            form = pageGroups.querySelector('#form-search');
            window.setTimeout(done, 0);
        });

        it('should fire "iron-form-invalid" with empty inputs', function (done) {
            var inputs = [
                { name: 'paper-input[name=user]', value: '' },
                { name: 'paper-input[name=code]', value: '' }
            ];
            var button = 'paper-button#button-search';

            listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done);
        });

        it('should fire "iron-form-submit" with any input', function (done) {
            var inputs = [
                { name: 'paper-input[name=user]', value: 'Not A User' },
                { name: 'paper-input[name=code]', value: 'Not A Code' }
            ];
            var button = 'paper-button#button-search';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done);
        });

        it('should show an error message with an invalid user', function (done) {
            function assertions() {
                var userInput = form.querySelector('paper-input[name=user]');
                userInput.errorMessage.should.equal('Please enter a valid username.');
                userInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=user]', value: 'Not A User' },
                { name: 'paper-input[name=code]', value: 'CODEKEK' }
            ];
            var button = 'paper-button#button-search';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message with an invalid code', function (done) {
            function assertions() {
                var codeInput = form.querySelector('paper-input[name=code]');
                codeInput.errorMessage.should.equal('Please enter a valid code.');
                codeInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=user]', value: 'Ayyylmao' },
                { name: 'paper-input[name=code]', value: 'Not A Code' }
            ];
            var button = 'paper-button#button-search';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show an error message if no group is found', function (done) {
            function assertions() {
                var codeInput = form.querySelector('paper-input[name=code]');
                codeInput.errorMessage.should.equal('Please enter a valid code.');
                codeInput.invalid.should.equal(true);
            }

            var inputs = [
                { name: 'paper-input[name=user]', value: 'Ayyylmao' },
                { name: 'paper-input[name=code]', value: 'Not A Code' }
            ];
            var button = 'paper-button#button-search';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });

        it('should show a noootes-group if a group is found', function (done) {
            function assertions() {
                var result = pageGroups.querySelector('noootes-group#group-search-result');
                result.textContent.should.match(/Kek\/WCTPRIVATE/);
            }

            var inputs = [
                { name: 'paper-input[name=user]', value: 'Kek' },
                { name: 'paper-input[name=code]', value: 'WCTPRIVATE' }
            ];
            var button = 'paper-button#button-search';

            listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
        });
    });

    describe('Public Groups', function () {
        it('should set location for firebase-collection on clicking button', function () {
            var firebase = pageGroups.querySelector('#firebase-public-groups');
            (firebase.location === undefined).should.equal(true);

            var button = pageGroups.querySelector('#button-public-groups');
            button.click();
            firebase.location.should.equal('https://noootes-staging.firebaseio.com/groups/public');
        });

        it('should template items from firebase-collection', function (done) {
            var container = pageGroups.querySelector('#container-public-groups');
            var handle = window.setInterval(function () {
                if (container.childNodes.length > 1) {
                    window.clearInterval(handle);
                    done();
                }
            }, 500);
        });

        it('should set group property on templated items', function () {
            var container = pageGroups.querySelector('#container-public-groups');
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
});
