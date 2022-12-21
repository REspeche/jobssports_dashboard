mainApp.controller('homeController',
[ '$scope',
      function ($scope) {

        $scope.loadHome = function() {

          /* Scroll top */
          $('html, body').animate({
              scrollTop:0
          });
        };

      }
]);
