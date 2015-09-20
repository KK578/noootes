// Splash Screen Handler
// While splash screen is loading:
//  1) Conditionally import WebComponents.js,
//  2) Load Splash Screen dependencies
//  3) Load App dependencies
//  4) Hide Splash Screen
(function () {
    function loadInitialDependencies() {
        console.log('WebComponents is Ready');
    }

    function checkNativeWebComponents() {
        var native = 'registerElement' in document &&
            'import' in document.createElement('link') &&
            'content' in document.createElement('template');

        if (native) {
            loadInitialDependencies();
        }
        else {
            var webComponentsScript = document.createElement('script');
            webComponentsScript.src = 'bower_components/webcomponentsjs/webcomponents.js';
            webComponentsScript.onload = loadInitialDependencies;
            document.head.appendChild(webComponentsScript);
        }
    }

    checkNativeWebComponents();
})();
