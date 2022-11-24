mainApp.run(['$rootScope', 'authenticationSvc', '$state', 'alertSvc', 'mainSvc', '$location', '$timeout', '$translate', 'settingSvc', 'metaTagsSvc',
    function ($rootScope, authenticationSvc, $state, alertSvc, mainSvc, $location, $timeout, $translate, settingSvc, metaTagsSvc) {
        //init vars
        $rootScope.isDashboard = true;
        $rootScope.isBusy = false;
        $rootScope.viewChangeLanguage = true;

        $rootScope.$on( '$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
          if(toState.access && toState.access.isFree) return; // no need to redirect
          $rootScope.isBusy = true;
          $rootScope.viewChangeLanguage = true;
          // now, redirect only not authenticated
          if(!authenticationSvc.getUserInfo().isLogin) {
              if (authenticationSvc.verifyLogin()) {
                //autentificarse
                let _login = authenticationSvc.login(true);
                if (toState.name != 'create-profile' && _login.isLogin) {
                  if (_login.isProfile == 0) {
                    $rootScope.isBusy = false;
                    e.preventDefault(); // stop current execution
                    $state.go('create-profile'); // go to profile
                  }
                  else {
                    //llama al servicio de alertas
                    alertSvc.getAlerts();
                  }
                }
              }
              else {
                $rootScope.isBusy = false;
                e.preventDefault(); // stop current execution
                authenticationSvc.logout();
                $state.go('sign-in'); // go to login
              }
          }
          else {
            if (toState.name!='create-profile' && $rootScope.userInfo.isProfile == 0) {
              $rootScope.isBusy = false;
              e.preventDefault(); // stop current execution
              $state.go('create-profile'); // go to profile
            }
            else {
              //llama al servicio de alertas si es que nunca lo llamo
              if ($rootScope.alerts && !$rootScope.alerts.pull) alertSvc.getAlerts();
            };
          };
          //llama al servicio de configuracion si es que nunca lo llamo
          if ($rootScope.userInfo && $rootScope.userInfo.isProfile == 1 && (!$rootScope.settings || !$rootScope.settings.pull)) {
            settingSvc.getSettings().then(function () {
              $translate.onReady(function() {
                metaTagsSvc.setDefaultTags({
                  // General SEO
                  'title': $translate.instant('TITLE') + ' - ' + $translate.instant('SUBTITLE') + ' v.' + versionBuild,
                  'version': versionBuild,
                  'dc.language': $rootScope.lang,
                  // Indexing / Spiders
                  'googlebot': 'index, follow',
                  'bingbot': 'index, follow',
                  'robots': 'index, follow'
                });
              });
            });
          }
        });

        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          if (toState.data && angular.isDefined(toState.data.bodyClasses)) {
              $('body').addClass(toState.data.bodyClasses);
              return;
          }
          $rootScope.isBusy = false;
        });

        // is mobile
        $rootScope.isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return ($rootScope.isMobile.Android() || $rootScope.isMobile.BlackBerry() || $rootScope.isMobile.iOS() || $rootScope.isMobile.Opera() || $rootScope.isMobile.Windows());
            }
        };

        //language
        $rootScope.lang = $translate.proposedLanguage() || $translate.use();

        $rootScope.default_float = 'left';
        $rootScope.opposite_float = 'right';

        $rootScope.default_direction = 'ltr';
        $rootScope.opposite_direction = 'rtl';

        $rootScope.$on('$translateChangeSuccess', function (event, data) {
            var language = data.language;

            $rootScope.lang = language;

            $rootScope.default_direction = language === 'es' ? 'rtl' : 'ltr';
            $rootScope.opposite_direction = language === 'es' ? 'ltr' : 'rtl';

            $rootScope.default_float = language === 'es' ? 'right' : 'left';
            $rootScope.opposite_float = language === 'es' ? 'left' : 'right';
        });

    }]);
