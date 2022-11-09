angular.module('mainApp').controller('resetPasswordController',
['$scope', 'mainSvc', 'authenticationSvc',
    function ($scope, mainSvc, authenticationSvc) {
      $scope.formData = {
        email: '',
        hash: '',
        password: '',
        passwordR: ''
      };

      $scope.loadPartial = function() {
        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToExternal(1); //go to home
          }
        }
        else {
          $scope.formData.email = getQueryStringValue('email','');
          $scope.formData.hash = getQueryStringValue('hash','');
        }
      }

      $scope.submit = function() {
        if (!$scope.formData.email) {
          mainSvc.showAlertByCode(201);
          return false;
        }
      }
    }
]);
