chai.should();

describe('<page-groups>', function () {
    var pageGroups;

    before(function () {
        pageGroups = document.querySelector('page-groups');
    });

    describe('Search', function () {
        it('has no tests written yet');
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
    });
});
