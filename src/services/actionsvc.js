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
				'reload': reload
			};

			function getURL(action) {
				var retRoute = '';
				switch (action) {
					case 1: 	retRoute = 'panel'; break;
					case 2: 	retRoute = 'sign-in'; break;
					case 2.1: retRoute = "authentication/sign-in?endSession=1"; break;
					case 2.2: retRoute = "authentication/sign-in?endToken=1"; break;
					case 3: 	retRoute = 'reset-password'; break;
					case 4: 	retRoute = 'sign-up'; break;
					case 5: 	retRoute = 'verify-email'; break;
					case 6: 	retRoute = 'create-profile'; break;
					case 7: 	retRoute = 'select-profile'; break;
				};
				var arrRoutes = retRoute.split('/');
				$rootScope.itemRoute = arrRoutes[arrRoutes.length-1];
				return retRoute;
			};

			function goToAction(action, param) {
				if (!param) $state.go(getURL(action));
				else $state.go(getURL(action), param);
			};

			function goToExternal(action) {
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

			function reload() {
				$state.reload();
			}

			return _publicFunctions;
		}
]);
