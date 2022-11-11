mainApp.directive('btnSubmit', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            btnClass: '@',
            label: '@'
        },
        templateUrl: 'templates/directives/btnsubmit/btnsubmit.html'
    };
}]);
