Noootes.Behaviors.GroupBehavior = {
    checkGroupExists: function (uid, code, callback) {
        var firebase = Noootes.FirebaseRef('groups/access/id');

        firebase.child(uid).child(code).once('value', function (ss) {
            callback(!ss.val());
        });
    },

    createGroup: function (meta, access) {
        var user = Noootes.Firebase.User;

        if (user) {
            var firebase = Noootes.FirebaseRef();
            var key = firebase.push().key();

            // Add group to user's owned groups.
            firebase.child('users/personal').child(user.uid).child('owned').child(key).set(true);
            // Add public group metadata.
            // Ensure that owner matches current user uid.
            meta.owner = user.uid;
            this.editGroupMetadata(key, meta);
            // Add group identifier (User/Code)
            firebase.child('groups/access/id').child(user.uid).child(meta.code).set(key);
            // Add group's global access permissions.
            this.editGroupAccessGlobal(key, access.global);

            // Add group to public listings if requested.
            this.editGroupVisibility(key, access.public);
        }
    },

    editGroupMetadata: function (key, value) {
        var firebase = Noootes.FirebaseRef().child('groups/metadata').child(key);
        firebase.set(value);
    },

    editGroupAccessGlobal: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/access/global').child(key);
        firebase.set(value);
    },

    editGroupVisibility: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/public/').child(key);
        firebase.set(value);
    }
};
