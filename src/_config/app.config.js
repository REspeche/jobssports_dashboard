mainApp.config(['$provide', 'BASE_URL',
  function ($provide, BASE_URL) {
    $provide.decorator('$state', ['$delegate', '$window',
        function ($delegate, $window) {
            var extended = {
                goNewTab: function (stateName, params) {
                    $window.open(
                        $delegate.href(stateName, params, { absolute: true }), '_blank');
                },
                goSite: function (stateName, params, newTab) {
                    var strParams = '';
                    angular.forEach(params, function(item, key){
                      strParams+='/'+item;
                    });
                    var url = stateName+strParams;
                    $window.open(url, (newTab)?'_blank':'_self');
                }
            };
            angular.extend($delegate, extended);
            return $delegate;
        }]);
  }]);

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
