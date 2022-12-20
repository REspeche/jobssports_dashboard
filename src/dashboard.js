mainApp.controller('dashboardController',
[ '$scope', '$rootScope',
      function ($scope, $rootScope) {
        $scope.loadDashboard = function() {

          /* Scroll top */
          $('html, body').animate({
              scrollTop:0
          });
        };
      }
]);
