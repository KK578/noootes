var Noootes = Noootes || {
    Behaviors: {},
    Elements: {},
    Firebase: {
        Location: 'https://noootes-staging.firebaseio.com/',
        User: {}
    },
    FirebaseRef: function (location) {
        var firebase = new Firebase(this.Firebase.Location);

        if (location) {
            firebase = firebase.child(location);
        }

        return firebase;
    },
    Usernames: {
        names: {},
        uid: {}
    }
};
