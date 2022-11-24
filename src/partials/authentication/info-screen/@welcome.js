angular.module('mainApp').controller('welcomeController',
['$scope', 'actionSvc', 'mainSvc', '$timeout', 'authenticationSvc',
    function ($scope, actionSvc, mainSvc, $timeout, authenticationSvc) {
      $scope.formData = {
        email: '',
        hash: ''
      };
      $scope.error = false;
      $scope.timeRefresh = 10;

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
            $scope.goToProfile();
          }
        };
        if (!$scope.error) updateCounter();
      }

      $scope.goToProfile = function() {
        actionSvc.goToAction(6, {
          type: 'player',
          step: '1'
        }); //profile
      }
    }]);
