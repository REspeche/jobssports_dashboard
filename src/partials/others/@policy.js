angular.module('mainApp').controller('policyController',
['$scope', 'actionSvc',
    function ($scope, actionSvc) {

      $scope.loadPartial = function() {

      };

      $scope.goToHome = function() {
        actionSvc.goToAction(0); // go to root
      };

    }
]);
