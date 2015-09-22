chai.should();

describe('<fancy-material>', function () {
    var fancyMaterial;

    before(function () {
        fancyMaterial = document.querySelector('fancy-material');
    });

    it('should place #top-h1 and #top-p in the header', function () {
        var h1 = fancyMaterial.querySelector('#top-h1');
        h1.parentNode.id.should.equal('top');

        var p = fancyMaterial.querySelector('#top-p');
        p.parentNode.id.should.equal('top');
    });

    it('should place #normal-h1 and #more-content in the content', function () {
        var h1 = fancyMaterial.querySelector('#normal-h1');
        h1.parentNode.id.should.equal('content');

        var div = fancyMaterial.querySelector('#more-content');
        div.parentNode.id.should.equal('content');
    });

    it('should place #inner-top in the content', function () {
        var p = fancyMaterial.querySelector('#inner-top');
        p.parentNode.parentNode.id.should.equal('content');
    });
});
