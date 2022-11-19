mainApp.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
    function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        $stateProvider
            .state('sign-in', {
                url         : '/authentication/sign-in',
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
                    bodyClasses: 'verifyAuthentication-page'
                }
            })
            .state('reset-password', {
                url         : '/authentication/reset-password',
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
                url         : '/authentication/sign-up',
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
            })
            .state('multi-steps-sign-up', {
                url         : '/authentication/multi-steps-sign-up',
                templateUrl : 'templates/partials/authentication/multi-steps-sign-up.html',
                controller  : 'multiSignUpController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/multi-steps-sign-up.js'
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
            })
            .state('verify-email', {
                url         : '/authentication/verify-email/:type/:email',
                templateUrl : 'templates/partials/authentication/verify-email.html',
                controller  : 'verifyEmailController',
                params: {
                    type: 'reset',
                    email: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/verify-email.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                  bodyClasses: 'verifyEmail-page'
                }
            })
            .state('change-pass', {
                url         : '/authentication/change-pass',
                templateUrl : 'templates/partials/authentication/change-pass.html',
                controller  : 'changePassController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/change-pass.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'changePass-page'
                }
            })
            .state('panel', {
                url         : '/panel',
                templateUrl : 'templates/partials/panel.html',
                controller  : 'panelController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/panel.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('activate-account', {
                url         : '/authentication/activate-account',
                templateUrl : 'templates/partials/authentication/activate-account.html',
                controller  : 'activateAccountController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/activate-account.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'activateAccount-page'
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
