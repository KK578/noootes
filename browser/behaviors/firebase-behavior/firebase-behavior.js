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
     * @param {Function (username)} callback - Function to be called when username is found.
     */
    getUsername: function (uid, callback) {
        if (Noootes.Usernames.uid[uid]) {
            callback(Noootes.Usernames.uid[uid]);
        }
        else {
            var location = Noootes.Firebase.Location + 'users/usernames/uid/' + uid;
            var firebase = new Firebase(location);

            firebase.once('value', function (ss) {
                var name = ss.val();

                Noootes.Usernames.names[name] = uid;
                Noootes.Usernames.uid[uid] = name;
                callback(name);
            });
        }
    },

    /**
     * Get UID with known username.
     * @param {String} name - Username of user to fetch.
     * @param {Function (uid)} callback - Function to be called when uid is found.
     */
    getUid: function (name, callback) {
        if (Noootes.Usernames.names[name]) {
            callback(Noootes.Usernames.names[name]);
        }
        else {
            var location = Noootes.Firebase.Location + 'users/usernames/names/' + name;
            var firebase = new Firebase(location);

            firebase.once('value', function (ss) {
                var uid = ss.val();

                Noootes.Usernames.names[name] = uid;
                Noootes.Usernames.uid[uid] = name;
                callback(uid);
            })
        }
    }
};
