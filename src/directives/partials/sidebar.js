mainApp.directive('sidebarPartial', function() {

        return {
            restrict: 'E',
            controller:['$scope', 'actionSvc', '$state',
              function ($scope, actionSvc, $state) {
                $scope.actionPostRender = function() {
                  loadKTComponents();
                };

                $scope.goToHome = function() {
                  actionSvc.goToAction(1);
                };
              }
            ],
            templateUrl: 'templates/directives/partials/sidebar.html'
        };
    });
