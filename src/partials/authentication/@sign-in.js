angular.module('mainApp').controller('signInController',
['$scope', 'authenticationSvc', '$translate', 'mainSvc',
    function ($scope, authenticationSvc, $translate, mainSvc) {
      $scope.formData = {
        email: '',
        password: '',
        remember: false
      };

      $scope.loadPartial = function () {
        $scope.querystring = {
          urlback: getQueryStringValue('urlback'),
          email: getQueryStringValue('email'),
          endSession: getQueryStringValue('endSession'),
          endToken: getQueryStringValue('endToken')
        };

        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToExternal(1); //go to home
          }
        }
        else {
          //load email
          if ($scope.querystring.email != "") {
              $scope.formData.email = $scope.querystring.email;
          }

          //load popup end session
          if ($scope.querystring.endSession == '1' || $scope.querystring.endToken == '1') {
            $translate.onReady(function() {
              setHash('/sign-in');
              mainSvc.showModal({
                icon: 'warning',
                confirmButtonText: $translate.instant('BTN_CLOSE'),
                text: ($scope.querystring.endSession=='1')?$translate.instant('MSG_END_SESSION'):$translate.instant('MSG_FAIL_TOKEN')
              });
            });
          }
        }
      };

      $scope.submit = function() {
        if (!$scope.formData.email || !$scope.formData.password) {
          mainSvc.showAlertByCode(200);
          return false;
        }
      }

    }
]);
