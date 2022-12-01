angular.module('mainApp').controller('accountOverviewController',
['$scope', '$rootScope', 'BASE_URL', 'mainSvc',
    function ($scope, $rootScope, BASE_URL, mainSvc) {
      $scope.path = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=profile&file=';
      $scope.formData = undefined;
      $scope.loadForm = false;

      $scope.loadPartial = function() {
        mainSvc.callService({
          url: 'profile/getProfile',
          params: {
              type: $rootScope.userInfo.type
          },
          secured: true
        }).then(function (response) {
          $scope.formData = angular.copy(response);
          $scope.formData.dateBornStr = UnixTimeStampToDate($scope.formData.dateBorn, false);
          $scope.loadForm = true;
        });
      };

    }
]);
