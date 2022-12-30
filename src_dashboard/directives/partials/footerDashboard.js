mainApp.directive('footerDashboard', function() {

        return {
            restrict: 'E',
            controller:['$scope', 'actionSvc',
              function ($scope, actionSvc) {

                $scope.goToPrivacyPolicy = function() {
        					actionSvc.goToSite(104,undefined,false); //go to privacy policy
                };

              }
            ],
            templateUrl: 'templates/directives/partials/footerDashboard.html'
        };
    });
