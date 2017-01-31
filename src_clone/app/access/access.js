/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module('app.access', [
    'ui.router',
    'access.signin'

    //'access.signUp',
    //'access.employeeLogin',
   // 'access.forgotPassword',
   // 'access.resetPassword',
    //'access.inactivityRedirect',
    //'access.insyncAccess'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */ .config(['$stateProvider', function config($stateProvider) {
        //var access = routingConfig.accessLevels;
        $stateProvider.state('access', {
            url: '/access',
            views: {
                "main": {
                    controller: 'AccessCtrl',
                    //template: '<div ui-view="accessNested" class="fade-in-right-big smooth"></div>'
                   templateUrl: 'access/access.tpl.html'
                }
            },
            data: { pageTitle: 'signin' }
        });/*
         .state('access.forgotpwd', {
         url: '/forgotpwd',
         templateUrl: 'tpl/page_forgotpwd.html'
         })
         .state('access.activate', {
         url: '/activate/:userId',
         templateUrl: 'tpl/caretime/activateUser.html',
         resolve: {
         activateUser: function($http, $stateParams) {
         return $http.get(baseurl + '/rest/' + serviceName + '/signin/?app_name=' + appName + '&fields=*&filter=id=' + $stateParams.userId + '&include_count=true');
         }
         },
         controller: function($scope, $rootScope, activateUser) {
         $scope.activateUser = activateUser;
         //console.log(activateUser);
         }
         })
         .state('access.emplogin', {
         url: '/emplogin/:empId',
         templateUrl: 'tpl/caretime/employeeLogin.html',
         resolve: {
         employeeName: function($http, $stateParams) {
         return $http.get(baseurl + '/rest/' + serviceName + '/agency_employees/?app_name=' + appName + '&fields=username,access_code&filter=id=' + $stateParams.empId + '&include_count=true');
         }
         },
         controller: function($scope, $rootScope, employeeName) {
         $scope.employeeName = employeeName.data.record[0].username;
         $scope.employee_code = employeeName.data.record[0].access_code;
         }
         });*/
        // Schedule;
    }])
/**
 * And of course we define a controller for our route.
 */
    .controller('AccessCtrl', ["$scope", function($scope){

      //  Auth.userInfo = {};
    }]);