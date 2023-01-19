mainApp.directive('imageInput', function() {
  return {
      restrict: 'E',
      scope: {
          name: '@',
          size: '@',
          file: "=",
          image: "="
      },
      controller:['$scope', 'mainSvc', 'CONSTANTS',
        function ($scope, mainSvc, CONSTANTS) {
          let input_selector = "#" + $scope.name + ' > .image-input-wrapper';
          $scope.maxFileUpload = CONSTANTS.maxFileUpload;

          $( document ).ready(function() {
            var imageInputElement = document.querySelector("#" + $scope.name);
            var imageInput = new KTImageInput(imageInputElement);

            if ($scope.file) {
              getBase64($scope.file).then(function(data) {
                $scope.$apply(
                  function() {
                    $(input_selector).attr('style', 'background-image:url("'+data.toString()+'")');
                  }
                );
              });
            }
            else {
              if ($scope.image) {
                $scope.$apply(
                  function() {
                    $(input_selector).attr('style', 'background-image:url("'+$scope.image.toString()+'")');
                  }
                );
              };
            };

            //Events
            imageInput.on("kt.imageinput.change",function() {
              var file = imageInputElement.querySelector('input[type="file"]').files[0];
              $scope.file = file;
              getBase64(file).then(function(data) {
                $scope.$apply(
                  function() {
                    $scope.base64 = data;
                  }
                );
              });
            });
            imageInput.on("kt.imageinput.remove", function() {
              $scope.file = undefined;
              $scope.base64 = undefined;
            });
            imageInputElement.querySelector('input[type="file"]').addEventListener('change', (event) => {
              const target = event.target
                if (target.files && target.files[0]) {
                  /*Maximum allowed size in bytes
                    1MB Example
                    Change first operand(multiplier) for your needs*/
                  const maxAllowedSize = 1 * 1024 * 1024;
                  if (target.files[0].size > maxAllowedSize) {
                    // Here you can ask your users to load correct file
                    mainSvc.showAlertByCode(210);
                  };
              }
            });
          });

        }
      ],
      templateUrl: 'templates/directives/imageinput/imageinput.html'
  };
});
