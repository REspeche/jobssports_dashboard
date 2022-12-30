mainApp.directive('footerLogin', function() {

        return {
            restrict: 'E',
            controller:['$scope', 'actionSvc',
              function ($scope, actionSvc) {

                $scope.goToPrivacyPolicy = function() {
        					actionSvc.goToAction(8); // go to privacy policy
                };

                $scope.goToContact = function() {
                  actionSvc.goToAction(9); // go to contact us
                };

                $scope.goToWorkWithUs = function() {
                  actionSvc.goToSite(105, undefined, true); //go to work with us
                };

              }
            ],
            templateUrl: 'templates/directives/partials/footerLogin.html'
        };
    });
