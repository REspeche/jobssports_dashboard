mainApp.factory('actionSvc',
['$state', '$rootScope',
		function ($state, $rootScope) {
			var _publicFunctions = {
				'goToAction': goToAction,
				'goToExternal': goToExternal,
				'goToNewTab': goToNewTab,
				'getURL': getURL,
				'goToDashboard': goToDashboard,
				'goToSite': goToSite,
				'goToExternalSite': goToExternalSite,
				'reload': reload
			};

			function getURL(action) {
				var retRoute = '';
				switch (action) {
					case 0: 	retRoute = 'verify-authentication'; break;
					case 1: 	retRoute = 'panel'; break;
					case 2: 	retRoute = 'sign-in'; break;
					case 2.1: retRoute = "authentication/sign-in?endSession=1"; break;
					case 2.2: retRoute = "authentication/sign-in?endToken=1"; break;
					case 3: 	retRoute = 'reset-password'; break;
					case 4: 	retRoute = 'sign-up'; break;
					case 5: 	retRoute = 'verify-email'; break;
					case 6: 	retRoute = 'create-profile'; break;
					case 7: 	retRoute = 'account'; break;
					case 8: 	retRoute = 'policy'; break;
					case 9: 	retRoute = 'contact'; break;

					case 100: retRoute = 'https://jobs-sports.com/'; break;
					case 101: retRoute = 'https://old.jobs-sports.com/privacy-policy/'; break;
					case 102: retRoute = 'https://old.jobs-sports.com/contact/'; break;
					case 103: retRoute = 'https://old.jobs-sports.com/work-with-us/'; break;
				};
				return retRoute;
			};

			function goToAction(action, param) {
				if (action==1 || action==6 || action==7) {
					goToSite(100,undefined,false);
					return false;
				};
				if (!param) $state.go(getURL(action));
				else $state.go(getURL(action), param);
			};

			function goToExternal(action) {
				if (action==1 || action==6) {
					goToSite(100,undefined,false);
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

			function goToSite(action, param, newTab) {
				$state.goSite(getURL(action), (param)?param:{}, (newTab)?true:false);
			};

			function goToExternalSite(url, newTab) {
				$state.goSite(url, {}, (newTab)?true:false);
			};

			function reload() {
				$state.reload();
			}

			return _publicFunctions;
		}
]);
