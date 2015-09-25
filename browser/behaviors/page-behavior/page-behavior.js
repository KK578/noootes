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
                    'title': 'All Noootes',
                    'element': 'page-groups'
                },
                {
                    'tag': '/personal/',
                    'title': 'My Noootes',
                    'element': 'page-personal'
                },
                {
                    'tag': '/account/',
                    'title': 'Account Settings',
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
