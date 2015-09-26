Noootes.Behaviors.GroupBehavior = {
    ///////////////////////
    // Main Group Functions
    ///////////////////////
    /**
     * Callback for #searchGroup.
     *
     * @callback searchGroupCallback
     * @param {String|false} result - Returns group key if group was found, false otherwise.
     */

    /**
     * Searches Firebase for a group located at uid/code.
     *
     * @param {String} uid - UID to query.
     * @param {String} code - Code to query under UID.
     * @param {searchGroupCallback} callback - Function to call on result.
     */
    searchGroup: function (uid, code, callback) {
        var firebase = Noootes.FirebaseRef('groups/access/id');

        firebase.child(uid).child(code).once('value', function (ss) {
            var data = ss.val();
            callback(data ? data : false);
        });
    },

    /**
     * Create a new group under the current logged in user.
     *
     * @param {Object} meta - Metadata for group to be created.
     * @property {String} meta.code - New group's code.
     * @property {String} meta.title - New group's title.
     * @property {String} meta.description - New group's description.
     * @param {Object} access - Access data for new group.
     * @property {String} access.global - Set to 'none', 'read' or 'write'.
     * @property {Any} access.public - Set any value to make group public.
     */
    createGroup: function (meta, access) {
        var user = Noootes.Firebase.User;

        if (user) {
            this.searchGroup(user.uid, meta.code, function (exists) {
                if (exists) {
                    return;
                }

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
            }.bind(this));
        }
    },

    /**
     * Delete group under the current logged in user.
     *
     * @param {String} code - Group code to delete.
     */
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

    /////////////////////////
    // Group Detail Functions
    /////////////////////////
    /**
     * Update metadata for the given group key.
     * Use to only update a specific path without accidentally removing other metadata.
     *
     * @param {String} key - Group key for group to set new metadata.
     * @param {Object} value - Meta data value to set.
     * @property {String} value.code - New group's code.
     * @property {String} value.title - New group's title.
     * @property {String} value.owner - New group's owner.
     * @property {String} value.description - New group's description.
     */
    updateGroupMetadata: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/metadata').child(key);
        firebase.update(value);
    },

    /**
     * Set metadata for the given group key.
     *
     * @param {String} key - Group key for group to set new metadata.
     * @param {Object} value - Meta data value to set.
     * @property {String} value.code - New group's code.
     * @property {String} value.title - New group's title.
     * @property {String} value.owner - New group's owner.
     * @property {String} value.description - New group's description.
     */
    editGroupMetadata: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/metadata').child(key);
        firebase.set(value);
    },

    /**
     * Set global access variable for the given group key.
     *
     * @param {String} key - Group key for group to set new value.
     * @param {String} value - Value to set.
     * @returns {}
     */
    editGroupAccessGlobal: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/access/global').child(key);
        firebase.set(value);
    },

    /**
     * Set human readable path to fetch group key.
     * Will set for the current logged in user.
     *
     * @param {String} code - Code for group.
     * @param {String} value - Group key
     */
    editGroupAccessId: function (code, value) {
        var user = Noootes.Firebase.User;
        var firebase = Noootes.FirebaseRef('groups/access/id').child(user.uid).child(code);
        firebase.set(value);
    },

    /**
     * Set group public visibility.
     *
     * @param {String} key - Group key for group.
     * @param {Any} value - Set to any truthy value to make public.
     */
    editGroupVisibility: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/public').child(key);
        firebase.set(value ? true : null);
    },

    /////////////////
    // User Functions
    /////////////////
    editUserOwned: function (key, value) {
        var user = Noootes.Firebase.User;
        var firebase = Noootes.FirebaseRef('users/personal').child(user.uid).child('owned')
            .child(key);
        firebase.set(value);
    }
};
