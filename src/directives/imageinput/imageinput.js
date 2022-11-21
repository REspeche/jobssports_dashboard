mainApp.directive('imageInput', function() {
  return {
      restrict: 'E',
      scope: {
          name: '@',
          size: '@',
          valueReturn: "="
      },
      compile: function() {
        return {
          pre: function(scope, element, attrs) {
            KTImageInput.createInstances();
          }
        };
      },
      templateUrl: 'templates/directives/imageinput/imageinput.html'
  };
});
