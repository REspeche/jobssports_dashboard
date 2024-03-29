angular.module('mainApp').controller('accountController',
['$scope', '$rootScope', 'mainSvc', 'actionSvc', '$stateParams', '$interval', '$translate', 'authenticationSvc',
    function ($scope, $rootScope, mainSvc, actionSvc, $stateParams, $interval, $translate, authenticationSvc) {
      $scope.formData = {
        id: 0,
        type: 1,
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
        logo: undefined,
        subscription: 1,
        phone: '',
        entered: undefined,
        emailRenew: '',
        noticeChangeEmail: 0,
        allowMarketing: 1,
        noticeEmail: 1,
        clubName: '',
        fullNameContact: '',
        paymentDeclined: 0,
        dateFoundation: undefined
      };
      $scope.formDataBackup = {};
      $scope.formSignin = {
        wannaChangeEmail: false,
        wannaChangePassword: false,
        emailRenew: '',
        emailRenewOriginal: '',
        password: '',
        passwordNew: '',
        passwordNewR: ''
      };
      $scope.formDeactivate = {
        password: ''
      };
      $scope.pageTab = $stateParams.page;
      $scope.lstCountries = [];
      $scope.agreeDeactivateAccount = false;
      $scope.lstLogs = [];

      $scope.loadPartial = function() {
        mainSvc.callService({
          url: 'profile/getProfile',
          params: {
              type: $rootScope.userInfo.type
          },
          secured: true
        }).then(function (response) {
          $scope.formData = angular.copy(response);
          $scope.formData.allowMarketing = ($scope.formData.allowMarketingBit==1?true:false);
          $scope.formData.noticeEmail = ($scope.formData.noticeEmailBit==1?true:false);
          // Backup
          $scope.formDataBackup = angular.copy($scope.formData);

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
          case 'logs':
            $scope.getLogs(false);
            break;
        };
      };

      $scope.goToHome = function() {
        actionSvc.goToAction(1);
      };

      $scope.goToAccountOverview = function() {
        actionSvc.goToAction(7, {
          page: 'overview'
        });
      };

      $scope.goToAccountSettings = function() {
        actionSvc.goToAction(7, {
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

      //settings
      $scope.discardSettingsChanges = function() {
        $scope.formData = angular.copy($scope.formDataBackup);
        mainSvc.showAlertByCode(4);
      };

      $scope.saveSettingsChanges = function() {
        if ($scope.formData.type==1 && (!$scope.formData.firstName || !$scope.formData.lastName || !$scope.formData.dateBirth || !$scope.formData.phone || !$scope.formData.couId)) {
          mainSvc.showAlertByCode(202);
          return false;
        };
        if ($scope.formData.type==2 && (!$scope.formData.clubName || !$scope.formData.firstName || !$scope.formData.lastName || !$scope.formData.dateFoundation || !$scope.formData.phone || !$scope.formData.couId)) {
          mainSvc.showAlertByCode(202);
          return false;
        };

        let paramApi = {};
        switch ($scope.formData.type) {
          case 1:
            paramApi = {
                url: 'profile/updateSettingsPlayer',
                params: {
                  'firstName': $scope.formData.firstName,
                  'lastName': $scope.formData.lastName,
                  'dateBirth': $scope.formData.dateBirth,
                  'phone': $scope.formData.phone,
                  'couId': $scope.formData.couId,
                  'allowMarketing': ($scope.formData.allowMarketing)?1:0,
                  'noticeEmail': ($scope.formData.noticeEmail)?1:0
                },
                secured: true
            };
            break;
          case 2:
            paramApi = {
                url: 'profile/updateSettingsClub',
                params: {
                  'clubName': $scope.formData.clubName,
                  'firstName': $scope.formData.firstName,
                  'lastName': $scope.formData.lastName,
                  'dateFoundation': $scope.formData.dateFoundation,
                  'phone': $scope.formData.phone,
                  'couId': $scope.formData.couId,
                  'allowMarketing': ($scope.formData.allowMarketing)?1:0,
                  'noticeEmail': ($scope.formData.noticeEmail)?1:0
                },
                secured: true
            };
            break;
        }

        mainSvc.callService(paramApi).then(function (response) {
          if (response.code==0) {
            mainSvc.showAlertByCode(1);
          }
          else {
            mainSvc.showAlertByCode(response.code);
          };
        });
      };

      $scope.clickAgreeDeactivateAccount = function() {
        $scope.agreeDeactivateAccount = !$scope.agreeDeactivateAccount;
      };

      $scope.modalDeactivateAccount = function() {
        if ($scope.agreeDeactivateAccount) {
          $('#kt_modal_deactivate_account').modal('show');
        }
        else {
          mainSvc.showAlertByCode(213);
        };
      }

      $scope.cancelDeactivateAccount = function() {
        $scope.formDeactivate.password = '';
        $('#kt_modal_deactivate_account').modal('hide');
      }

      $scope.submitDeactivateAccount = function() {
        if ($scope.formDeactivate.password!='') {
          mainSvc.showModal(
            {
              text: $translate.instant('MSG_CONFIRM_DEACTIVATE'),
              confirmButtonText: $translate.instant('BTN_YES'),
              cancelButtonText: $translate.instant('BTN_NO'),
              showCancelButton: true,
              focusConfirm: true
            },
            function() {
              mainSvc.callService({
                  url: 'profile/deactivateAccount',
                  params: {
                    'password': $scope.formDeactivate.password
                  },
                  secured: true
              }).then(function (response) {
                if (response.code==0) {
                  mainSvc.showModal(
                    {
                      text: $translate.instant('MSG_COD105'),
                      confirmButtonText: $translate.instant('BTN_CONTINUE'),
                      focusConfirm: true
                    },
                    function() {
                      authenticationSvc.logout();
                      actionSvc.goToExternal(2); // go to login
                    }
                  );
                }
                else {
                  mainSvc.showAlertByCode(response.code);
                };
              });
            }
          );
        }
        else {
          mainSvc.showAlertByCode(202);
        };
      };

      $scope.removeUnlinkGoogle = function() {
        mainSvc.showModal(
          {
            text: $translate.instant('MSG_UNLINK_GOOGLE'),
            confirmButtonText: $translate.instant('BTN_YES'),
            cancelButtonText: $translate.instant('BTN_NO'),
            showCancelButton: true,
            focusConfirm: true
          },
          function() {
            mainSvc.callService({
                url: 'profile/unlinkGoogle',
                secured: true
            }).then(function (response) {
              if (response.code==0) {
                $rootScope.userInfo.linkGoogle = response.linkGoogle;
                authenticationSvc.saveLogin();
                mainSvc.showAlertByCode(104);
              }
              else {
                mainSvc.showAlertByCode(response.code);
              }
            });
          }
        );
      };

      $scope.getLogs = function(isMore) {
        mainSvc.callService({
            url: 'profile/getLogs',
            params: {
              logId: (!isMore)?0:$scope.lstLogs[$scope.lstLogs.length-1].id
            },
            secured: true
        }).then(function (response) {
          if (!isMore) {
            $scope.lstLogs = angular.copy(response);
          }
          else {
            $scope.lstLogs = Object.assign({}, $scope.lstLogs, angular.copy(response));
          }
        });
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
