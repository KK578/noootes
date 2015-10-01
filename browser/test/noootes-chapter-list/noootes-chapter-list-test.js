chai.should();

describe('<noootes-chapter-list>', function () {
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

        button.click();
    }

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

        it('should show main menu only', function () {
            chapterList.querySelector('#collapse-menu').opened.should.equal(true);
            chapterList.querySelector('#collapse-main').opened.should.equal(true);
            chapterList.querySelector('#collapse-add').opened.should.equal(false);
            chapterList.querySelector('#collapse-edit').opened.should.equal(false);
            chapterList.querySelector('#collapse-move').opened.should.equal(false);
            chapterList.querySelector('#collapse-delete').opened.should.equal(false);
        });

        it('should only change the private chapter on tapping item', function () {
            chapterList.querySelector('#-K-OS5tB1C8Y_TfGmx5I').click();
            chapterList._selectedChapter.should.equal('-K-OS5tB1C8Y_TfGmx5I');
            chapterList.selected.should.equal('-K-OYWuzamCbn6-9j8FB');
        });

        describe('Add Menu', function () {
            var form;

            before(function () {
                form = chapterList.querySelector('#form-add');
                sinon.stub(chapterList, 'addChapter');
            });

            it('should show add menu only on clicking button', function () {
                var button = chapterList.querySelector('#button-add');
                button.click();

                chapterList.querySelector('#collapse-main').opened.should.equal(false);
                chapterList.querySelector('#collapse-add').opened.should.equal(true);
                chapterList.querySelector('#collapse-edit').opened.should.equal(false);
                chapterList.querySelector('#collapse-move').opened.should.equal(false);
                chapterList.querySelector('#collapse-delete').opened.should.equal(false);
            });

            it('should fire iron-form-invalid with empty inputs', function (done) {
                var inputs = [
                    { name: 'paper-input[name=title]', value: '' }
                ];
                var button = form.querySelector('paper-button.submit');

                listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done);
            });

            it('should call addChapter on submit adding as child', function (done) {
                function assertions() {
                    chapterList.addChapter.should.have.been.calledWith(
                        '-K-9osCRSNg4n6dtFgcB',
                        '-K-OYPE-cxp4xzlAX9yi',
                        'WCT Child',
                        2
                    );
                }

                var inputs = [
                    { name: 'paper-input[name=title]', value: 'WCT Child' }
                ];
                form.querySelector('paper-radio-group').selected = 'child';
                var button = form.querySelector('paper-button.submit');

                listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
            });

            it('should call addChapter on submit adding as sibling', function (done) {
                function assertions() {
                    chapterList.addChapter.should.have.been.calledWith(
                        '-K-9osCRSNg4n6dtFgcB', // Group
                        '-K-OYPE-cxp4xzlAX9yi', // Next Sibling of current selected chapter.
                        'WCT Sibling',
                        1
                    );
                }

                var inputs = [
                    { name: 'paper-input[name=title]', value: 'WCT Sibling' }
                ];
                form.querySelector('paper-radio-group').selected = 'sibling';
                var button = form.querySelector('paper-button.submit');

                listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
            });
        });

        describe('Edit Menu', function () {
            var form;

            before(function () {
                form = chapterList.querySelector('#form-edit');
                sinon.stub(chapterList, 'editChapter');
            });

            it('should show edit menu only on clicking button', function () {
                var button = chapterList.querySelector('#button-edit');
                button.click();

                chapterList.querySelector('#collapse-main').opened.should.equal(false);
                chapterList.querySelector('#collapse-add').opened.should.equal(false);
                chapterList.querySelector('#collapse-edit').opened.should.equal(true);
                chapterList.querySelector('#collapse-move').opened.should.equal(false);
                chapterList.querySelector('#collapse-delete').opened.should.equal(false);
            });

            it('should set inputs to current values', function () {
                form.querySelector('paper-input[name=title]').value.should.equal('Sub Chapter');
                // TODO: Indentation changes.
            });

            it('should fire iron-form-invalid with empty inputs', function (done) {
                var inputs = [
                    { name: 'paper-input[name=title]', value: '' }
                ];
                var button = form.querySelector('paper-button.submit');

                listenToEventOnClickingButton(form, 'iron-form-invalid', inputs, button, done);
            });

            it('should call editChapter on submit', function (done) {
                function assertions() {
                    chapterList.editChapter.should.have.been.calledWith(
                        '-K-9osCRSNg4n6dtFgcB', // Group
                        '-K-OS5tB1C8Y_TfGmx5I', // Current Chapter.
                        'Replaced Title' // New Title
                    );
                }

                var inputs = [
                    { name: 'paper-input[name=title]', value: 'Replaced Title' }
                ];
                var button = form.querySelector('paper-button.submit');

                listenToEventOnClickingButton(form, 'iron-form-submit', inputs, button, done, assertions);
            });
        });

        describe('Move Menu', function () {
            it('has no tests written yet');
        });

        describe('Delete Menu', function () {
            var form;

            before(function () {
                form = chapterList.querySelector('#form-delete');
                sinon.stub(chapterList, 'deleteChapter');
            });

            it('should show delete menu only on clicking button', function () {
                var button = chapterList.querySelector('#button-delete');
                button.click();

                chapterList.querySelector('#collapse-main').opened.should.equal(false);
                chapterList.querySelector('#collapse-add').opened.should.equal(false);
                chapterList.querySelector('#collapse-edit').opened.should.equal(false);
                chapterList.querySelector('#collapse-move').opened.should.equal(false);
                chapterList.querySelector('#collapse-delete').opened.should.equal(true);
            });

            it('should call deleteChapter on submit', function (done) {
                function assertions() {
                    chapterList.deleteChapter.should.have.been.calledWith(
                        '-K-9osCRSNg4n6dtFgcB', // Group
                        '-K-OS5tB1C8Y_TfGmx5I' // Current Chapter
                    );
                }

                var button = form.querySelector('paper-button.submit');

                listenToEventOnClickingButton(form, 'iron-form-submit', [], button, done, assertions);
            });
        });
    });

    describe('Exit Edit Mode', function () {
        it('should reselect the public chapter on exiting Edit mode', function () {
            chapterList.selected.should.equal('-K-OYWuzamCbn6-9j8FB');

            var button = chapterList.querySelector('#button-mode');
            button.click();
            button.icon.should.equal('create');
            chapterList._editMode.should.equal(false);
            chapterList._selectedChapter.should.equal('-K-OYWuzamCbn6-9j8FB');
        });

        it('should reset and close any open menus', function () {
            chapterList.querySelector('#collapse-menu').opened.should.equal(false);
            chapterList.querySelector('#collapse-main').opened.should.equal(true);
            chapterList.querySelector('#collapse-add').opened.should.equal(false);
            chapterList.querySelector('#collapse-edit').opened.should.equal(false);
            chapterList.querySelector('#collapse-move').opened.should.equal(false);
            chapterList.querySelector('#collapse-delete').opened.should.equal(false);
        });
    });
});
