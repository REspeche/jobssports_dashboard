mainApp.directive('btnSubmit', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            btnClass: '@',
            label: '@',
            type: '@'
        },
        controller: ['$scope', function ($scope) {
          if (!$scope.type) $scope.type = 'submit';
        }],
        templateUrl: 'templates/directives/btnsubmit/btnsubmit.html'
    };
}]);
