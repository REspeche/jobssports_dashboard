mainApp.factory('actionSvc',
['$state', '$rootScope', 'BASE_URL',
		function ($state, $rootScope, BASE_URL) {
			var _publicFunctions = {
				'goToAction': goToAction,
				'goToExternal': goToExternal,
				'goToNewTab': goToNewTab,
				'getURL': getURL,
				'goToDashboard': goToDashboard,
				'goToSite': goToSite,
				'reload': reload
			};

			function getURL(action) {
				var retRoute = '';
				switch (action) {
					//Dashboard
					case 0: 	retRoute = 'verify-authentication'; break;
					case 1: 	retRoute = 'panel'; break;
					case 2: 	retRoute = 'sign-in'; break;
					case 2.1: retRoute = "sign-in?endSession=1"; break;
					case 2.2: retRoute = "sign-in?endToken=1"; break;
					case 3: 	retRoute = 'reset-password'; break;
					case 4: 	retRoute = 'sign-up'; break;
					case 5: 	retRoute = 'verify-email'; break;
					case 6: 	retRoute = 'create-profile'; break;
					case 7: 	retRoute = 'account'; break;
					case 8: 	retRoute = 'policy'; break;
					case 8.1: retRoute = 'policySecure'; break;
					case 9: 	retRoute = 'contact'; break;
					case 9.1: retRoute = 'contactSecure'; break;
					case 10:  retRoute = 'clubOffers'; break;

					//Site
					case 101: retRoute = BASE_URL.site+'home'; break;
					case 102: retRoute = BASE_URL.site; break;
					case 103: retRoute = BASE_URL.oldSite; break;
					case 104: retRoute = BASE_URL.dashboard; break;
					case 105: retRoute = BASE_URL.oldSite+'work-with-us/'; break;
				};
				return retRoute;
			};

			function goToAction(action, param) {
				if ($rootScope.userInfo && $rootScope.userInfo.testMode==0 && (action==1 || action==6 || action==7)) {
					goToSite(101,undefined,false);
					return false;
				};
				if (!param) $state.go(getURL(action));
				else $state.go(getURL(action), param);
			};

			function goToExternal(action) {
				if ($rootScope.userInfo && $rootScope.userInfo.testMode==0 && (action==1 || action==6 || action==7)) {
					goToSite(101,undefined,false);
					return false;
				};
				$state.go('redirect-external', {
					page: getURL(action)
				});
			};

			function goToNewTab(action, param) {
				$state.goNewTab(getURL(action), (param)?param:{});
			};

			function goToDashboard(action, param, newTab) {
				$state.goDashboard(getURL(action), (param)?param:{}, (newTab)?true:false);
			};

			function goToSite(actionOrUrl, param, newTab) {
				if (Number(actionOrUrl)===actionOrUrl) {
					$state.goSite(getURL(actionOrUrl), (param)?param:{}, (newTab)?true:false);
				}
				else {
					$state.goSite(actionOrUrl, (param)?param:{}, (newTab)?true:false);
				};
			};

			function reload() {
				$state.reload();
			}

			return _publicFunctions;
		}
]);
