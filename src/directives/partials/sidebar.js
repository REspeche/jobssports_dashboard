mainApp.directive('sidebarPartial', function() {

        return {
            restrict: 'E',
            controller:['$scope',
              function ($scope) {
                $scope.actionPostRender = function() {
                  loadKTComponents();
                };
              }
            ],
            templateUrl: 'templates/directives/partials/sidebar.html'
        };
    });
