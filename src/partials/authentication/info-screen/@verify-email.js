angular.module('mainApp').controller('verifyEmailController',
['$scope', '$interval', 'mainSvc', 'actionSvc', '$stateParams',
    function ($scope, $interval, mainSvc, actionSvc, $stateParams) {
      $scope.formData = {
        email: ''
      };
      $scope.remainingTime = 0;

      $scope.loadPartial = function() {
        //load type
        if ($stateParams.type) {
          $scope.formData.type = $stateParams.type;
        };
        //load email
        if ($stateParams.email) {
          $scope.formData.email = $stateParams.email;
        }
        else actionSvc.goToAction(2); // go to sign in

        if (localStorage.getItem("sendMailInterval")) {
          let objSendMailInterval = JSON.parse(localStorage.getItem("sendMailInterval"));
          if (objSendMailInterval.remainingTime > 0) {
            $scope.formData.email = objSendMailInterval.email;
            $scope.remainingTime = objSendMailInterval.remainingTime;
            timeInterval();
          }
          else localStorage.removeItem("sendMailInterval");
        };
      }

      $scope.tryAgain = function() {
        if ($scope.formData.email) {
          mainSvc.callService({
              url: ($scope.formData.type=='reset')?'auth/forgot':'auth/verifyemail',
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
          localStorage.setItem("sendMailInterval", JSON.stringify({
            email: $scope.formData.email,
            remainingTime: $scope.remainingTime
          }));
          if($scope.remainingTime==0){
             $interval.cancel($scope.timeInterval);
             localStorage.removeItem("sendMailInterval");
          }
        }, 1000);
      }

    }
]);
