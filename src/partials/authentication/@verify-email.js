angular.module('mainApp').controller('verifyEmailController',
['$scope', '$interval', 'mainSvc', 'actionSvc', '$stateParams',
    function ($scope, $interval, mainSvc, actionSvc, $stateParams) {
      $scope.disableLink = false;
      $scope.formData = {
        email: ''
      }

      $scope.loadPartial = function() {
        //load email
        if ($stateParams.email) {
          $scope.formData.email = $stateParams.email;
        }
        else actionSvc.goToAction(2); // go to sign in

        if (localStorage.getItem("resetPassInterval")) {
          let objResetPassInterval = JSON.parse(localStorage.getItem("resetPassInterval"));
          if (objResetPassInterval.remainingTime > 0) {
            $scope.formData.email = objResetPassInterval.email;
            $scope.disableLink = objResetPassInterval.disableLink;
            $scope.remainingTime = objResetPassInterval.remainingTime;
            timeInterval();
          }
          else localStorage.removeItem("resetPassInterval");
        };
      }

      $scope.tryAgain = function() {
        if ($scope.formData.email) {
          $scope.disableLink = true;
          mainSvc.callService({
              url: 'auth/forgot',
              params: {
                 'email': $scope.formData.email
              },
              secured: false
          }).then(function (response) {
            $scope.remainingTime = 60;
        		timeInterval();
          });
        };
      }

      var timeInterval = function() {
        $scope.timeInterval=$interval(function(){
          $scope.remainingTime =  $scope.remainingTime  - 1;
          localStorage.setItem("resetPassInterval", JSON.stringify({
            email: $scope.formData.email,
            disableLink: $scope.disableLink,
            remainingTime: $scope.remainingTime
          }));
          if($scope.remainingTime==0){
             $interval.cancel($scope.timeInterval);
             $scope.disableLink = false;
             localStorage.removeItem("resetPassInterval");
          }
        }, 1000);
      }

    }
]);
