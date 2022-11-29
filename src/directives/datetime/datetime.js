mainApp.directive('dateTime', function() {
        return {
            restrict: 'E',
            scope: {
                name: '@',
                value: '=',
                valuestart: '=',
                valueend: '=',
                range: '@',
                yearsubtract: '@'
            },
            controller: ['$scope', function ($scope) {
                var objDate = undefined;
                $scope.placeholder = ($scope.range)?"Pick date rage":"Pick a date";

                $scope.$watch('valuestart', function() {
                  if ($scope.valuestart) {
                    $('#'+$scope.name).data('daterangepicker').setStartDate($scope.valuestart);
                  };
                });
                $scope.$watch('valueend', function() {
                  if ($scope.valueend) {
                    $('#'+$scope.name).data('daterangepicker').setEndDate($scope.valueend);
                  };
                });

                $( document ).ready(function() {
                  const d = new Date();
                  let year = d.getFullYear();
                  let month = d.getMonth() + 1;
                  let day = d.getDate();
                  if ($scope.range) {
                    $("#"+$scope.name).daterangepicker({
                        dateFormat: "m-d-Y",
                        maxDate: month+"-"+day+"-"+year,
                        startDate: DateTimeToDateObj($scope.valuestart),
                        endDate: DateTimeToDateObj($scope.valueend)
                    }, function(start, end, label) {
                      $scope.$apply(() => {
                        $scope.valuestart = dateFormat(start,"mm/dd/yyyy");
                        $scope.valueend = dateFormat(end,"mm/dd/yyyy");
                      });
                    });
                  }
                  else {
                    $("#"+$scope.name).flatpickr({
                        defaultDate: $scope.value,
                        dateFormat: "m-d-Y",
                        maxDate: ($scope.yearsubtract)?month+"-"+day+"-"+(year-$scope.yearsubtract):month+"-"+day+"-"+year,
                        onChange: function(selectedDates, dateStr, instance) {
                          $scope.$apply(() => {
                            $scope.value = dateFormat(selectedDates,"mm/dd/yyyy");
                          });
                        }
                    });
                  };
                });
            }],
            templateUrl: 'templates/directives/datetime/datetime.html'
        };
    });
