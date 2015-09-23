Noootes.Behaviors.FormBehavior = {
    /**
     * Checks if the input element contains a valid email value.
     * This is checked by ensuring that it at least consists of a valid username,
     * contains '@' and a valid domain (must end in '.' followed by at least 2 characters.
     *
     * @param {HTMLInputElement} input - Input element to be tested.
     * @returns {Boolean} Input element value is a valid email.
     */
    validateEmail: function (input) {
        var pattern = /.+@.+\...+/;
        var match = input.value.match(pattern);

        if (!match) {
            input.errorMessage = 'Please enter a valid email.';
            input.invalid = true;
        }

        return match;
    },

    /**
     * Checks if the input element contains a valid username.
     * This is checked by ensuring it does not contain any characters that prevent it from being
     * used as a firebase key or in a url.
     *
     * @param {HTMLInputElement} input - Input element to be tested.
     * @returns {Boolean} Input element value is a valid username.
     */
    validateUsername: function (input) {
        var pattern = /[a-zA-Z0-9]*/;
        var username = input.value;
        var match = username.match(pattern);
        match = username === match[0];

        if (!match) {
            input.errorMessage = 'Alphanumeric characters only.';
            input.invalid = true;
        }

        return match;
    },

    /**
     * Checks if the input element contains a username that is not already taken.
     *
     * @param {HTMLInputElement} input - Input element to be tested.
     * @param {Function} callback - Function to be called if username is available.
     */
    validateUsernameAvailable: function (input, callback) {
        var username = input.value;
        var location = Noootes.Firebase.Location + 'users/usernames/' + username;
        var firebase = new Firebase(location);

        firebase.once('value', function (ss) {
            if (ss.val()) {
                input.errorMessage = 'That username is already taken.';
                input.invalid = true;
            }
            else {
                callback();
            }
        });
    },

    /**
     * Checks if input element and confirmInput element have matching values.
     *
     * @param {HTMLInputElement} input - Input element to match.
     * @param {HTMLInputElement} confirmInput - Confirmation element to match input.
     * @returns {Boolean} Inputs are equal.
     */
    validateMatch: function (input, confirmInput) {
        var match = input.value === confirmInput.value;

        if (!match) {
            input.errorMessage = 'The values did not match.';
            input.invalid = true;

            confirmInput.errorMessage = 'The values did not match.';
            confirmInput.invalid = true;
        }

        return match;
    },

    /**
     * Checks if input element matches the current logged in user.
     *
     * @param {HTMLInputElement} input - Input element to be tested.
     * @returns {Boolean} Input value matches current user.
     */
    validateUser: function (input) {
        var match = input.value === Noootes.Firebase.User.password.email;

        if (!match) {
            input.errorMessage = 'That isn\'t your email!';
            input.invalid = true;
        }

        return match;
    },

    /**
     * Finds the input element's corresponding form and submit.
     * Attach this function to 'tap' or 'keydown' listener input elements that should submit the
     * form when tapped or pressing the enter key.     *
     *
     * @param {} event - Event fired by event.
     */
    submitForm: function (event) {
        switch (event.type) {
            case 'tap':
                break;

            case 'keydown':
                if (event.keyCode === 13) {
                    break;
                }
                return;

            default:
                return;
        }

        var form = event.target;
        // Proceed up the DOM Tree until form element is found.
        while (!form.submit && form !== document) {
            form = form.parentNode;
        }

        if (form !== document) {
            form.submit();
        }
        else {
            throw new Error('Form not found.');
        }
    },

    /**
     * Reset form error states for paper-input elements.
     * If clear is true, value will also be emptied.
     *
     * @param {HTMLElement} form - Form with paper-inputs to be reset.
     * @param {Boolean} clear - If true, paper-input value will also be emptied.
     */
    resetForm: function (form, clear) {
        var inputs = form.querySelectorAll('paper-input')

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            input.errorMessage = '';
            input.invalid = false;

            if (clear) {
                input.value = '';
            }
        }
    },

    /**
     * Set error message on the selected input in the form.
     * @param {HTMLElement} form - Form to select element from.
     * @param {String} selector - CSS Selector string for input element which has errored.
     * @param {String} message - Error message to set on the input.
     */
    handleFormFail: function (form, selector, message) {
        var input = form.querySelector(selector);
        input.errorMessage = message;
        input.invalid = true;
    }
};
