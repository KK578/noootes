chai.should();

describe('<page-personal>', function () {
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

    describe('Joined Groups', function () {
        it('has no tests written yet.');
    });
});
