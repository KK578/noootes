chai.should();

describe('<page-groups>', function () {
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
        it('has no tests written yet');
    });

    describe('Public Groups', function () {
        it('has no tests written yet');
    });
});
