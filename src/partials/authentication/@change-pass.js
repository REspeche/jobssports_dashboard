angular.module('mainApp').controller('changePassController',
['$scope', 'mainSvc', 'authenticationSvc', 'actionSvc',
    function ($scope, mainSvc, authenticationSvc, actionSvc) {
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
        };
      }

      $scope.submit = function() {
        //Validations
        if (!$scope.formData.password || !$scope.formData.passwordR) {
          mainSvc.showAlertByCode(201);
          return false;
        };
        if ($scope.formData.password != $scope.formData.passwordR) {
          mainSvc.showAlertByCode(203);
          return false;
        };
        mainSvc.callService({
            url: 'auth/changepass',
            params: {
               'email': $scope.formData.email,
               'hash': $scope.formData.hash,
               'password': $scope.formData.password
            },
            secured: false
        }).then(function (response) {
          if (response.token) {
            authenticationSvc.saveLogin({
              isLogin       : true,
              id            : response.id,
              email         : response.email,
              token         : response.token,
              type          : response.type
            });
            if (authenticationSvc.login().isLogin) {
              mainSvc.showAlertByCode(2);
              actionSvc.goToExternal(1); //home
            }
          }
        });
      }

    }
]);
