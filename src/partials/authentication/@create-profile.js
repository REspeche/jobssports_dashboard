angular.module('mainApp').controller('createProfileController',
['$scope', '$rootScope', '$stateParams', 'mainSvc', 'actionSvc', 'authenticationSvc',
    function ($scope, $rootScope, $stateParams, mainSvc, actionSvc, authenticationSvc) {
      $scope.formData = {
        type: '',
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
          rangeDateStart: undefined,
          rangeDateEnd: undefined,
          degree: ''
        },
        payment: {
          billingPlan: '2',
          cardName: '',
          cardNumber: '',
          expMonth: '1',
          expYear: '2022',
          cvv: '',
          saveCard: 1
        },
        agree: false
      };
      $scope.logo_FileNew = undefined;
      $scope.countryPassport_FileNew = undefined;
      $scope.pictureH_FileNew = undefined;
      $scope.pictureGallery_FileNew = [];
      $scope.loadForm = false;
      $scope.editForm = false;

      $scope.formDataCopy = {};
      $scope.formDataClub = {
        id: 0,
        name: '',
        contract: '1',
        country: '10',
        rangeDateStart: undefined,
        rangeDateEnd: undefined,
        description: ''
      };
      $scope.formDataTeam = {
        id: 0,
        type: '1',
        rangeDateStart: undefined,
        rangeDateEnd: undefined,
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

        //load type
        if ($stateParams.type) {
          $scope.formData.type = $stateParams.type;
          $scope.step = 2;
        };

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
                        $scope.formData.player.countryBirth = value.id.toString();
                        $scope.formData.club.country = value.id.toString();
                        $scope.formData.agent.countryBirth = value.id.toString();
                        $scope.formData.coach.countryBirth = value.id.toString();
                      });
                    };
                  });
                };
            });
            $scope.loadForm = true;
          });
        }

        $( document ).ready(function() {
            //restrict date birth
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
            $('#kt_repeater_youtube').repeater({
                initEmpty: false,
                show: function () {
                    $(this).slideDown();
                },
                hide: function (deleteElement) {
                    $(this).slideUp(deleteElement);
                }
            });
            $('#kt_repeater_palmares').repeater({
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
      }

      $scope.actionPrevious = function() {
        if ($scope.step>1) {
          if ($scope.step==2) {
            actionSvc.goToAction(6, {
              type: ''
            });
          }
          else {
            $scope.step -= 1;
          };
        }
      }

      $scope.actionNext = function() {
        let _maxStep = 0;
        let validForm = false;
        let stepToVerify = false;
        if ($scope.step > 1) {
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
                if ($scope.formData.payment.billingPlan > 1 &&
                    $scope.formData.payment.cardName != '' &&
                    $scope.formData.payment.cardNumber != '' &&
                    $scope.formData.payment.expMonth != '' &&
                    $scope.formData.payment.expMonth != '' &&
                    $scope.formData.payment.cvv != '') {
                      validForm = true;
                }
                else {
                  validForm = true;
                };
              };
              break;
            case 'club':
              _maxStep = 5;
              if ($scope.step == 2) {
                stepToVerify = true;
                if ($scope.formData.club.name != '' &&
                    $scope.formData.club.country != '' &&
                    $scope.formData.club.dateFoundation != undefined) {
                      validForm = true;
                };
              };
              if ($scope.step == 3) {
                stepToVerify = true;
                if ($scope.formData.club.firstName != '' &&
                    $scope.formData.club.lastName != '' &&
                    $scope.formData.club.gender != '' &&
                    $scope.formData.club.dateBirth != undefined &&
                    $scope.formData.club.email != '') {
                      validForm = true;
                };
              };
              if ($scope.step == 4) {
                stepToVerify = true;
                if ($scope.formData.club.teams != '') {
                      validForm = true;
                };
              };
              break;
            case 'agent':
              _maxStep = 4;
              break;
            case 'coach':
              _maxStep = 5;
              break;
          };
        };
        if ($scope.step==1) {
          actionSvc.goToAction(6, {
            type: $scope.formData.type
          });
        }
        else {
          if (((stepToVerify && validForm) || !stepToVerify) && $scope.step<_maxStep) {
            $scope.step += 1;
          }
          else if (!validForm) {
            mainSvc.showAlertByCode(202);
          };
        };
      }

      $scope.fileSaveOnServer = function(fileToSave) {
        var filesUpload = [];
        if (fileToSave) {
          filesUpload.push(fileToSave);
          mainSvc.callService({
              url: 'profile/saveTempFile',
              params: {
                'usrId': $rootScope.userInfo.id
              },
              data: {
                files: filesUpload
              }
          }).then(function (response) {
            if (response.code==0) {
              return true;
            }
            else {
              return false;
            }
          });
        }
        else return false;
      }

      $scope.submitForm = function() {
        //Validations
        if (!$scope.formData.agree) {
          mainSvc.showAlertByCode(205);
          return false;
        };

        if ($scope.formData.type=="player") {
          //Get palmares
          $scope.pictureGallery_FileNew = [];
          $('[name^="kt_repeater_gallery"]').each(function( index ) {
            let filObj = $(this).prop('files');
            if (filObj) $scope.pictureGallery_FileNew.push(filObj[0]);
          });
          $scope.formData.player.videoGallery = [];
          $('[name^="kt_repeater_youtube"]').each(function( index ) {
            $scope.formData.player.videoGallery.push($(this).val());
          });
        };
        if ($scope.formData.type=="club") {
          //Get palmares
          $scope.formData.club.palmares = [];
          $('[name^="kt_repeater_palmares"]').each(function( index ) {
            $scope.formData.club.palmares.push($(this).val());
          });
        };

        //Ajax send
        var filesUpload = [];
        if ($scope.logo_FileNew) filesUpload.push({ 'logo': $scope.logo_FileNew });
        if ($scope.pictureH_FileNew) filesUpload.push({ 'pictureH': $scope.pictureH_FileNew });
        if ($scope.pictureGallery_FileNew.length>0) {
          for(var t=0;t<$scope.pictureGallery_FileNew.length;t++) {
            let key = 'pictureGallery'+t;
            let obj = {};
            obj[key] = $scope.pictureGallery_FileNew[t];
            filesUpload.push(obj);
          };
        };
        debugger;
        mainSvc.callService({
            url: 'profile/createNewProfile_'+$scope.formData.type,
            params: {
              'usrId': $rootScope.userInfo.id,
              'dataJson': JSON.stringify($scope.formData.player),
              'payment': JSON.stringify($scope.formData.payment),
              'agree': $scope.formData.agree
            },
            data: {
              files: filesUpload
            }
        }).then(function (response) {
          if (response.code==0) {
            let ret = angular.copy(response);
            switch ($scope.formData.type) {
              case 'player':
                $rootScope.userInfo.type = 2;
                $rootScope.userInfo.plaId = ret.plaId;
                break;
                case 'club':
                  $rootScope.userInfo.type = 3;
                  break;
                  case 'agent':
                    $rootScope.userInfo.type = 4;
                    break;
                    case 'coach':
                      $rootScope.userInfo.type = 5;
                      break;
            };
            angular.forEach(ret.images, function(item, key) {
              if (item.name=='logo') $rootScope.userInfo.logo = item.data;
            });
            authenticationSvc.saveLogin();
            actionSvc.goToAction(1); // go to home
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
        $scope.formDataClub.rangeDateStart = d;
        $scope.formDataClub.rangeDateEnd = d;
        $scope.formDataClub.action = 1;
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
        let index = $scope.formData.player.clubs.findIndex(x => x.id == $scope.formDataClub.id);
        $scope.formData.player.clubs[index] = angular.copy($scope.formDataClub);
        $("#kt_modal_club").modal('hide');
      }

      $scope.removeClub = function(idx) {
        $scope.formData.player.club[idx].action = 3;
      }

      $scope.editClub = function(item) {
        $scope.formDataClub = angular.copy(item);
        $scope.formDataClub.action = 2;
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
          rangeDateStart: undefined,
          rangeDateEnd: undefined,
          description: ''
        };
      }

      /* National Teams ------------ */

      $scope.addTeam = function() {
        resetObjDataTeam();
        const d = new Date().format('m/d/yyyy');
        $scope.formDataTeam.rangeDateStart = d;
        $scope.formDataTeam.rangeDateEnd = d;
        $("#kt_modal_team").modal('show');
      }

      $scope.saveAddTeam = function() {
        if ($scope.formDataTeam.type == '' ||
        $("#kt_daterangepicker_team").val() == '') {
          mainSvc.showAlertByCode(202);
          return false;
        };
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
          rangeDateStart: undefined,
          rangeDateEnd: undefined,
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

      $scope.onlyActive = function(item) {
        return item.action != 3;
      }
    }
]);
