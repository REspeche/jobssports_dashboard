angular.module('mainApp').controller('activateAccountController',
['$scope', 'actionSvc', 'mainSvc', '$timeout', 'authenticationSvc',
    function ($scope, actionSvc, mainSvc, $timeout, authenticationSvc) {
      $scope.formData = {
        email: '',
        hash: ''
      };
      $scope.error = false;

      $scope.lodPartial = function() {
        $scope.formData.email = getQueryStringValue('email','');
        $scope.formData.hash = getQueryStringValue('hash','');

        if ($scope.formData.email && $scope.formData.hash) {
          mainSvc.callService({
              url: 'auth/activateaccount',
              params: {
                 'email': $scope.formData.email,
                 'hash': $scope.formData.hash
              },
              secured: false
          }).then(function (response) {
            if (response.token) {
              authenticationSvc.saveLogin(response);
              $scope.error = false;
            }
            else {
              $scope.error = true;
              mainSvc.showAlertByCode(305);
            };
          }).catch(function (e) {
            $scope.error = true;
          });
        }
        else {
          $scope.error = true;
        };

        //counter
        var updateCounter = function() {
          if ($scope.timeRefresh>0) {
            $scope.timeRefresh--;
            $timeout(updateCounter, 1000);
          }
          else {
            $scope.goToHome();
          }
        };
        updateCounter();
      }

      $scope.goToHome = function() {
        if ($scope.error) actionSvc.goToAction(2); //login
        else actionSvc.goToAction(1); //home
      }
    }]);
