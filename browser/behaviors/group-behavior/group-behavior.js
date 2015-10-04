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
     * @param {String} access -  Set 'none', 'read' or 'write' for public access permissions.
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

                // Add group to public listings if requested.
                this.editGroupAccessibility(key, access);
            }.bind(this));
        }
    },

    editGroup: function (group, meta, access) {
        this.updateGroupMetadata(group, meta);
        this.editGroupAccessibility(group, access);
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

                this.editGroupAccessibility(key, null);
                this.editUserOwned(key, null);
                this.editGroupAccessId(code, null);
                // TODO: Delete notes

                // As security rules depend on checking user's authentication against the
                // group metadata, the metadata must be deleted last.
                this.editGroupMetadata(key, null);
            }.bind(this));
        }
    },

    /////////////////////////
    // Group Detail Functions
    /////////////////////////
    getGroupMetadata: function (key, callback) {
        var firebase = Noootes.FirebaseRef('groups/metadata').child(key);
        firebase.once('value', function (ss) {
            callback(ss.val());
        });
    },

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

    getGroupAccessibility: function (key, callback) {
        var firebase = Noootes.FirebaseRef('groups/access/public').child(key);
        firebase.on('value', function (ss) {
            var data = ss.val();
            callback(data);
        });
    },

    /**
     * Set public accessibility for the given group key.
     *
     * @param {String} key - Group key for group to set new value.
     * @param {String} value - Value to set.
     */
    editGroupAccessibility: function (key, value) {
        var firebase = Noootes.FirebaseRef('groups/access/public').child(key);
        var set;

        switch (value) {
            case 'write':
            case true:
                set = true;
                break;

            case 'read':
            case false:
                set = false;
                break;

            default:
                set = null;
                break;
        }

        firebase.set(set);
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

    //////////////
    // Conversions
    //////////////
    readableGroupAccessibility: function (access) {
        switch (access) {
            case true:
                return 'Read/Write';

            case false:
                return 'Read';

            default:
                return 'None';
        }
    },

    readableGroupRequestStatus: function (uid, collaborator, request) {
        if (Noootes.Firebase.User.uid === uid) {
            return 'Owner';
        }
        else {
            switch (collaborator) {
                case true:
                    return 'Read/Write';

                case false:
                    return 'Read';

                default:
                    return request ? 'Under Request' : 'None';
            }
        }
    },

    /////////////////
    // User Functions
    /////////////////
    /**
     * Add request to join group and add to user's joined groups.
     *
     * @param {String} key - Group key for group.
     * @param {Any} value - Value to set group to. Use null if deleting.
     */
    applyToGroup: function (key, value) {
        var user = Noootes.Firebase.User;
        var firebase = Noootes.FirebaseRef();

        firebase.child('groups/access/public').child(key).once('value', function (ss) {
            var access = ss.val();

            if (access !== null) {
                // Able to automatically apply to group.
                firebase.child('groups/access/members').child(key).child(user.uid).set(access);
            }
            else {
                // Must request for access.
                firebase.child('groups/access/requests').child(key).child(user.uid).set(value);
            }

            firebase.child('users/personal').child(user.uid).child('joined').child(key).set(value);
        });
    },

    checkGroupRequestStatus: function (group, callback) {
        var user = Noootes.Firebase.User;
        var firebase = Noootes.FirebaseRef('groups/access');

        var collaborator;
        var request;

        firebase.child('members').child(group).child(user.uid).on('value', function (ss) {
            collaborator = ss.val();
            callback(collaborator, request);
        });

        firebase.child('requests').child(group).child(user.uid).on('value', function (ss) {
            request = ss.val();
            callback(collaborator, request);
        });
    },

    //////////////////
    // Owner Functions
    //////////////////
    /**
     * Add group key to current user's owned groups list.
     *
     * @param {String} key - Group key for group.
     * @param {Any} value - Value to set group to. Use null if deleting.
     */
    editUserOwned: function (key, value) {
        var user = Noootes.Firebase.User;
        var firebase = Noootes.FirebaseRef('users/personal').child(user.uid).child('owned')
            .child(key);
        firebase.set(value);
    },

    /**
     * Move join request to members.
     *
     * @param {String} key - Group key for group.
     * @param {String} uid - UID to move.
     * @param {Any} value - Value to set collaborator to. Use null if rejecting.
     */
    moveToMembers: function (key, uid, value) {
        var firebase = Noootes.FirebaseRef('groups/access');
        firebase.child('requests').child(key).child(uid).set(null);

        var set;

        switch (value) {
            case 'write':
            case true:
                set = true;
                break;

            case 'read':
            case false:
                set = false;
                break;

            default:
                set = null;
                break;
        }

        firebase.child('members').child(key).child(uid).set(set);
    }
};
