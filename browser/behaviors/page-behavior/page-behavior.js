Noootes.Behaviors.PageBehavior = {
    properties: {
        pages: {
            type: Object,
            value: [
                {
                    'tag': '/home/',
                    'title': 'Home',
                    'element': 'page-home'
                },
                {
                    'tag': '/groups/',
                    'title': 'Groups',
                    'element': 'page-groups'
                },
                {
                    'tag': '/account/',
                    'title': 'Manage Account',
                    'element': 'page-account'
                },
                {
                    'tag': '/about/',
                    'title': 'About Noootes',
                    'element': 'page-about'
                }
            ],
            readOnly: true
        }
    }
};
