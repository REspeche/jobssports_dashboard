angular.module('mainApp').controller('homeController',
['$scope', '$rootScope', 'mainSvc', 'authenticationSvc', 'actionSvc', 'BASE_URL',
    function ($scope, $rootScope, mainSvc, authenticationSvc, actionSvc, BASE_URL) {

      $scope.logOut = function() {
        if ($rootScope.userInfo.isLogin) {
          mainSvc.callService({
              url: 'auth/logout'
          }).then(function (response) {
            authenticationSvc.logout();
            actionSvc.goToExternalSite(BASE_URL.dashboard, false); // go to dashboard
          });
        }
        else {
          actionSvc.goToExternalSite(BASE_URL.dashboard, false); // go to dashboard
        };
      };

      $scope.goToOldSite = function() {
        actionSvc.goToExternalSite('https://old.jobs-sports.com', false); // go to old site
      };

    }
]);
