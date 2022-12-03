angular.module('mainApp').controller('accountController',
['$scope', '$rootScope', 'mainSvc', 'actionSvc', '$stateParams', '$interval',
    function ($scope, $rootScope, mainSvc, actionSvc, $stateParams, $interval) {
      $scope.formData = {
        id: 0,
        firstName: '',
        lastName: '',
        fullName: '',
        genId: 1,
        dateBirth: undefined,
        couId: 10,
        couIdPassport: 0,
        couCode: '',
        couName: '',
        couNamePassport: '',
        club: 0,
        selection: 0,
        originalNameHighlight: undefined,
        urlVideoHighlight: undefined,
        subscription: 1,
        phone: '',
        entered: undefined,
        emailRenew: '',
        noticeChangeEmail: 0
      };
      $scope.formSignin = {
        wannaChangeEmail: false,
        wannaChangePassword: false,
        emailRenew: '',
        emailRenewOriginal: '',
        password: '',
        passwordNew: '',
        passwordNewR: ''
      };
      $scope.pageTab = $stateParams.page;
      $scope.lstCountries = [];

      $scope.loadPartial = function() {
        mainSvc.callService({
          url: 'profile/getProfile',
          params: {
              type: $rootScope.userInfo.type
          },
          secured: true
        }).then(function (response) {
          $scope.formData = angular.copy(response);
          $scope.formSignin.emailRenew = $scope.formData.emailRenew;
          $rootScope.navBar = {
            fullName: $scope.formData.fullName,
            couName: $scope.formData.couName
          };
        });
      };

      $scope.refreshContent = function() {
        switch ($scope.pageTab) {
          case 'overview':
            break;
          case 'settings':
            //load combos
            mainSvc.callService({
                url: 'common/getListComboCountry',
                secured: false
            }).then(function (response) {
              $scope.lstCountries = angular.copy(response);
            });

            if (localStorage.getItem("sendMailInterval")) {
              let objSendMailInterval = JSON.parse(localStorage.getItem("sendMailInterval"));
              if (objSendMailInterval.remainingTime > 0) {
                $scope.remainingTime = objSendMailInterval.remainingTime;
                timeInterval();
              }
              else localStorage.removeItem("sendMailInterval");
            };
            break;
        };
      };

      $scope.goToHome = function() {
        actionSvc.goToAction(1);
      };

      $scope.goToAccountSettings = function() {
        actionSvc.goToAction(8, {
          page: 'settings'
        });
      };

      $scope.changeEmail = function() {
        $scope.formSignin.emailRenewOriginal = $scope.formSignin.emailRenew;
        $scope.formSignin.wannaChangeEmail = true;
      };

      $scope.changePassword = function() {
        $scope.formSignin.wannaChangePassword = true;
      };

      $scope.updateEmail = function(_sendEmailAgain) {
        //Validation
        if (($scope.formSignin.emailRenew == '' ||
          $scope.formSignin.password == '') &&
        _sendEmailAgain == 0) {
          mainSvc.showAlertByCode(202);
          return false;
        };

        mainSvc.callService({
            url: 'auth/updatedEmail',
            params: {
              'email': $scope.formSignin.emailRenew,
              'password': $scope.formSignin.password,
              'sendEmailAgain': (_sendEmailAgain)?1:0
            },
            secured: true
        }).then(function (response) {
          if (response.code==0) {
            $scope.formData.noticeChangeEmail = 1;
            $scope.formSignin.wannaChangeEmail = false;
            $scope.remainingTime = 60;
            localStorage.setItem("sendMailInterval", JSON.stringify({
              email: $scope.formSignin.emailRenew,
              remainingTime: $scope.remainingTime
            }));
            timeInterval();
            mainSvc.showAlertByCode(212);
          }
          else {
            mainSvc.showAlertByCode(response.code);
          }
        });
      };

      $scope.updatePassword = function() {
        //Validation
        if ($scope.formSignin.password == '' ||
        $scope.formSignin.passwordNew == '' ||
        $scope.formSignin.passwordNewR == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        if ($scope.formSignin.password == $scope.formSignin.passwordNew) {
          mainSvc.showAlertByCode(208);
          return false;
        };
        if ($scope.formSignin.passwordNew != $scope.formSignin.passwordNewR) {
          mainSvc.showAlertByCode(203);
          return false;
        };

        mainSvc.callService({
            url: 'auth/updatedPassword',
            params: {
              'password': $scope.formSignin.password,
              'passwordNew': $scope.formSignin.passwordNew,
              'passwordNewR': $scope.formSignin.passwordNewR,
            },
            secured: true
        }).then(function (response) {
          if (response.code==0) {
            $scope.formSignin.password = '';
            $scope.formSignin.passwordNew = '';
            $scope.formSignin.passwordNewR = '';
            $scope.formSignin.wannaChangePassword = false;
            mainSvc.showAlertByCode(2);
          }
          else {
            mainSvc.showAlertByCode(response.code);
          }
        });
      };

      $scope.cancelEmail = function() {
        $scope.formSignin.emailRenew = $scope.formSignin.emailRenewOriginal;
        $scope.formSignin.wannaChangeEmail = false;
      };

      $scope.cancelPassword = function() {
        $scope.formSignin.wannaChangePassword = false;
      };

      $scope.sendEmailAgain = function() {
        $scope.updateEmail(1);
      };

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
