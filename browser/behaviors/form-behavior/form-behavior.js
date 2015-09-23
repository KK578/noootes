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
        var match = pattern.test(input.value);

        if (!match) {
            input.errorMessage = 'Please enter a valid email.';
            input.invalid = true;
        }

        return match;
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
    }
};
