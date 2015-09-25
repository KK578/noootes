/* globals sinon */
/* jshint -W030 */
chai.should();

describe('<noootes-app>', function () {
    var testUser;
    var firebase;

    before(function () {
        firebase = document.querySelector('#firebase-auth');

        var name = 'wct-tester-' + Math.round(50000 * Math.random());
        var email = name + '@test.suite';
        var password = 'wct-tester';
        testUser = {
            email: email,
            password: password,
            newEmail: 'new-' + email,
            newPassword: 'new-' + password
        };
    });

    it('should call firebase-auth#login on "firebase-login"', function () {
        sinon.stub(firebase, 'login', function () {
            firebase.fire('login');
        });

        var detail = {
            email: testUser.email,
            password: testUser.password
        };

        window.dispatchEvent(new CustomEvent('firebase-login', { detail: detail }));
        firebase.login.should.have.been.calledWith(detail);
        firebase.login.restore();
    });

    it('should call firebase-auth#createUser on "firebase-register"', function () {
        sinon.stub(firebase, 'createUser', function () {
            firebase.fire('user-created');
        });

        var detail = {
            email: testUser.email,
            password: testUser.password
        };

        window.dispatchEvent(new CustomEvent('firebase-register', { detail: detail }));
        firebase.createUser.should.have.been.calledWith(detail.email, detail.password);
        firebase.createUser.restore();
    });

    it('should change page on "firebase-login-success"', function (done) {
        window.addEventListener('firebase-login-success', function () {
            var element = document.querySelector('noootes-app');
            element._selectedPage.should.equal(1);
            done();
        });

        window.dispatchEvent(new CustomEvent('firebase-login-success'));
    });

    it('should call firebase-auth#logout on "firebase-logout"', function () {
        sinon.stub(firebase, 'logout', function () {
            firebase.fire('logout');
        });

        window.dispatchEvent(new CustomEvent('firebase-logout'));
        firebase.logout.should.have.been.called;
        firebase.logout.restore();
    });
});
