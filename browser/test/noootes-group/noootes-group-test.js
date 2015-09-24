chai.should();

describe('<noootes-group>', function () {
    var noootesGroup;

    before(function () {
        noootesGroup = document.querySelector('noootes-group');
    });

    it('should fetch data from firebase on changing group', function (done) {
        noootesGroup.group = '-JzwgEvXhmCq6xVh7Wja';

        var data;
        var handle = window.setInterval(function () {
            data = noootesGroup._data;

            if (data) {
                data.code.should.equal('WCT');
                data.title.should.equal('Web Component Testing');
                data.owner.should.equal('bdcdc03c-01b8-4080-b77c-40df9b64067b');

                window.clearInterval(handle);
                done();
            }
        }, 500);
    });
});
