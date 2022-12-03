mainApp.directive('headerPartial', function() {

        return {
            restrict: 'E',
            controller:['$scope', 'actionSvc', 'BASE_URL', 'mainSvc', 'authenticationSvc', '$translate',
              function ($scope, actionSvc, BASE_URL, mainSvc, authenticationSvc, $translate) {
                $scope.path = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=profile&file=';

                $scope.actionPostRender = function() {
                  loadKTComponents();
                };

                $scope.goToMyProfile = function() {
                  actionSvc.goToAction(8); // go to my profile / overview
                };

                $scope.signOut = function() {
                  mainSvc.showModal(
                    {
                      text: $translate.instant('MSG_CONFIRM_LOGOUT'),
                      confirmButtonText: $translate.instant('BTN_YES'),
                      cancelButtonText: $translate.instant('BTN_NO'),
                      showCancelButton: true,
                      focusConfirm: true
                    },
                    function() {
                      mainSvc.callService({
                          url: 'auth/logout'
                      }).then(function (response) {
                        authenticationSvc.logout();
                        actionSvc.goToExternal(2); // go to login
                      });
                    }
                  );
                };
              }
            ],
            templateUrl: 'templates/directives/partials/header.html'
        };
    });
