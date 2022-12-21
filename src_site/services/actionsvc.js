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
					case 1: 	retRoute = 'home'; break;
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
