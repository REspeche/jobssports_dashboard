mainApp.directive('footerDashboard', function() {

        return {
            restrict: 'E',
            controller:['$scope', 'actionSvc',
              function ($scope, actionSvc) {

                $scope.goToPrivacyPolicy = function() {
        					actionSvc.goToSite(101,undefined,false);
                };

              }
            ],
            templateUrl: 'templates/directives/partials/footerDashboard.html'
        };
    });
