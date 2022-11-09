mainApp.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
    function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        $stateProvider
            .state('sign-in', {
                url         : '/sign-in',
                templateUrl : 'templates/partials/authentication/sign-in.html',
                controller  : 'signInController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/sign-in.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                  bodyClasses: 'signIn-page'
                }
            })
            .state('verify-authentication', {
                url         : '/verify-authentication',
                templateUrl : 'templates/partials/authentication/verify-authentication.html',
                controller  : 'verifyAuthenticationController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/verify-authentication.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'loadScreen'
                }
            })
            .state('reset-password', {
                url         : '/reset-password',
                templateUrl : 'templates/partials/authentication/reset-password.html',
                controller  : 'resetPasswordController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/reset-password.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                  bodyClasses: 'resetPassword-page'
                }
            })
            .state('sign-up', {
                url         : '/sign-up',
                templateUrl : 'templates/partials/authentication/sign-up.html',
                controller  : 'signUpController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/sign-up.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                  bodyClasses: 'signUp-page'
                }
            });

        $urlRouterProvider.otherwise('/verify-authentication'); //page by default

        $ocLazyLoadProvider.config({
            name: 'mainApp',
            cssFilesInsertBefore: 'ng_load_plugins_before',
            debug: true,
            events: true,
            loadedModules:['MyApp']
        });
    }]);
