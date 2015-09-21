Noootes.Behaviors.FirebaseBehavior = {
    bindToLogin: function (callback) {
        window.addEventListener('firebase-login-success', callback.bind(this));
    },
    bindToLogout: function (callback) {
        window.addEventListener('firebase-logout-success', callback.bind(this));
    }
};
