Noootes.Behaviors.FirebaseBehavior = {
    /**
     * Bind function to be called after a successful login.
     * @param {Function} callback - Function to be called on login.
     */
    bindToLogin: function (callback) {
        window.addEventListener('firebase-login-success', callback.bind(this));
    },

    /**
     * Bind function to be called after a successful logout.
     * @param {Function} callback - Function to be called on logout.
     */
    bindToLogout: function (callback) {
        window.addEventListener('firebase-logout-success', callback.bind(this));
    },

    /**
     * Get username with known UID.
     * @param {String} uid - UID of user to fetch.
     * @param {Function (err, username)} callback - Function to be called when username is found.
     */
    getUsername: function (uid, callback) {
        if (Noootes.Usernames.uid[uid]) {
            callback(null, Noootes.Usernames.uid[uid]);
        }
        else {
            var firebase = Noootes.FirebaseRef('users/usernames/uid/' + uid);

            firebase.once('value', function (ss) {
                var name = ss.val();

                if (name) {
                    Noootes.Usernames.names[name] = uid;
                    Noootes.Usernames.uid[uid] = name;
                    callback(null, name);
                }
                else {
                    callback(new Error('Invalid UID.'));
                }
            });
        }
    },

    /**
     * Get UID with known username.
     * @param {String} name - Username of user to fetch.
     * @param {Function (err, uid)} callback - Function to be called when uid is found.
     */
    getUid: function (name, callback) {
        if (Noootes.Usernames.names[name]) {
            callback(null, Noootes.Usernames.names[name]);
        }
        else {
            var firebase = Noootes.FirebaseRef('users/usernames/names/' + name);

            firebase.once('value', function (ss) {
                var uid = ss.val();

                if (uid) {
                    Noootes.Usernames.names[name] = uid;
                    Noootes.Usernames.uid[uid] = name;
                    callback(null, uid);
                }
                else {
                    callback(new Error('Invalid Name.'));
                }
            });
        }
    }
};
