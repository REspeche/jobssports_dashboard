angular.module('mainApp').controller('createProfileController',
['$scope', '$rootScope', '$stateParams', 'mainSvc', 'actionSvc', 'authenticationSvc',
    function ($scope, $rootScope, $stateParams, mainSvc, actionSvc, authenticationSvc) {
      $scope.formData = {
        type: 'player',
        player: {
          firstName: '',
          lastName: '',
          gender: '1',
          dateBirth: undefined,
          countryBirth: '10',
          countryPassport: '0',
          clubs: [],
          nationalTeams: [],
          mainPosition: '1',
          secondaryPosition: undefined,
          height: 175,
          weight: 90,
          squat: 40,
          shoulder: 100,
          sprint100: 60,
          personalQuality: '1',
          pictureH: undefined,
          videoH: undefined,
          pictureGallery: [],
          videoGallery: []
        },
        club: {
          name: '',
          country: '10',
          dateFoundation: undefined,
          logo: undefined,
          firstName: '',
          lastName: '',
          gender: '1',
          dateBirth: undefined,
          email: '',
          phone: '',
          teams: '',
          palmares: []
        },
        agent: {
          firstName: '',
          lastName: '',
          gender: '1',
          dateBirth: undefined,
          email: '',
          phone: '',
          countryBirth: '10',
          type: '1',
          dateStart: undefined,
          biography: ''
        },
        coach: {
          firstName: '',
          lastName: '',
          gender: '1',
          dateBirth: undefined,
          email: '',
          phone: '',
          countryBirth: '10',
          role: '3',
          dateStart: undefined,
          club: '',
          trainingType: '1',
          rangeDate: undefined,
          degree: ''
        },
        payment: {
          billingPlan: '2',
          cardName: 'Max Doe',
          cardNumber: '4111 1111 1111 1111',
          expMonth: '1',
          expYear: '2022',
          cvv: '',
          saveCard: 1
        },
        agree: false
      };
      $scope.pictureH_FileNew = undefined;
      $scope.countryPassport_FileNew = undefined;
      $scope.logo_FileNew = undefined;

      $scope.formDataCopy = {};
      $scope.formDataClub = {
        id: 0,
        name: '',
        contract: '1',
        country: '10',
        rangeDate: undefined,
        description: ''
      };
      $scope.formDataTeam = {
        id: 0,
        type: '1',
        rangeDate: undefined,
        description: ''
      };
      $scope.step = 1;
      $scope.lstGenders = [];
      $scope.lstCountries = [];
      $scope.lstCountriesPass = [];
      $scope.lstRugbyPositions = [];
      $scope.lstPersonalQualities = [];
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
      $scope.lstAgentType = [
        {
          id: 1,
          label: 'Person'
        },
        {
          id: 2,
          label: 'Company'
        }
      ];
      $scope.lstCoachRole = [
        {
          id: 1,
          label: 'Technical supporter'
        },
        {
          id: 2,
          label: 'Motivator'
        },
        {
          id: 3,
          label: 'Leader'
        },
        {
          id: 4,
          label: 'Psychologist'
        }
      ];
      $scope.lstCoachTrainingType = [
        {
          id: 1,
          label: 'University'
        },
        {
          id: 2,
          label: 'Town'
        }
      ];

      $scope.loadPartial = function() {
        authenticationSvc.login(true);
        $scope.formData.club.email = $rootScope.userInfo.email;
        $scope.formData.agent.email = $rootScope.userInfo.email;
        $scope.formData.coach.email = $rootScope.userInfo.email;

        //load Form data
        if (localStorage.getItem("formData")) {
          $scope.formData = JSON.parse(localStorage.getItem("formData"));
        };

        //load type
        if ($stateParams.type) {
          $scope.formData.type = $stateParams.type;
        };
        //load step
        if ($stateParams.step) {
          $scope.step = parseInt($stateParams.step);
        };

        //load combos
        if (localStorage.getItem("listCombosSignUp")) {
          let response = JSON.parse(localStorage.getItem("listCombosSignUp"));
          setListCombosSignUp(response);
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
                        $scope.formData.player.countryBirth = value.id.toString();
                        $scope.formData.club.country = value.id.toString();
                        $scope.formData.agent.countryBirth = value.id.toString();
                        $scope.formData.coach.countryBirth = value.id.toString();
                      });
                    };
                  });
                };
            });
          });
        }

        $( document ).ready(function() {
            //restrict date birth
            const d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            $("#kt_datepicker_birth").flatpickr({
                defaultDate: month+"-"+day+"-"+(year-18),
                dateFormat: "m-d-Y",
                maxDate: month+"-"+day+"-"+(year-18)
            });
            $("#kt_datepicker_foundation, #kt_datepicker_startActivity").flatpickr({
                defaultDate: month+"-"+day+"-"+year,
                dateFormat: "m-d-Y"
            });
            $("#kt_daterangepicker_club, #kt_daterangepicker_team, #kt_daterangepicker_training").daterangepicker({
                dateFormat: "m-d-Y",
                maxDate: month+"-"+day+"-"+year
            });
            var heightSlider = document.querySelector("#kt_player_height_slider");
            var heightValue = document.querySelector("#kt_player_height_label");
            noUiSlider.create(heightSlider, {
                start: [$scope.formData.player.height],
                connect: true,
                range: {
                    "min": 150,
                    "max": 220
                }
            });
            heightSlider.noUiSlider.on("update", function (values, handle) {
                let value = Math.round(values[handle]);
                $scope.$apply(() => {
                  $scope.formData.player.height = value;
                });
                heightValue.innerHTML = value;
                if (handle) {
                    heightValue.innerHTML = value;
                }
            });
            var weightSlider = document.querySelector("#kt_player_weight_slider");
            var weightValue = document.querySelector("#kt_player_weight_label");
            noUiSlider.create(weightSlider, {
                start: [$scope.formData.player.weight],
                connect: true,
                range: {
                    "min": 80,
                    "max": 180
                }
            });
            weightSlider.noUiSlider.on("update", function (values, handle) {
                let value = Math.round(values[handle]);
                $scope.$apply(() => {
                  $scope.formData.player.weight = value;
                });
                weightValue.innerHTML = value;
                if (handle) {
                    weightValue.innerHTML = value;
                }
            });

            $('#kt_repeater_gallery').repeater({
                initEmpty: false,
                show: function () {
                    $(this).slideDown();
                    KTImageInput.createInstances();
                },
                hide: function (deleteElement) {
                    $(this).slideUp(deleteElement);
                }
            });
            $('#kt_repeater_youtube,#kt_repeater_palmares').repeater({
                initEmpty: false,
                show: function () {
                    $(this).slideDown();
                },
                hide: function (deleteElement) {
                    $(this).slideUp(deleteElement);
                }
            });

            // Phone
            Inputmask({
                "mask" : "(999) 999-9999"
            }).mask("#kt_club_phone");

            var inputTeams = document.querySelector("#kt_tagify_teams");
            new Tagify(inputTeams);

            window.document.dispatchEvent(new Event("DOMContentLoaded", {
              bubbles: true,
              cancelable: true
            }));
        });

        $scope.formDataCopy = angular.copy($scope.formData);
      }

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
      }

      $scope.selectType = function(_type) {
        $scope.formData.type = _type;
        $stateParams.type = _type
        actionSvc.goToAction(6, {
          type: $stateParams.type,
          step: '1'
        });
      }

      $scope.actionPrevious = function() {
        if ($scope.step>1) {
          localStorage.setItem("formData", JSON.stringify($scope.formData));
          $scope.step -= 1;
          actionSvc.goToAction(6, {
            type: $stateParams.type,
            step: $scope.step
          });
        }
      }

      $scope.actionNext = function() {
        let _maxStep = 0;
        let validForm = false;
        let stepToVerify = false;
        switch ($scope.formData.type) {
          case 'player':
            _maxStep = 7;
            if ($scope.step == 2) {
              stepToVerify = true;
              if ($scope.formData.player.firstName != '' &&
                  $scope.formData.player.lastName != '' &&
                  $scope.formData.player.gender != '' &&
                  $scope.formData.player.dateBirth != undefined &&
                  $scope.formData.player.countryBirth != '') {
                    validForm = true;
              };
            };
            if ($scope.step == 3) {
              stepToVerify = true;
              if ($scope.formData.player.clubs.length > 0) {
                    validForm = true;
              };
            };
            if ($scope.step == 4) {
              stepToVerify = true;
              if ($scope.formData.player.mainPosition != '' &&
                  $scope.formData.player.height > 0 &&
                  $scope.formData.player.weight > 0) {
                    validForm = true;
              };
            };
            if ($scope.step == 5) {
              stepToVerify = true;
              if ($scope.pictureH_FileNew != undefined) {
                    validForm = true;
              };
            };
            if ($scope.step == 6) {
              stepToVerify = true;
              if ($scope.formData.payment.billingPlan != '' &&
                  $scope.formData.payment.cardName != '' &&
                  $scope.formData.payment.cardNumber != '' &&
                  $scope.formData.payment.expMonth != '' &&
                  $scope.formData.payment.expMonth != '' &&
                  $scope.formData.payment.cvv != '') {
                    validForm = true;
              };
            };
            break;
          case 'club':
            _maxStep = 5;
            break;
          case 'agent':
            _maxStep = 4;
            break;
          case 'coach':
            _maxStep = 5;
            break;
        };
        if (((stepToVerify && validForm) || !stepToVerify) && $scope.step<_maxStep) {
          localStorage.setItem("formData", JSON.stringify($scope.formData));
          $scope.step += 1;
          actionSvc.goToAction(6, {
            type: $stateParams.type,
            step: $scope.step
          });
        }
        else if (!validForm) {
          mainSvc.showAlertByCode(202);
        };
      }

      $scope.isFileChange = function() {

      }

      $scope.partialSave = function() {
        $scope.formDataCopy = angular.copy($scope.formData);
        localStorage.setItem("formData", JSON.stringify($scope.formData));
        mainSvc.showAlertByCode(100);
      }

      $scope.enableSave = function() {
        let ret = angular.equals($scope.formData, $scope.formDataCopy);
        return !ret;
      }

      $scope.finishSave = function() {
        if (!$scope.formData.agree) {
          mainSvc.showAlertByCode(205);
          return false;
        };

        //Ajax send
        mainSvc.callService({
            url: 'profile/createNewProfile_'+$scope.formData.type,
            params: {
              'dataJson': JSON.stringify($scope.formData.player),
              'payment': JSON.stringify($scope.formData.payment),
              'agree': $scope.formData.agree
            },
            secured: true
        }).then(function (response) {
          if (response.code==0) {
            actionSvc.goToExternal(1); // go to home
          }
          else {
            mainSvc.showAlertByCode(response.code);
          }
        });
      }

      /* Clubs ------------ */

      $scope.addClub = function() {
        resetObjDataClub();
        const d = new Date().format('m/d/yyyy');
        $scope.formDataClub.rangeDate = d+' - '+d;
        $("#kt_modal_club").modal('show');
      }

      $scope.saveAddClub = function() {
        if ($scope.formDataClub.name == '' ||
        $scope.formDataClub.contract == '' ||
        $scope.formDataClub.country == '' ||
        $("#kt_daterangepicker_club").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        $scope.formDataClub.rangeDate = $("#kt_daterangepicker_club").val();
        $scope.formDataClub.id = $scope.formData.player.clubs.length + 1;
        $scope.formData.player.clubs.push (angular.copy($scope.formDataClub));
        $("#kt_modal_club").modal('hide');
      }

      $scope.saveEditClub = function() {
        if ($scope.formDataClub.name == '' ||
        $scope.formDataClub.contract == '' ||
        $scope.formDataClub.country == '' ||
        $("#kt_daterangepicker_club").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        $scope.formDataClub.rangeDate = $("#kt_daterangepicker_club").val();
        let index = $scope.formData.player.clubs.findIndex(x => x.id == $scope.formDataClub.id);
        $scope.formData.player.clubs[index] = angular.copy($scope.formDataClub);
        $("#kt_modal_club").modal('hide');
      }

      $scope.removeClub = function(idx) {
        $scope.formData.player.clubs.splice(idx, 1);
      }

      $scope.editClub = function(item) {
        $scope.formDataClub = angular.copy(item);
        $("#kt_modal_club").modal('show');
      }

      $scope.showContractType = function(id) {
        let item = $scope.lstContracts.find(x => x.id == id);
        return item.label;
      }

      $scope.showCountry = function(id) {
        let item = $scope.lstCountries.find(x => x.id == id);
        return item.label;
      }

      let resetObjDataClub = function() {
        $scope.formDataClub = {
          id: 0,
          name: '',
          contract: '1',
          country: '10',
          rangeDate: undefined,
          description: ''
        };
      }

      /* National Teams ------------ */

      $scope.addTeam = function() {
        resetObjDataTeam();
        const d = new Date().format('m/d/yyyy');
        $scope.formDataTeam.rangeDate = d+' - '+d;
        $("#kt_modal_team").modal('show');
      }

      $scope.saveAddTeam = function() {
        if ($scope.formDataTeam.type == '' ||
        $("#kt_daterangepicker_team").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        $scope.formDataTeam.rangeDate = $("#kt_daterangepicker_team").val();
        $scope.formDataTeam.id = $scope.formData.player.nationalTeams.length + 1;
        $scope.formData.player.nationalTeams.push (angular.copy($scope.formDataTeam));
        $("#kt_modal_team").modal('hide');
      }

      $scope.saveEditTeam = function() {
        if ($scope.formDataTeam.type == '' ||
        $("#kt_daterangepicker_team").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
        $scope.formDataTeam.rangeDate = $("#kt_daterangepicker_team").val();
        let index = $scope.formData.player.nationalTeams.findIndex(x => x.id == $scope.formDataTeam.id);
        $scope.formData.player.nationalTeams[index] = angular.copy($scope.formDataTeam);
        $("#kt_modal_team").modal('hide');
      }

      $scope.removeTeam = function(idx) {
        $scope.formData.player.nationalTeams.splice(idx, 1);
      }

      $scope.editTeam = function(item) {
        $scope.formDataTeam = angular.copy(item);
        $("#kt_modal_team").modal('show');
      }

      $scope.showTeamType = function(id) {
        let item = $scope.lstTeamsType.find(x => x.id == id);
        return item.label;
      }

      let resetObjDataTeam = function() {
        $scope.formDataTeam = {
          id: 0,
          type: '1',
          rangeDate: undefined,
          description: ''
        };
      }

      $scope.logOut = function() {
        mainSvc.callService({
            url: 'auth/logout'
        }).then(function (response) {
          authenticationSvc.logout();
          actionSvc.goToExternal(2); // go to login
        });
      }

      $scope.changeSaveCard = function() {
        const cb = document.querySelector('#chkSaveCard');
        $scope.formData.payment.saveCard=(cb.checked)?1:0;
      }

    }
]);