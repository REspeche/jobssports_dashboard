angular.module('mainApp').controller('profileController',
['$scope', '$rootScope', 'mainSvc', 'BASE_URL',
    function ($scope, $rootScope, mainSvc, BASE_URL) {
      const _dNow = new Date().format('m/d/yyyy');
      $scope.path = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=profile&file=';
      $scope.formData = {
        firstName: '',
        lastName: '',
        gender: 1,
        dateBirth: undefined,
        countryBirth: 10,
        countryPassport: 0,
        clubs: [],
        nationalTeams: [],
        mainPosition: '1',
        secondaryPosition: undefined,
        height: 175,
        weight: 90,
        squat: 40,
        shoulder: 100,
        sprint100: 60,
        personalQuality: 1,
        pictureH: undefined,
        videoH: undefined,
        pictureGallery: [],
        videoGallery: [],
        phone: ''
      };
      $scope.lstGenders = [];
      $scope.lstCountries = [];
      $scope.lstCountriesPass = [];
      $scope.lstRugbyPositions = [];
      $scope.lstPersonalQualities = [];
      $scope.loadForm = false;
      $scope.formDataClub = {
        id: 0,
        name: '',
        contract: '1',
        country: '10',
        rangeDateStart: _dNow,
        rangeDateEnd: _dNow,
        description: ''
      };

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
      $scope.lstTeamsType = [
        {
          id: 1,
          label: 'State'
        },
        {
          id: 2,
          label: 'National'
        }
      ];

      $scope.loadPartial = function() {
        //load combos
        if (localStorage.getItem("listCombosSignUp")) {
          let response = JSON.parse(localStorage.getItem("listCombosSignUp"));
          setListCombosSignUp(response);
          $scope.loadForm = true;
        }
        else {
          mainSvc.callService({
              url: 'common/getListCombosSignUp',
              secured: false
          }).then(function (response) {
            localStorage.setItem("listCombosSignUp", JSON.stringify(response));
            setListCombosSignUp(response);

            //get user country
            jQuery.getScript('http://www.geoplugin.net/javascript.gp', function()
            {
                var country = geoplugin_countryName();
                if (country && $scope.lstCountries) {
                  angular.forEach($scope.lstCountries, function(value, key) {
                    if (value.label.toLowerCase() == country.toLowerCase()) {
                      $scope.$apply(() => {
                        $scope.player.countryBirth = value.id.toString();
                      });
                    };
                  });
                };
            });
            $scope.loadForm = true;
          });
        };

        mainSvc.callService({
          url: 'profile/getProfilePlayer',
          secured: true
        }).then(function (response) {
          let dataR = angular.copy(response[0]);
          $scope.formData.firstName = dataR.firstName;
          $scope.formData.lastName = dataR.lastName;
          $scope.formData.gender = dataR.genId;
          $scope.formData.dateBirth = dataR.dateBirth;
          $scope.formData.countryBirth = dataR.couId;
          $scope.formData.countryPassport = dataR.couIdPassport;
          $scope.formData.logo = dataR.logo;
          $scope.formData.phone = dataR.phone;
          $scope.formData.clubs = response[1];
          $scope.formData.nationalTeams = response[2];
        });

        $( document ).ready(function() {
          // Phone
          Inputmask({
              "mask" : "(999) 999-9999"
          }).mask("#kt_club_phone");
        });
      };

      let setListCombosSignUp = function(response) {
        $scope.lstGenders = angular.copy(response['gender']);
        $scope.lstCountries = angular.copy(response['country']);
        $scope.lstCountriesPass = angular.copy(response['country']);
        $scope.lstRugbyPositions = angular.copy(response['rugbyPositions']);
        $scope.lstPersonalQualities = angular.copy(response['personalQualities']);
        $scope.lstCountriesPass.unshift({
          id: 0,
          label: '-- I don\'t have any valid passport'
        });
      };

      /* Clubs ------------ */

      $scope.addClub = function() {
        resetObjDataClub();
        $scope.formDataClub.rangeDateStart = _dNow;
        $scope.formDataClub.rangeDateEnd = _dNow;
        $scope.formDataClub.action = 1;
        $("#kt_modal_club").modal('show');
      };

      $scope.saveAddClub = function() {
        if ($scope.formDataClub.name == '' ||
        $scope.formDataClub.contract == '' ||
        $scope.formDataClub.country == '' ||
        $("#kt_daterangepicker_club").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        $scope.formDataClub.id = $scope.formData.clubs.length + 1;
        $scope.formData.clubs.push (angular.copy($scope.formDataClub));
        $("#kt_modal_club").modal('hide');
      };

      $scope.saveEditClub = function() {
        if ($scope.formDataClub.name == '' ||
        $scope.formDataClub.contract == '' ||
        $scope.formDataClub.country == '' ||
        $("#kt_daterangepicker_club").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        let index = $scope.formData.clubs.findIndex(x => x.id == $scope.formDataClub.id);
        $scope.formData.clubs[index] = angular.copy($scope.formDataClub);
        $("#kt_modal_club").modal('hide');
      };

      $scope.removeClub = function(idx) {
        $scope.formData.clubs[idx].action = 3;
      };

      $scope.editClub = function(item) {
        $scope.formDataClub = angular.copy(item);
        $scope.formDataClub.action = 2;
        $("#kt_modal_club").modal('show');
      };

      $scope.showContractType = function(id) {
        let item = $scope.lstContracts.find(x => x.id == id);
        return item.label;
      };

      $scope.showCountry = function(id) {
        let item = $scope.lstCountries.find(x => x.id == id);
        return item.label;
      };

      let resetObjDataClub = function() {
        $scope.formDataClub = {
          id: 0,
          name: '',
          contract: '1',
          country: '10',
          rangeDateStart: _dNow,
          rangeDateEnd: _dNow,
          description: ''
        };
      };

      /* National Teams ------------ */

      $scope.addTeam = function() {
        resetObjDataTeam();
        $scope.formDataTeam.rangeDateStart = _dNow;
        $scope.formDataTeam.rangeDateEnd = _dNow;
        $scope.formDataTeam.action = 1;
        $("#kt_modal_team").modal('show');
      };

      $scope.saveAddTeam = function() {
        if ($scope.formDataTeam.type == '' ||
        $("#kt_daterangepicker_team").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        $scope.formDataTeam.id = $scope.formData.nationalTeams.length + 1;
        $scope.formData.nationalTeams.push (angular.copy($scope.formDataTeam));
        $("#kt_modal_team").modal('hide');
      };

      $scope.saveEditTeam = function() {
        if ($scope.formDataTeam.type == '' ||
        $("#kt_daterangepicker_team").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        let index = $scope.formData.nationalTeams.findIndex(x => x.id == $scope.formDataTeam.id);
        $scope.formData.nationalTeams[index] = angular.copy($scope.formDataTeam);
        $("#kt_modal_team").modal('hide');
      };

      $scope.removeTeam = function(idx) {
        $scope.formData.nationalTeams[idx].action = 3;
      };

      $scope.editTeam = function(item) {
        $scope.formDataTeam = angular.copy(item);
        $scope.formDataTeam.action = 2;
        $("#kt_modal_team").modal('show');
      };

      $scope.showTeamType = function(id) {
        let item = $scope.lstTeamsType.find(x => x.id == id);
        return item.label;
      };

      let resetObjDataTeam = function() {
        $scope.formDataTeam = {
          id: 0,
          type: '1',
          rangeDateStart: _dNow,
          rangeDateEnd: _dNow,
          description: ''
        };
      };

      /* ---- */

      $scope.onlyActive = function(item) {
        return item.action != 3;
      };
    }
]);
