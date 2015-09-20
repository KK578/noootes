(function () {
    function reloadComponentStyle(data) {
        var element = data.style;
        var style = Polymer.StyleTransformer.css(data.style, element);

        var styleTag = document.querySelector('style[scope="' + element + '"');
        if (styleTag) {
            style.innerHTML = style;
            console.log(element + 'style updated.');
        }
    }

    window.addEventListener('load', function () {
        var handle = window.setInterval(function () {
            if (window.___browserSync___) {
                window.___browserSync___.socket.on('custom-component-css', reloadComponentStyle);
                clearInterval(handle);
            }
        }, 10000)
    });
})();
