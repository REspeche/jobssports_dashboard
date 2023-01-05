angular.module('mainApp').controller('signInController',
['$scope', 'authenticationSvc', '$translate', 'mainSvc', 'actionSvc', 'LOGIN',
    function ($scope, authenticationSvc, $translate, mainSvc, actionSvc, LOGIN) {
      $scope.formData = {
        email: LOGIN.email,
        password: LOGIN.password,
        remember: false
      };
      $scope.showValidateMsg = false;
      $scope.showLoginWithGoogle = LOGIN.enableGmail;

      $scope.loadPartial = function () {
        //Check Profile if it's loged
        let _login = authenticationSvc.login();
        if (_login.isLogin && _login.type == 0) {
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

      $scope.afterSiginGoogle = function(responsePayload) {
        if (responsePayload.sub) {
          mainSvc.callService({
              url: 'auth/autoLogin.google',
              params: {
                 'id': responsePayload.sub,
                 'firstName': responsePayload.given_name,
                 'email': responsePayload.email
              },
              secured: false
          }).then(function (response) {
            if (response.token) {
              localStorage.removeItem("formData");
              localStorage.removeItem("listCombosSignUp");
              authenticationSvc.saveLogin(response);
              actionSvc.goToExternal(1); //go to home
            };
          });
        };
      };

      $scope.submit = function() {
        if (!$scope.formData.email || !$scope.formData.password) {
          mainSvc.showAlertByCode(200);
          return false;
        };
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          mainSvc.showAlertByCode(204);
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
      };

      $scope.sendMailValidate = function() {
        if (!$scope.formData.email || !$scope.formData.password) {
          mainSvc.showAlertByCode(200);
          return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          mainSvc.showAlertByCode(204);
          return false;
        };

        mainSvc.callService({
            url: 'auth/validateagain',
            params: {
              'email': $scope.formData.email,
              'password': $scope.formData.password
            },
            secured: false
        }).then(function (response) {
          $scope.showValidateMsg = false;
          mainSvc.showAlertByCode(103);
        });
      };

    }
]);

function handleCredentialResponse(response) {
  const responsePayload = jwt_decode(response.credential);

  var scope = angular.element(document.getElementById("kt_partial_signin")).scope();
  scope.$apply(function () {
    scope.afterSiginGoogle(responsePayload);
  });
};
