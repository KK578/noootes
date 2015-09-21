(function () {
    function reloadComponentStyle(data) {
        var element = data.element;
        // User Polymer's style scoper to transform the inbound CSS to the element's scope.
        var style = Polymer.StyleTransformer.css(data.style, element);
        // Find the style tag which describes this elements style.
        var styleTag = document.querySelector('style[scope="' + element + '"');

        if (styleTag) {
            // Update style.
            styleTag.innerHTML = style;
            console.log(element + ' style updated.');
        }
    }

    window.addEventListener('load', function () {
        var handle;

        function attachListener() {
            if (window.___browserSync___) {
                // On finding browserSync, attach the listener and cleanup the interval.
                window.___browserSync___.socket.on('custom-component-css', reloadComponentStyle);
                console.log('Component Style updater ready.');
                clearInterval(handle);
            }
        }

        // After the document has loaded, check for browserSync every 10 seconds.
        handle = window.setInterval(attachListener, 10000);
        attachListener();
    });
})();
