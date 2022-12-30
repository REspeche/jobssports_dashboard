angular.module('mainApp').controller('contactController',
['$scope', 'actionSvc', 'mainSvc',
    function ($scope, actionSvc, mainSvc) {
      $scope.formData = {
        name: '',
        email: '',
        message: ''
      };

      $scope.loadPartial = function() {

      };

      $scope.goToHome = function() {
        actionSvc.goToAction(0); // go to root
      };

      $scope.goToMap = function() {
        actionSvc.goToSite('https://www.google.com/maps/place/221+W+Hallandale+Beach+Blvd+%23332,+Hallandale+Beach,+FL+33009/@25.9851929,-80.1554863,16z/data=!4m5!3m4!1s0x88d9ac79013fca5f:0x3882d6dc1bd01df1!8m2!3d25.9851302!4d-80.1509802', {}, true);
      };

      $scope.sendMessage = function() {
        //Validations
        if ($scope.formData.name=='' ||
            $scope.formData.email=='' ||
            $scope.formData.message=='') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          mainSvc.showAlertByCode(204);
          return false;
        };

        //Ajax send
        mainSvc.callService({
            url: 'auth/contactUs',
            params: {
              'name': $scope.formData.name,
              'email': $scope.formData.email,
              'message': $scope.formData.message
            },
            secured: false
        }).then(function (response) {
          if (response.code==0) {
            $scope.formData = {
              name: '',
              email: '',
              message: ''
            };
            mainSvc.showAlertByCode(102);
          }
          else {
            mainSvc.showAlertByCode(response.code);
          }
        });
      };

    }
]);
