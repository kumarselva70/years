//var apiUrl = 'https://soixapps.com:9099/';
var apiUrl = 'https://soixapps.com:8088/';

var downloadUrl = 'https://soixapps.com/downloadPdf/';
var csv_text = [{name:"None",value:1},{name:"Advantx",value:2}];
//var file_format = '';
//var downloadUrl = 'http://23.253.62.197/downloadPdf/';
//var soixReportURL = "http://patint.bitnamiapp.com/soixdev/#/login";

var soixReportURL = "https://soixapps.com/soixreports/#/login";

angular.module('app', [
    'templates-app',
    'templates-common',
    'ngAnimate',
    'ngAria',
    'app.access',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.jq',
    'ui.bootstrap',
    'app.ctApp',
    'ui.select',
    'ui.mask',
    'angularFileUpload',
    'datatables',
    'pascalprecht.translate',
    'picklistapp'
])



.config(function myAppConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/access/signin');
    })
    .directive('restrict', function(authService, $state) {
        return {
            restrict: 'A',
            prioriry: 100000,
            scope: false,
            link: function() {
                // alert('ergo sum!');
            },
            compile: function(element, attr, linker) {
                //console.log(attr);
                var accessDenied = true;
                var user = authService.generateRoleData();

                var attributes = attr.access.split(" ");

                if (angular.isUndefined(user)) {
                    $state.go("access.signin");
                    return false;
                }
                for (var i in attributes) {
                    for (var r = 0; r < user.role.length; r++) {
                        if (user.role[r] == attributes[i]) {
                            accessDenied = false;
                        }
                    }

                }



                if (accessDenied) {
                    element.css('display', 'none');
                    //element.children().remove();
                    //element.remove();     
                }

            }
        };
    })

/*.directive('toggle', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      if (attrs.toggle=="tooltip"){
        $(element).tooltip();
      }
      if (attrs.toggle=="popover"){
        $(element).popover();
      }
    }
  };
})*/
    .directive('capitalize', [function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                /* Edited by Lavanya 12/6/2014*/
                var el = element[0];

                function clean(x) {
                    return x && x.toUpperCase();
                }

                modelCtrl.$parsers.push(function(val) {
                    var cleaned = clean(val);

                    // Avoid infinite loop of $setViewValue <-> $parsers
                    if (cleaned === val) {
                        return val;
                    }

                    var start = el.selectionStart;
                    var end = el.selectionEnd + cleaned.length - val.length;

                    // element.val(cleaned) does not behave with
                    // repeated invalid elements
                    modelCtrl.$setViewValue(cleaned);
                    modelCtrl.$render();

                    el.setSelectionRange(start, end);
                    return cleaned;
                });
                /*var capitalize = function (inputValue) {
                if (angular.isUndefined(inputValue))
                return;

                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                modelCtrl.$setViewValue(capitalized);
                modelCtrl.$render();

                }
                return capitalized;
                }
                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]); // capitalize initial value*/
            }
        };
    }])
    .service('authService', function($cookieStore, $localStorage) {
        var userAccess;
        return {
            getUser: function() {

                return userAccess;
            },
            setuser: function(user) {
                userAccess = user;
            },
            generateRoleData: function() {
                var user = {};
                var user_access = routingConfig.userRoles;
                var accessLevels = routingConfig.accessLevels;
                var user_details = $localStorage.userName; //$cookieStore.get('userName');

                if (!angular.isUndefined(user_details) && user_details !== null) {
                    user.role = accessLevels[user_access[user_details.is_super_user]]; //user_access[Service.user_roles];

                    return user;

                }
                /*this is resolved before the router loads the view and model*/
                /*...*/
            },
            encode64: function(input) {
                var keyStr = "ABCDEFGHIJKLMNOP" +
                    "QRSTUVWXYZabcdef" +
                    "ghijklmnopqrstuv" +
                    "wxyz0123456789+/" +
                    "=";

                input = escape(input);
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },
            decode64: function(input) {
                var keyStr = "ABCDEFGHIJKLMNOP" +
                    "QRSTUVWXYZabcdef" +
                    "ghijklmnopqrstuv" +
                    "wxyz0123456789+/" +
                    "=";

                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return unescape(output);
            }

        

        };
    })
    .service('popupservice', function($cookieStore, $localStorage) {

    })
     .service('medicalrecordsCopy', function($cookieStore, $localStorage) {

    })
     
    .run(['$rootScope', '$state', '$stateParams', '$http', '$cookieStore', 'authService', 'popupservice',
        function($rootScope, $state, $stateParams, $http, $cookieStore, authService, popupservice) {




            //authService.setuser(null);

        }
    ])

