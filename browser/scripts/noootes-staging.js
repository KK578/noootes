var Noootes = Noootes || {
    Behaviors: {},
    Elements: {},
    Firebase: {
        Location: 'https://noootes-staging.firebaseio.com/',
        User: {}
    },
    FirebaseRef: function (location) {
        return new Firebase(this.Firebase.Location + location);
    },
    Usernames: {
        names: {},
        uid: {}
    }
};
