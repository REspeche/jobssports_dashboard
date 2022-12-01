angular.module('mainApp').controller('panelController',
['$scope', 'mainSvc', 'authenticationSvc', 'actionSvc', '$translate', 'BASE_URL',
    function ($scope, mainSvc, authenticationSvc, actionSvc, $translate, BASE_URL) {
      $scope.path = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=profile&file=';

      $scope.loadPartial = function() {
        KTComponents.init();
        KTApp.initPageLoader();
        KTUtil.onDOMContentLoaded((function() {
            KTAppLayoutBuilder.init();
            KTLayoutSearch.init();
            KTThemeModeUser.init();
            KTThemeMode.init();
            KTAppSidebar.init();
            KTLayoutToolbar.init();
        }));
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
]);
