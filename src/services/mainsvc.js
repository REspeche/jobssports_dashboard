mainApp.factory('mainSvc',
['BASE_URL', '$rootScope', '$http', '$q', '$timeout', 'CONSTANTS', 'actionSvc', '$translate', '$cookies', 'COOKIES',
		function (BASE_URL, $rootScope, $http, $q, $timeout, CONSTANTS, actionSvc, $translate, $cookies, COOKIES) {

			var _paramSvc = {
				path: '',
				version: 1,
				url: '',
				params: {},
				data: undefined,
				method: 'post',
				secured: BASE_URL.secured, //[true:default]
				timeout: CONSTANTS.timeout_ajax,
				concatURL: true,
				isFileResponse: false,
				showMessage: true
			};

			toastr.options = {
				"closeButton": true,
				"positionClass": "toast-bottom-right",
				"preventDuplicates": true
			};

			var _publicFunctions = {
				'callService': callService,
				'showAlert': showAlert,
				'showAlertByCode': showAlertByCode,
				'showModal': showModal,
				'getJson': getJson
			};

			function runCallService(paramReq) {
				var requestTimeout = $timeout(function () {
					if (paramReq.showMessage) showAlert().notifyWarning($translate.instant('MSG_REQUEST_TIME_OUT'));
				}, paramReq.timeout);
				var defered = $q.defer();
				var promise = defered.promise;
				var headers = (paramReq.secured && $rootScope.userInfo) ? {
					'Content-Type': (paramReq.data) ? undefined : 'application/json',
					'x-access-token': $rootScope.userInfo.token
				} : {
					'Content-Type': (paramReq.data) ? undefined : 'application/json'
				};
				$rootScope.isBusy = true;
				$http({
					'url': paramReq.path + paramReq.url,
					'method': paramReq.method,
					'params': (!paramReq.params.usrId && $rootScope.userInfo)?Object.assign({}, {'usrId':$rootScope.userInfo.usrId}, paramReq.params):paramReq.params,
					'data': paramReq.data,
					'headers': headers,
					'cache': false,
					'encoding': null,
					'timeout': requestTimeout,
					'transformRequest': (paramReq.data)?function (data, headersGetter) {
					    var formData = undefined;
							if (data) {
								formData = new FormData();
								if (data.fields) {
									angular.forEach(data.fields, function(item, key){
										formData.append(key, item);
									});
								}
								if (data.files && data.files.length > 0) {
									for (var i = 0; i < data.files.length; i++) {
										let key = Object.keys(data.files[i])[0];
										let value = data.files[i][key];
										formData.append(key, value);
									}
								}
								if (data.gallery && data.gallery.length > 0) {
									for (var i = 0; i < data.gallery.length; i++) {
										formData.append("gallery[" + i + "]", data.gallery[i]);
									}
								}
							}
					    return formData;
					}:angular.identity
				}).then(function (response) {
					var processMesage = function(response) {
						var status = (response.data.code)?parseInt(response.data.code):0;
						if (status > 0 && status < 400) { // 1 and 399
							if (paramReq.showMessage)  showAlertByCode(status);
							return (status >= 300 && status < 400) ? false : true; //error
						};
					}
					$timeout.cancel(requestTimeout);
					$rootScope.isBusy = false;
					if (response.status == 200) {
						if (paramReq.isFileResponse) defered.resolve(response.data);
						else {
							if (response.data.code > 0) {
								if (response.data.data && !response.data.data.code) response.data.data.code = response.data.code;
								if (processMesage(response)) defered.resolve(response.data.data);
								else defered.reject(response.data.data);
							} else defered.resolve(response.data.data);
						}
					} else {
						if (paramReq.showMessage) showAlertByCode(301);
						defered.reject(undefined);
					}
				}).catch(function (err) {
					$rootScope.isBusy = false;
					if (err.status == 401 && err.data.code == 309) {
						$cookies.remove(COOKIES.files.main);
						actionSvc.goToExternal(2.2);
					}
					else if (err.status != -1) {
						if (paramReq.showMessage) showAlertByCode(300);
					}
					defered.reject(undefined);
				});
				return promise;
			}

			//Public Functions
			function callService(paramSvc) {
				var version = '';
				var p = Object.assign({}, _paramSvc, paramSvc);
				if (p.version!='') version = '/v' + p.version;
				if (p.concatURL) p.path = changeProtocolSSL(BASE_URL.api) + version + '/' + ((p.secured) ? 'secured/' : '');
				return runCallService(p);
			}

			// Alerts
			function showAlert() {
				toastr.clear();
				return {
					notifySuccess: function (msg) {
						if (msg) toastr.success(msg);
					},
					notifyError: function (msg) {
						if (msg) toastr.error(msg);
					},
					notifyWarning: function (msg) {
						if (msg) toastr.warning(msg);
					},
					notifyInfo: function (msg) {
						if (msg) toastr.info(msg);
					}
				};
			}

			function showAlertByCode(code, callBackFunction) {
				toastr.clear();
				let msg = $translate.instant('MSG_COD'+code);
				let iconStr = undefined;
				if (code >= 0 && code < 100) toastr.info(msg);
				if (code >= 100 && code < 200) iconStr = 'info';
				if (code >= 200 && code < 300) iconStr = 'warning';
				if (code >= 300 && code < 400) iconStr = 'error';
				if (iconStr) {
					showModal({
						icon: iconStr,
						text: msg
					}, callBackFunction);
				}
			}

			function showModal(customModalOptions, callBackFunction) {
					var p = Object.assign({}, {
							text: 'Do you want to continue with this action?',
							icon: 'error',
							confirmButtonText: 'Close',
							customClass: {
								confirmButton: "btn btn-primary",
								cancelButton: "btn btn-secondary"
							}
					}, customModalOptions);
					Swal.fire(p).then((result) => {
					  if (result.isConfirmed && callBackFunction) callBackFunction();
					});
			}

			function getJson(filePath) {
				var defered = $q.defer();
				var promise = defered.promise;
				$http({
					'url': filePath,
					'method': 'GET'
				}).then(function (response) {
					defered.resolve(response.data);
				}).catch(function (err) {
					defered.reject(undefined);
				});
				return promise;
			}

			return _publicFunctions;
		}
]);
