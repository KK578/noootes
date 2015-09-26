Noootes.Elements['page-personal'] = Polymer({
    is: 'page-personal',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    //ready: function () {},
    //attached: function () {},

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    behaviors: [
        Noootes.Behaviors.FormBehavior,
        Noootes.Behaviors.GroupBehavior
    ],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'form-create.iron-form-submit': '_validateFormCreate'
    },

    /**
     * https://www.polymer-project.org/1.0/docs/devguide/properties.html
     *
     * Notes:
     *  type {constructor}
     *  value {boolean, number, string, function}
     *  reflectToAttribute {boolean}
     *  readOnly {boolean}
     *  notify {boolean}
     *  computed {string}
     *  observer {string}
     */
    properties: {
        _formCreateOpen: {
            type: Boolean,
            value: false
        },

        _ownedLocation: {
            type: String,
            value: undefined
        },
        _ownedLocationSet: {
            type: Boolean,
            value: false
        }
    },

    /* Functions specific to this element go under here. */
    setOwnedLocation: function () {
        var user = Noootes.Firebase.User;
        this._ownedLocation = Noootes.Firebase.Location + 'users/personal/' + user.uid + '/owned';
        this._ownedLocationSet = true;
    },

    // Form Create
    openFormCreate: function () {
        this._formCreateOpen = true;
    },
    _validateFormCreate: function (event) {
        var form = this.$['form-create'];
        this.resetForm(form, false);

        var detail = event.detail;
        var inputCode = form.querySelector('paper-input[name=code]');

        var validCode = this.validateCode(inputCode);

        if (validCode) {
            this.searchGroup(Noootes.Firebase.User.uid, detail.code, function (key) {
                if (key) {
                    this.handleFormFail(form, 'paper-input[name=code]',
                        'Code "' + detail.code + '" already exists.');
                }
                else {
                    var meta = {
                        code: detail.code,
                        title: detail.title,
                        owner: Noootes.Firebase.User.uid,
                        description: detail.description
                    };
                    var access = {
                        global: detail.global,
                        public: detail.public
                    };

                    this.createGroup(meta, access);

                    this.fire('toast-message', {
                        message: 'Group "' + detail.code + '" created!'
                    });
                    this.resetFormCreate();
                }
            }.bind(this));
        }
    },
    resetFormCreate: function () {
        var form = this.$['form-create'];
        this.resetForm(form, true);
        this._formCreateOpen = !this._formCreateOpen;
    }
});
