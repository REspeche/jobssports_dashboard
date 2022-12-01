mainApp.directive('logoApp', function() {

        return {
            restrict: 'E',
            scope: {
                size: '@',
                sizeLg: '@'
            },
            controller:['$scope',
              function ($scope) {
                $scope.class = '';
                if ($scope.size) $scope.class += ' h-'+$scope.size+'px';
                if ($scope.sizeLg) $scope.class += ' h-lg-'+$scope.sizeLg+'px';
              }
            ],
            templateUrl: 'templates/directives/logoapp/logoapp.html'
        };
    });
