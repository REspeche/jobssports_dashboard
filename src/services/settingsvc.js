mainApp.factory('settingSvc',
['mainSvc', '$rootScope', '$q', 'BASE_URL', '$cookies', 'COOKIES',
  function (mainSvc, $rootScope, $q, BASE_URL, $cookies, COOKIES) {
      var _defered = $q.defer();
      var _promise = undefined;
      var _publicFunctions = {
        getSettings: getSettings,
        setSettings: setSettings
      };

      var _data = {
        pull: false
      };

      function getSettings() {
        if (!!$cookies.get(COOKIES.files.settings)) {
          var cookieStr = decodeURIComponent($cookies.get(COOKIES.files.settings).replace(/\+/g, '%20'));
          var cookieObjMain = angular.fromJson(cookieStr);
          var cookieObjLogin = undefined;
          if (!!$cookies.get(COOKIES.files.settings)) {
            cookieStr = decodeURIComponent($cookies.get(COOKIES.files.settings).replace(/\+/g, '%20'));
            cookieObjLogin = angular.fromJson(cookieStr);
          }
          _data = {
              pull: true
          };
          $rootScope.settings = _data;
          _defered.resolve(_data);
          return _defered.promise;
        }
        else {
          if (!_promise && !_data.pull) {
            _promise = _defered.promise;
            //llama al servicio de alertas
            mainSvc.callService({
              url: 'common/getSettings',
              secured: false
            }).then(function (response) {
              _data = {
                pull: true
              };
              var expireDate = new Date();
              expireDate.setHours(expireDate.getHours() + 24);
              $cookies.put(COOKIES.files.settings, angular.toJson(_data), {'expires': expireDate});
              $rootScope.settings = _data;
              _defered.resolve(_data);
            }).catch(function(err) {
              _defered.reject(_data);
            });
          }
          else {
            if (_data.pull) _defered.resolve(_data);
          }
        }
        return _promise;
      }

      function setSettings(formData) {

      }

      return _publicFunctions;
  }
]);
