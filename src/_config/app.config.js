mainApp.config(['$cookiesProvider', 'COOKIES',
  function($cookiesProvider, COOKIES) {
    // Set $cookies defaults
    $cookiesProvider.defaults.domain = COOKIES.domain;
  }
]);

mainApp.config(['$qProvider', '$locationProvider',
  function($qProvider, $locationProvider) {
    $qProvider.errorOnUnhandledRejections(false);

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
  }
]);

mainApp.config(function(IdleProvider, KeepaliveProvider) {
    IdleProvider.idle(300); //5 min
    IdleProvider.timeout(30);
    KeepaliveProvider.interval(10);
});

mainApp.config(['$translateProvider',
  function($translateProvider) {
    $translateProvider
      .registerAvailableLanguageKeys(['es', 'en'], {
        'es_*': 'es',
        'en_*': 'en'
      })
      .useStaticFilesLoader({
        files: [
          {
              prefix: '/translations/locate-',
              suffix: '.json'
          }
        ]
      })
      .preferredLanguage('en')
      .use('en')
      .useLocalStorage()
      .useSanitizeValueStrategy('sanitizeParameters');
  }
]);
