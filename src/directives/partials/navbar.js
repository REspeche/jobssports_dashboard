mainApp.directive('navBar', function() {

        return {
            restrict: 'E',
            scope: {
              pageParam: '='
            },
            controller:['$scope', 'BASE_URL', '$state',
              function ($scope, BASE_URL, $state) {
                $scope.path = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=profile&file=';

                $scope.goToTab = function(page) {
                  $state.go('.', {page: page}, {notify: false});
                  $scope.pageParam = page;
                };
              }
            ],
            templateUrl: 'templates/directives/partials/navbar.html'
        };
    });
