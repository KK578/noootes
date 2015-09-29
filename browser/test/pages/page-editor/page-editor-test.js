chai.should();

describe('<page-editor>', function () {
    it('should display a message if no group is selected');
    it('should change user and group on hashchange');
    it('should display a message if the user doesn\t exist');
    it('should display a message if the group doesn\'t exist');
    it('should display a message if the user isn\'t allowed to write to the group');
    it('should remove messages if group is valid');
});
