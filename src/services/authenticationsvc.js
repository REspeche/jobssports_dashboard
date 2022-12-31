mainApp.factory('authenticationSvc',
['COOKIES', '$cookies', '$rootScope', 'mainSvc', 'BASE_URL',
  function (COOKIES, $cookies, $rootScope, mainSvc, BASE_URL) {
      var window_id = undefined;
      var publicFunctions = {
        saveLogin: saveLogin,
        login: login,
        verifyLogin: verifyLogin,
        logout: logout,
        logoutRefresh: logoutRefresh,
        getUserInfo: getUserInfo,
        updateUserInfo: updateUserInfo
      };

      var _data = {};
      //loginData
      var _dataDefault = {
        isLogin         : false,
        type            : 1,
        typeStr         : '',
        usrId           : 0,
        plaId           : 0,
        cluId           : 0,
        ageId           : 0,
        coaId           : 0,
        name            : '',
        email           : undefined,
        token           : undefined,
        logo            : '',
        subscription    : 1,
        testMode        : 0,
        linkGoogle      : 0
      };

      var printObject = function (_isLogin, _param) {
        //loginData
        return {
          isLogin         : _isLogin,
          type            : _param.type,
          typeStr         : _param.typeStr,
          usrId           : _param.usrId,
          plaId           : _param.plaId,
          cluId           : _param.cluId,
          ageId           : _param.ageId,
          coaId           : _param.coaId,
          name            : _param.name,
          email           : _param.email,
          token           : _param.token,
          logo            : _param.logo,
          subscription    : _param.subscription,
          testMode        : _param.testMode,
          linkGoogle      : _param.linkGoogle
        };
      }

      function updateUserInfo(userInfo) {
        $rootScope.userInfo = saveLogin(userInfo);
      }

      function saveLogin(response) {
        if (!response) _data = angular.copy($rootScope.userInfo);
        else {
          _data = printObject(true, response);
          var expireDate = undefined;
          if (_data.rememberLogin==true) {
            expireDate = new Date();
            expireDate.setYear(expireDate.getFullYear() + 1);
          }
          $rootScope.userInfo = _data;
        }
        $cookies.put(COOKIES.files.main, angular.toJson(_data), (expireDate)?{'expires': expireDate}:{});
        return _data;
      }

      function login(updateScope) {
        if (!!$cookies.get(COOKIES.files.main)) {
          var cookieStr = decodeURIComponent($cookies.get(COOKIES.files.main).replace(/\+/g, '%20'));
          var cookieObjMain = angular.fromJson(cookieStr);
          _data = printObject(true, cookieObjMain);
          if (cookieObjMain.tabRefreshed) $cookies.put(COOKIES.files.main, angular.toJson(_data));
          if (updateScope) $rootScope.userInfo = _data;
        }
        else {
          _data = printObject(false, _dataDefault);
        }
        return _data;
      }

      function verifyLogin() {
        return (!!$cookies.get(COOKIES.files.main));
      }

      function logout(updateScope) {
        $cookies.remove(COOKIES.files.main);
        _data = printObject(false, _dataDefault);
        if (updateScope) $rootScope.userInfo = _data;
      }

      function logoutRefresh() {
        if (_data && _data.isLogin && !_data.rememberLogin) {
          var expireDate = undefined;
          expireDate = new Date();
          expireDate.setSeconds(expireDate.getSeconds() + 5); //5 seconds
          _data.tabRefreshed = true;
          $cookies.put(COOKIES.files.main, angular.toJson(_data), (expireDate)?{'expires': expireDate}:{});
        }
      }

      function getUserInfo() {
        return _data;
      }

      return publicFunctions;
  }
]);
