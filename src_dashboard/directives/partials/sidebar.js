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

                $scope.goToPrivacyPolicy = function() {
        					actionSvc.goToAction(8.1); //go to privacy policy
                };

                $scope.goToContactUs = function() {
                  actionSvc.goToAction(9.1); //go to contact us
                };

                $scope.goToOffers = function() {
                  actionSvc.goToAction(10); //go to club offers
                };

                $scope.goToPlayerProfile = function() {
                  actionSvc.goToAction(11); //go to player profile
                };
              }
            ],
            templateUrl: 'templates/directives/partials/sidebar.html'
        };
    });
