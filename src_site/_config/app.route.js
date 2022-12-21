mainApp.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
    function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        $stateProvider
            .state('home', {
                url         : '/',
                templateUrl : 'templates/partials/home.html',
                controller  : 'homeController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/home.js'
                            ]
                        }]);
                    }]
                },
                data: {
                  bodyClasses: 'home-page'
                }
            })
            .state('redirect-external', {
                url         : '/redirect-external/:page',
                templateUrl : 'templates/partials/transition-screen/redirect-external.html',
                controller  : 'redirectExternalController',
                params: {
                    page: null,
                    backurl: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/transition-screen/redirect-external.js'
                            ]
                        }]);
                    }]
                },
                data: {
                    bodyClasses: 'load-screen'
                }
            });

        $urlRouterProvider.otherwise('/'); //page by default

        $ocLazyLoadProvider.config({
            name: 'mainApp',
            cssFilesInsertBefore: 'ng_load_plugins_before',
            debug: true,
            events: true,
            loadedModules:['MyApp']
        });
    }]);
