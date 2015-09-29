chai.should();

describe('<noootes-chapter-list>', function () {
    var chapterList;

    before(function (done) {
        chapterList = document.querySelector('noootes-chapter-list');

        var firebase = Noootes.FirebaseRef();
        firebase.authWithPassword({
            email: 'Web@Component.Tester',
            password: 'WebComponentTester'
        }, function (err, user) {
            Noootes.Firebase.User = user;
            done();
        });
    });

    it('should set location on group set', function () {
        var firebase = chapterList.querySelector('#firebase-chapter-list');
        chapterList.group = '-K-9osCRSNg4n6dtFgcB';

        firebase.location.should.equal('https://noootes-staging.firebaseio.com/notes/order/-K-9osCRSNg4n6dtFgcB');
    });

    it('should correctly order chapter list');
    it('should set chapter numbers');
    it('should select notify the public chapter on tapping item');

    describe('Edit Mode', function () {
        it('should change the private chapter on tapping item');
        it('should not notify the public chapter on tapping item');

        describe('Add Menu', function () {
            it('should show add menu only');
            it('should fire iron-form-invalid with empty inputs');
            it('should call addChapter on submit');
        });

        describe('Edit Menu', function () {
            it('should show edit menu only');
            it('should fire iron-form-invalid with empty inputs');
            it('should set title input to current title');
            it('should set indentation to current indentation');
            it('should call editChapter on submit');
        });

        describe('Move Menu', function () {
            it('has no tests written yet');
        });

        describe('Delete Menu', function () {
            it('should show delete menu only');
            it('should call deleteChapter on submit');
        });
    });

    describe('Exit Edit Mode', function () {
        it('should reset and close any open menus');
        it('should reselect the public chapter on exiting Edit mode');
    });
});
