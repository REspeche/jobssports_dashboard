mainApp.directive('btnSubscription', function() {

        return {
            restrict: 'E',
            controller:['$scope', '$rootScope', 'mainSvc',
              function ($scope, $rootScope, mainSvc) {
                $scope.billingPlans = {};
                $scope.lastPlan = true;
                $scope.selectedPlan = 1;

                mainSvc.getJson('/templates/partials/billingPlans.json').then(function (data) {
                  $scope.billingPlans = angular.copy(data);
                  $scope.lastPlan = (($scope.billingPlans[$rootScope.userInfo.typeStr].length)>$rootScope.userInfo.subscription)?false:true;
                  $scope.selectedPlan = ($scope.lastPlan)?1:$rootScope.userInfo.subscription+1;
                });

                $scope.selectPlan = function(val) {
                  $scope.selectedPlan = parseInt(val);
                };

                $scope.upgradePlan = function() {
                  mainSvc.showAlertByCode(3);
                };
              }
            ],
            templateUrl: 'templates/directives/btnsubscription/btnsubscription.html'
        };
    });
