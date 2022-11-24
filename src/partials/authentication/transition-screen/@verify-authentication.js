angular.module('mainApp').controller('verifyAuthenticationController',
['$scope', 'authenticationSvc', 'alertSvc', 'actionSvc',
    function ($scope, authenticationSvc, alertSvc, actionSvc) {

      $scope.loadPartial = function() {
        let _login = authenticationSvc.getUserInfo();
        if(_login.isLogin) {
          if (_login.isProfile == 0) {
            actionSvc.goToAction(6); //go to profile
          }
          else {
            actionSvc.goToAction(1); //go to home
          }
        }
        else {
          if (authenticationSvc.verifyLogin()) {
            //autentificarse
            let _login = authenticationSvc.login(true);
            if (_login.isLogin) {
              if (_login.isProfile == 0) {
                actionSvc.goToAction(6); //go to profile
              }
              else {
                //llama al servicio de alertas
                alertSvc.getAlerts().then(function (alerts) {
                  actionSvc.goToAction(1); //go to home
                });
              }
            }
          }
          else {
            actionSvc.goToAction(2); // go to login
          }
        }
      }

    }
]);
