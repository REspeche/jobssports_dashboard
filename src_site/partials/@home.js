angular.module('mainApp').controller('homeController',
['$scope', '$rootScope', 'mainSvc', 'authenticationSvc', 'actionSvc', 'BASE_URL',
    function ($scope, $rootScope, mainSvc, authenticationSvc, actionSvc, BASE_URL) {

      $scope.logOut = function() {
        if ($rootScope.userInfo.isLogin) {
          mainSvc.callService({
              url: 'auth/logout'
          }).then(function (response) {
            authenticationSvc.logout();
            actionSvc.goToSite(104, {}, false); // go to dashboard
          });
        }
        else {
          actionSvc.goToSite(104, {}, false); // go to dashboard
        };
      };

      $scope.goToOldSite = function() {
        actionSvc.goToSite(103, {}, false); // go to old site
      };

    }
]);
