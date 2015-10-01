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

    it('should correctly order chapter list', function (done) {
        var chaptersContainer = chapterList.querySelector('#chapters-container');
        var correctOrder = [
            'start',
            '-K-OQciTe2Q7ltENcAx7',
            '-K-OS5tB1C8Y_TfGmx5I',
            '-K-OYWuzamCbn6-9j8FB',
            '-K-OYPE-cxp4xzlAX9yi',
            '-K-ORJFSh-NjDCFsjbW4',
            'end'
        ];

        var handle = window.setInterval(function () {
            var chapters = chaptersContainer.childNodes;

            if (chapters.length > 1) {
                window.clearInterval(handle);

                for (var i = 0; i < correctOrder.length; i++) {
                    chapters[i].id.should.equal(correctOrder[i]);
                }

                done();
            }
        }, 100);
    });

    it('should set chapter numbers', function () {
        var chaptersContainer = chapterList.querySelector('#chapters-container');
        var chapters = chaptersContainer.childNodes;
        var correctNumbers = [
            '',
            '1',
            '1.1',
            '1.1.1',
            '1.2',
            '2'
        ];

        for (var i = 0; i < correctNumbers.length; i++) {
            chapters[i].chapterNumber.should.equal(correctNumbers[i]);
        }
    });

    it('should select notify the public chapter on tapping item', function () {
        chapterList.querySelector('#-K-OYWuzamCbn6-9j8FB').click();
        chapterList._selectedChapter.should.equal('-K-OYWuzamCbn6-9j8FB');
        chapterList.selected.should.equal('-K-OYWuzamCbn6-9j8FB');
    });

    describe('Edit Mode', function () {
        it('should change to edit mode on tapping icon', function () {
            var button = chapterList.querySelector('#button-mode');
            button.click();
            chapterList._editMode.should.equal(true);
            button.icon.should.equal('done');
        });

        it('should only change the private chapter on tapping item', function () {
            chapterList.querySelector('#-K-OS5tB1C8Y_TfGmx5I').click();
            chapterList._selectedChapter.should.equal('-K-OS5tB1C8Y_TfGmx5I');
            chapterList.selected.should.equal('-K-OYWuzamCbn6-9j8FB');
        });

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
        it('should reselect the public chapter on exiting Edit mode', function () {
            chapterList.selected.should.equal('-K-OYWuzamCbn6-9j8FB');

            var button = chapterList.querySelector('#button-mode');
            button.click();
            chapterList._editMode.should.equal(false);
            chapterList._selectedChapter.should.equal('-K-OYWuzamCbn6-9j8FB');
        });

        it('should reset and close any open menus');
    });
});
