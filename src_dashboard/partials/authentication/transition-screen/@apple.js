angular.module('mainApp').controller('signInController',
['$scope', 'authenticationSvc', 'mainSvc', 'actionSvc',
    function ($scope, authenticationSvc, mainSvc, actionSvc) {

      $scope.afterSiginApple = function(responsePayload) {
        if (responsePayload.sub) {
          mainSvc.callService({
              url: 'auth/autoLogin.apple',
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

    }
]);

// Listen for authorization success.
document.addEventListener('AppleIDSignInOnSuccess', (event) => {
    // Handle successful response.
    console.log(event.detail.data);
});

// Listen for authorization failures.
document.addEventListener('AppleIDSignInOnFailure', (event) => {
     // Handle error.
     console.log(event.detail.error);
});
