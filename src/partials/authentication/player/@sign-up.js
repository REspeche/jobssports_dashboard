angular.module('mainApp').controller('signUpController',
['$scope', 'actionSvc', 'authenticationSvc', 'mainSvc',
    function ($scope, actionSvc, authenticationSvc, mainSvc) {
      $scope.formData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordR: '',
        agree: false
      };
      $scope.blockEmail = false;
      $scope.loadForm = false;

      $scope.loadPartial = function() {
        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToAction(1); //go to home
          }
        }
        else {
          $scope.formData.type = getQueryStringValue('type',0);

          if  (getQueryStringValue('email',undefined)!=undefined) {
            $scope.blockEmail = true;
            $scope.formData.email = getQueryStringValue('email','');
          }
          $scope.loadForm = true;
        }

        KTPasswordMeter.createInstances();
        var passwordMeterElement = document.querySelector('[data-kt-password-meter="true"]');
        var passwordMeter = KTPasswordMeter.getInstance(passwordMeterElement);
      }

      $scope.submit = function() {

        //Validations
        if ($scope.formData.firstName=='' ||
            $scope.formData.lastName=='' ||
            $scope.formData.email=='' ||
            $scope.formData.password=='' ||
            $scope.formData.passwordR=='') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        if ($scope.formData.password != $scope.formData.passwordR) {
          mainSvc.showAlertByCode(203);
          return false;
        };
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          mainSvc.showAlertByCode(204);
          return false;
        };
        if (!$scope.formData.agree) {
          mainSvc.showAlertByCode(205);
          return false;
        };

        //Ajax send
        mainSvc.callService({
            url: 'auth/signupplayer',
            params: {
              'firstName': $scope.formData.firstName,
              'lastName': $scope.formData.lastName,
              'email': $scope.formData.email,
              'password': $scope.formData.password,
              'agree': $scope.formData.agree
            },
            secured: false
        }).then(function (response) {
          if (response.code==0) {
            localStorage.setItem("sendMailInterval", JSON.stringify({
              email: $scope.formData.email,
              disableLink: true,
              remainingTime: 60
            }));
            actionSvc.goToAction(5, {
              email: $scope.formData.email,
              type: 'verify'
            }); // go to verify email
          }
          else {
            mainSvc.showAlertByCode(response.code);
          }
        });
      }
    }
]);
