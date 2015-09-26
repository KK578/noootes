Noootes.Behaviors.GroupBehavior = {
    searchGroup: function (uid, code, callback) {
        var firebase = Noootes.FirebaseRef('groups/access/id');

        firebase.child(uid).child(code).once('value', function (ss) {
            var data = ss.val();
            callback(data ? data : false);
        });
    },

    createGroup: function (meta, access) {
        var user = Noootes.Firebase.User;

        if (user) {
            var firebase = Noootes.FirebaseRef();
            var key = firebase.push().key();

            // Add group to user's owned groups.
            this.editUserOwned(key, true);
            // Add public group metadata.
            // Ensure that owner matches current user uid.
            meta.owner = user.uid;
            this.editGroupMetadata(key, meta);
            // Add group identifier (User/Code)
            this.editGroupAccessId(meta.code, key);
            // Add group's global access permissions.
            this.editGroupAccessGlobal(key, access.global);

            // Add group to public listings if requested.
            this.editGroupVisibility(key, access.public);
        }
    },

    deleteGroup: function (code) {
        var user = Noootes.Firebase.User;

        if (user) {
            this.searchGroup(user.uid, code, function (key) {
                if (!key) {
                    return;
                }

                this.editGroupAccessGlobal(key, null);
                this.editGroupVisibility(key, null);
                this.editUserOwned(key, null);
                this.editGroupAccessId(code, null);

                // As security rules depend on checking user's authentication against the
                // group metadata, the metadata must be deleted last.
                this.editGroupMetadata(key, null);
            }.bind(this));
        }
    },

    editGroupMetadata: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/metadata').child(key);
        firebase.set(value);
    },

    editGroupAccessGlobal: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/access/global').child(key);
        firebase.set(value);
    },

    editGroupAccessId: function (code, value) {
        var user = Noootes.Firebase.User;
        var firebase = Noootes.FirebaseRef('groups/access/id').child(user.uid).child(code);
        firebase.set(value);
    },

    editGroupVisibility: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/public').child(key);
        firebase.set(value ? value : null);
    },

    // User Related
    editUserOwned: function (key, value) {
        var user = Noootes.Firebase.User;
        var firebase = Noootes.FirebaseRef('users/personal').child(user.uid).child('owned')
            .child(key);
        firebase.set(value);
    }
};
