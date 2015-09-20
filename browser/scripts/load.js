// Splash Screen Handler
// While splash screen is loading:
//  1) Conditionally import WebComponents.js,
//  2) Load Splash Screen dependencies
//  3) Load App dependencies
//  4) Hide Splash Screen
(function () {
    var initialDependencies = [
        'bower_components/font-roboto/roboto.html',
        'bower_components/paper-material/paper-material.html',
        'bower_components/paper-spinner/paper-spinner.html'
    ];

    function startSplashScreen() {
        console.log('Initial dependencies loaded');
    }

    function loadInitialDependencies() {
        var loadedDependencies = 0;

        function loaded() {
            if (++loadedDependencies >= initialDependencies.length) {
                window.setTimeout(startSplashScreen, 0);
            }
        }

        for (var i = 0; i < initialDependencies.length; i++) {
            var elementImport = document.createElement('link');
            elementImport.rel = 'import';
            elementImport.href = initialDependencies[i];
            elementImport.onload = loaded;

            document.head.appendChild(elementImport);
        }
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