.controller('AppCtrl', ['$scope', '$rootScope', '$location', '$translate', '$localStorage', '$window', 'authService', '$state', '$cookieStore', 'popupservice', '$modal', function AppCtrl($scope, $rootScope, $location, $translate, $localStorage, $window, authService, $state, $cookieStore, popupservice, $modal) {

        
        $scope.app = {
            name: 'SOIX',
            version: '2.2.0',
            // for chart colors
            color: {
                primary: '#7266ba',
                info: '#23b7e5',
                success: '#27c24c',
                warning: '#fad733',
                danger: '#f05050',
                light: '#e8eff0',
                dark: '#3a3f51',
                black: '#1c2b36'
            },
            settings: {
                themeID: 1,
                navbarHeaderColor: 'bg-black',
                navbarCollapseColor: 'bg-white-only',
                asideColor: 'bg-white',
                headerFixed: true,
                asideFixed: false,
                asideFolded: false,
                asideDock: false,
                container: false
            }
        };


        /*$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                 
        });*/

        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

            
           // console.log(popupservice.medicalrecordsCopy);
            
            //console.log(popupservice.medicalrecords);


            //$scope.dif = _.difference(popupservice.medicalrecordsCopy , popupservice.medicalrecords);
            $scope.dif =  _.omit(popupservice.medicalrecords, function(v,k) { return popupservice.medicalrecordsCopy[k] === v; });
            
          //  console.log($scope.dif);
            if (!angular.isUndefined(popupservice.medicalrecords) && $localStorage.userName) {
               // var objkeys = Object.keys(popupservice.medicalrecords).length;
               var objkeys = Object.keys($scope.dif).length;
                

                if (objkeys > 0) {
                    event.preventDefault();

                    $scope.modalInstance = $modal.open({
                        template: '<div class="modal-content"><div class="modal-header">Save Notification<button type="button" class="close" ng-click = "close(0)"" data-dismiss="modal"></button></div><div class="modal-body">Are you sure you want to leave before saving your work? Remember you can save your work as a draft if it is not completed.</div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="yes(1)">Yes</button><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close(0)">Cancel</button></div></div>',
                        controller: "poupcontroler",
                        size: 'md'
                    });

                    $scope.modalInstance.result.then(function(selectedItem) {

                        if (selectedItem > 0) {
                            popupservice.medicalrecords = '';
                            $state.go(toState.name);
                        }

                    }, function() {

                    });
                    //

                }
            }


            if (fromState.url == '^') {
                if ($localStorage.userName) {
                  /*$localStorage.userName = null;
                  $localStorage.file_format = null;
                  $localStorage.monthFilter = '';
                  $localStorage.IDN = null;
                   $state.go("access.signin");*/
                }



            } else {
                var accessVal = toState.access;
                var access = routingConfig.accessLevels;
                var user_access = routingConfig.userRoles;
                var useraccess = ($localStorage.userName) ? $localStorage.userName : null; //$cookieStore.get('userName');//authService.getUser();
                if (!angular.isUndefined(useraccess) && useraccess !== null) {
                    var is_same = _.difference(accessVal, access[user_access[useraccess.is_super_user]]);

                    if (toState.access !== '*' && is_same.length > 0) {
                        event.preventDefault();
                    }
                } else {
                    // console.log("dss");
                }
            }

        });
  $scope.byePassLogin = function () {

            if($localStorage.userName)
            {
              var encodeStr = Math.round(new Date().getTime()/1000)+$localStorage.userName.name+"3948"+$localStorage.userName.id;
      //console.log($localStorage.userName.name);
                        
             var landingUrl = soixReportURL+"?API="+authService.encode64(encodeStr);
             $scope.landingUrl= landingUrl;
            }
             
    };
    //if($localStorage.userName){$scope.byePassLogin();}
    


        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
            $scope.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = $scope.app.settings;
        }
        $scope.$watch('app.settings', function() {
            if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                // aside dock and fixed must set the header fixed.
                $scope.app.settings.headerFixed = true;
            }
            // for box layout, add background image
            //$scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
            // save to local storage
            $localStorage.settings = $scope.app.settings;
        }, true);

        // angular translate
        $scope.lang = {
            isopen: false
        };
        $scope.langs = {
            en: 'English',
            de_DE: 'German',
            it_IT: 'Italian'
        };
        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
        $scope.setLang = function(langKey, $event) {
            // set the current lang
            $scope.selectLang = $scope.langs[langKey];
            // You can change the language during runtime
            $translate.use(langKey);
            $scope.lang.isopen = !$scope.lang.isopen;
        };

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

    }])
    .controller('poupcontroler', ['$modalInstance', '$scope', '$state', '$timeout', function($modalInstance, $scope, $state, $timeout) {
        $scope.close = function() {
            $modalInstance.close(0);
        };
        $scope.yes = function() {
            $modalInstance.close(1);
        };

    }]);