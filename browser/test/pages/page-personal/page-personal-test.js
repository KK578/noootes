chai.should();

describe('<page-personal>', function () {
    var pagePersonal;

    before(function (done) {
        pagePersonal = document.querySelector('page-personal');

        var firebase = Noootes.FirebaseRef();
        firebase.authWithPassword({
            email: 'Web@Component.Tester',
            password: 'WebComponentTester'
        }, done);
    });

    describe('Owned Groups', function () {
        it('has no tests written yet.');
    });

    describe('Joined Groups', function () {
        it('has no tests written yet.');
    });
});
