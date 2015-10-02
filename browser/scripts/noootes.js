var Noootes = {};

(function () {
    var firebaseLocation = 'https://noootes.firebaseio.com/';
    var firebase;

    Noootes = {
        Behaviors: {},
        Elements: {},
        Firebase: {
            Location: firebaseLocation,
            User: {}
        },
        FirebaseRef: function (location) {
            return location ? firebase.child(location) : firebase;
        },
        Usernames: {
            names: {},
            uid: {}
        }
    };

    var handle = window.setInterval(function () {
        if (window.Firebase) {
            firebase = new Firebase(firebaseLocation);
            window.clearInterval(handle);
        }
    }, 1);
})();
