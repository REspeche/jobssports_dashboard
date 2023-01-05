angular.module('mainApp').controller('listOffersController',
['$scope', 'mainSvc', '$translate', 'BASE_URL',
    function ($scope, mainSvc, $translate, BASE_URL) {
      const _dNow = new Date().format('mm/dd/yyyy');
      $scope.formData = {
        title: '',
        effectiveDate: _dNow,
        gender: 1,
        mainPosition: 1,
        contractType: 1,
        salaryAmountWork: 0,
        salaryAmountPlay: 0,
        contractDateStart: _dNow,
        contractDateEnd: _dNow,
        europeanPassport: 0,
        benefits: []
      };
      $scope.lstOffers = [];
      $scope.lstBenefits = [];
      $scope.lstGenders = [];
      $scope.lstRugbyPositions = [];
      $scope.loadForm = false;
      $scope.lstContracts = [
        {
          id: 1,
          label: 'Amateur'
        },
        {
          id: 2,
          label: 'Semi'
        },
        {
          id: 3,
          label: 'Professional'
        }
      ];
      $scope.lstStatusOffer = [
        {
          id: 1,
          label: 'Pending'
        },
        {
          id: 2,
          label: 'Active'
        },
        {
          id: 3,
          label: 'Overdue'
        }
      ];
      var configChart = {
          type: 'doughnut',
          data: {
              datasets: [{
                  data: [1, 0, 0],
                  backgroundColor: ['#00A3FF', '#50CD89', '#E4E6EF']
              }],
              labels: ['Pending', 'Active', 'Overdue']
          },
          options: {
              chart: {
                  fontFamily: 'inherit'
              },
              borderWidth: 0,
              cutout: '75%',
              cutoutPercentage: 65,
              responsive: true,
              maintainAspectRatio: false,
              title: {
                  display: false
              },
              animation: {
                  animateScale: true,
                  animateRotate: true
              },
              stroke: {
                  width: 0
              },
              tooltips: {
                  enabled: true,
                  intersect: false,
                  mode: 'nearest',
                  bodySpacing: 5,
                  yPadding: 10,
                  xPadding: 10,
                  caretPadding: 0,
                  displayColors: false,
                  backgroundColor: '#20D489',
                  titleFontColor: '#ffffff',
                  cornerRadius: 4,
                  footerSpacing: 0,
                  titleSpacing: 0
              },
              plugins: {
                  legend: {
                      display: false
                  }
              }
          }
      };
      $scope.totalItems = 0;
      $scope.lstApplicants = [];
      $scope.path = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=profile&file=';
      $scope.filterStatus = 1;

      $scope.test = function () {
       alert ("changed!");
      }

      $scope.loadPartial = function() {
        //load combos
        if (localStorage.getItem("listCombosSignUp")) {
          let response = JSON.parse(localStorage.getItem("listCombosSignUp"));
          setListCombosForm(response);
          $scope.loadForm = true;
        }
        else {
          mainSvc.callService({
              url: 'common/getListCombosSignUp',
              secured: false
          }).then(function (response) {
            localStorage.setItem("listCombosSignUp", JSON.stringify(response));
            setListCombosForm(response);
            $scope.loadForm = true;
          });
        };

        mainSvc.callService({
            url: 'offer/getOffers'
        }).then(function (response) {
            $scope.lstOffers = angular.copy(response.list);
            $scope.valCounters = angular.copy(response.counter);
            $scope.lstApplicants = angular.copy(response.applicants);
            $scope.lstOffers.forEach((item, i) => {
              item.effectiveDateStr = UnixTimeStampToFormatStr(item.effectiveDate);
              item.contractDateStartStr = UnixTimeStampToFormatStr(item.contractDateStart);
              item.contractDateEndStr = UnixTimeStampToFormatStr(item.contractDateEnd);
              item.daysProgress = 0;
              item.progressValue = 0;
              let dateEff = UnixTimeStampToDate(item.effectiveDate);
              if (_dNow > dateEff) {
                let date1 = new Date(_dNow);
                let date2 = new Date(dateEff);
                item.daysProgress = (date1 - date2) / (1000 * 3600 * 24);
                item.progressValue = Math.floor((item.daysProgress * 100) / item.daysTotal);
              };
            });
            for (var t=0;t<3;t++) {
              let item = $scope.valCounters.find(x => x.status == (t+1));
              if (item) {
                let valTotal = item.total;
                configChart.data.datasets[0].data[t] = valTotal;
                $scope.totalItems += valTotal;
              };
            };
        });

        let initChart = function () {
            // init chart
            var element = document.getElementById("kt_project_list_chart");

            if (!element) {
                return;
            }

            var ctx = element.getContext('2d');
            var myDoughnut = new Chart(ctx, configChart);
        };
        initChart();
      };

      let setListCombosForm = function(response) {
        $scope.lstGenders = angular.copy(response['gender']);
        $scope.lstRugbyPositions = angular.copy(response['rugbyPositions']);

        //load benefits
        mainSvc.callService({
            url: 'common/getListRugbyBenefits',
            secured: false
        }).then(function (response) {
          $scope.lstBenefits = angular.copy(response);
        });
      };

      $scope.cancelAddOffer = function() {
        mainSvc.showModal(
          {
            text: $translate.instant('MSG_CANCEL_ACTION'),
            confirmButtonText: $translate.instant('BTN_YES_CANCEL'),
            cancelButtonText: $translate.instant('BTN_NO_CANCEL'),
            showCancelButton: true,
            focusConfirm: true,
            icon: 'warning',
          },
          function() {
            $('#kt_modal_add_offer').modal('hide');
          }
        );
      };

      $scope.submitAddOffer = function() {
        if (!$scope.formData.effectiveDate ||
            !$scope.formData.gender ||
            !$scope.formData.mainPosition ||
            !$scope.formData.contractType ||
            !$scope.formData.contractDateStart) {
          mainSvc.showAlertByCode(202);
          return false;
        };

        mainSvc.callService({
            url: 'offer/addOffer',
            params: {
              'title': $scope.formData.title,
              'effectiveDate': $scope.formData.effectiveDate,
              'gender': $scope.formData.gender,
              'mainPosition': $scope.formData.mainPosition,
              'contractType': $scope.formData.contractType,
              'salaryAmountWork': $scope.formData.salaryAmountWork,
              'salaryAmountPlay': $scope.formData.salaryAmountPlay,
              'contractDateStart': $scope.formData.contractDateStart,
              'contractDateEnd': $scope.formData.contractDateEnd,
              'europeanPassport': ($scope.formData.europeanPassport)?1:0,
              'arrBenefits': JSON.stringify($scope.formData.benefits)
            },
            secured: true
        }).then(function (response) {
          if (response.code==0) {
            mainSvc.showAlertByCode(1);
            $('#kt_modal_add_offer').modal('hide');

            mainSvc.callService({
                url: 'offer/getOffer',
                params: {
                  'offId': response.id
                },
                secured: true
            }).then(function (response) {
              $scope.lstOffers.push(angular.copy(response));
            });
          }
          else {
            mainSvc.showAlertByCode(response.code);
          };
        });
      };

      $scope.closeAddOffer = function() {
        $('#kt_modal_add_offer').modal('hide');
      };

      $scope.offerFilter = function (item) {
        return item.status == $scope.filterStatus;
      };

      $scope.selectBenefits = function(itemAdd) {
        let found = false;
        $scope.formData.benefits.forEach((item, i) => {
          if (item.id == itemAdd.id) found = true;
        });
        if (!found) $scope.formData.benefits.push({
          id: itemAdd.id,
          action: 1 //insert
        });
      };

      $scope.visibleSalary = function() {
        let found = false;
        $scope.formData.benefits.forEach((item, i) => {
          if (item.id == 3 && item.action!=3) found = true;
        });
        return found;
      };

    }
]);
