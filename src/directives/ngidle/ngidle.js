mainApp.directive( 'ngIdle', function() {
   return {
       restrict: 'E',
       controller:[ '$scope', 'Idle', 'mainSvc', 'actionSvc', 'authenticationSvc', '$translate',
       function ($scope, Idle, mainSvc, actionSvc, authenticationSvc, $translate) {
          //Idle.watch();

          $scope.$on('IdleStart', function() {
              let _msg = $translate.instant("MSG_IDLE_SESSION");
              mainSvc.showAlert().notifyWarning(_msg);
          });
          $scope.$on('IdleEnd', function() {
              toastr.clear();
          });
          $scope.$on('IdleTimeout', function() {
              authenticationSvc.logout();
              actionSvc.goToExternal(2.1);
          });
       }]
    };
});
