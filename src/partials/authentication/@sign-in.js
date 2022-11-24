angular.module('mainApp').controller('signInController',
['$scope', 'authenticationSvc', '$translate', 'mainSvc', 'actionSvc',
    function ($scope, authenticationSvc, $translate, mainSvc, actionSvc) {
      $scope.formData = {
        email: 'ricardo_espeche@hotmail.com',
        password: 'Ricard0Espech3',
        remember: false
      };

      $scope.loadPartial = function () {
        //Check Profile if it's loged
        let _login = authenticationSvc.login();
        if (_login.isLogin && _login.isProfile == 0) {
          actionSvc.goToAction(6); //go to profile
          return false;
        };

        $scope.querystring = {
          urlback: getQueryStringValue('urlback'),
          email: getQueryStringValue('email'),
          endSession: getQueryStringValue('endSession'),
          endToken: getQueryStringValue('endToken')
        };

        //load email
        if ($scope.querystring.email) {
            $scope.formData.email = $scope.querystring.email;
        }

        //load popup end session
        if ($scope.querystring.endSession == '1' || $scope.querystring.endToken == '1') {
          $translate.onReady(function() {
            setHash('/authentication/sign-in');
            mainSvc.showModal({
              icon: 'warning',
              confirmButtonText: $translate.instant('BTN_CLOSE'),
              text: ($scope.querystring.endSession=='1')?$translate.instant('MSG_END_SESSION'):$translate.instant('MSG_FAIL_TOKEN')
            });
          });
        }
      };

      $scope.submit = function() {
        if (!$scope.formData.email || !$scope.formData.password) {
          mainSvc.showAlertByCode(200);
          return false;
        };
        mainSvc.callService({
            url: 'auth/login',
            params: {
               'email': $scope.formData.email,
               'password': $scope.formData.password
            },
            secured: false
        }).then(function (response) {
          if (response.code==200) {
            $scope.formData.password = "";
          }
          else if (response.code==207) {
            $scope.showValidateMsg = true;
          }
          else {
            if (response.token) {
              localStorage.removeItem("formData");
              localStorage.removeItem("listCombosSignUp");
              authenticationSvc.saveLogin(response);
              actionSvc.goToExternal(1); //go to home
            };
          };
        });
      };

      $scope.forgotPass = function() {
        //Verify if already get a request to change password
        if (localStorage.getItem("sendMailInterval")) {
          let objSendMailInterval = JSON.parse(localStorage.getItem("sendMailInterval"));
          actionSvc.goToAction(5, {
            email: objSendMailInterval.email
          }); // go to verify email
        }
        else {
          actionSvc.goToAction(3);
        }
      }

    }
]);
