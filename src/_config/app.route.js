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
                templateUrl : 'templates/partials/authentication/transition-screen/verify-authentication.html',
                controller  : 'verifyAuthenticationController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/transition-screen/verify-authentication.js'
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
            .state('create-profile', {
                url         : '/authentication/create-profile/:type',
                templateUrl : 'templates/partials/authentication/create-profile.html',
                controller  : 'createProfileController',
                params: {
                    type: ''
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/create-profile.js'
                            ]
                        }]);
                    }]
                },
                data: {
                  bodyClasses: 'createProfile-page'
                }
            })
            .state('select-profile', {
                url         : '/authentication/select-profile',
                templateUrl : 'templates/partials/authentication/select-profile.html',
                controller  : 'selectProfileController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/select-profile.js'
                            ]
                        }]);
                    }]
                },
                data: {
                  bodyClasses: 'selectProfile-page'
                }
            })
            .state('verify-email', {
                url         : '/authentication/verify-email/:type/:email',
                templateUrl : 'templates/partials/authentication/info-screen/verify-email.html',
                controller  : 'verifyEmailController',
                params: {
                    type: 'reset',
                    email: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/info-screen/verify-email.js'
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
            .state('welcome', {
                url         : '/authentication/welcome',
                templateUrl : 'templates/partials/authentication/info-screen/welcome.html',
                controller  : 'welcomeController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/info-screen/welcome.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'welcome-page'
                }
            })
            .state('redirect-external', {
                url         : '/redirect-external/:page',
                templateUrl : 'templates/partials/authentication/transition-screen/redirect-external.html',
                controller  : 'redirectExternalController',
                params: {
                    page: null,
                    backurl: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/authentication/transition-screen/redirect-external.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'load-screen'
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
