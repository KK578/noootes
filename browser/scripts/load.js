// Splash Screen Handler
// While splash screen is loading:
//  1) Conditionally import WebComponents.js,
//  2) Load Splash Screen dependencies
//  3) Load App dependencies
//  4) Hide Splash Screen
(function () {
    var loadingDelay = 100;
    var finishDelay = 500;

    var initialDependencies = [
        'bower_components/font-roboto/roboto.html',
        'bower_components/paper-material/paper-material.html',
        'bower_components/paper-spinner/paper-spinner.html'
    ];

    function endSplashScreen() {
        document.getElementById('splash-screen').runAnimation();
    }

    function loadAppDependencies() {
        Polymer.Base.importHref('elements.html', function () {
            var loaders = document.querySelectorAll('.loading');
            for (var i = 0; i < loaders.length; i++) {
                loaders[i].classList.remove('loading');
            }

            // HACK: Some browsers don't appear to like multiple animations running on the same
            // element at the same time. So run async to allow loading class styles to be
            // removed before seaming the card into the background.
            window.setTimeout(function () {
                // End splash-screen animation
                document.getElementById('splash-spinner').active = false;
                document.getElementById('splash-card').elevation = 0;
            }, finishDelay / 10);

            window.setTimeout(endSplashScreen, finishDelay);
        });
    }

    function startSplashScreen() {
        // Scale in paper-spinner and animate paper-material
        document.getElementById('splash-spinner').classList.remove('loading');
        document.getElementById('splash-card').elevation = 5;

        window.setTimeout(loadAppDependencies, loadingDelay);
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
            webComponentsScript.src = 'bower_components/webcomponentsjs/webcomponents-lite.js';
            webComponentsScript.onload = loadInitialDependencies;
            document.head.appendChild(webComponentsScript);
        }
    }

    checkNativeWebComponents();
})();
