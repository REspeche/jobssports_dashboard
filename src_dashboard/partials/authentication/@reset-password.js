angular.module('mainApp').controller('resetPasswordController',
['$scope', 'authenticationSvc', 'mainSvc', 'actionSvc',
    function ($scope, authenticationSvc, mainSvc, actionSvc) {
      $scope.formData = {
        email: '',
        hash: '',
        password: '',
        passwordR: ''
      };

      $scope.loadPartial = function() {
        //Check Profile if it's loged
        let _login = authenticationSvc.login();
        if (_login.isLogin && _login.type == 0) {
          actionSvc.goToAction(6); //go to profile
          return false;
        };

        $scope.formData.email = getQueryStringValue('email','');
        $scope.formData.hash = getQueryStringValue('hash','');

        //Verify if already get a request to change password
        if (localStorage.getItem("sendMailInterval")) {
          let objSendMailInterval = JSON.parse(localStorage.getItem("sendMailInterval"));
          actionSvc.goToAction(5, {
            email: objSendMailInterval.email
          }); // go to verify email
        };
      }

      $scope.submit = function() {
        if (!$scope.formData.email) {
          mainSvc.showAlertByCode(201);
          return false;
        };
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          mainSvc.showAlertByCode(204);
          return false;
        };
        mainSvc.callService({
            url: 'auth/forgot',
            params: {
               'email': $scope.formData.email
            },
            secured: false
        }).then(function (response) {
          localStorage.setItem("sendMailInterval", JSON.stringify({
            email: $scope.formData.email,
            remainingTime: 60
          }));
          actionSvc.goToAction(5, {
            email: $scope.formData.email,
            type: 'reset'
          }); // go to verify email
        });
      }

    }
]);
