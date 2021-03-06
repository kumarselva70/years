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
angular.module( 'app.ctApp', [
  'ui.router',
  'ctApp.elements',
  'ctApp.ui_grid',
  'ctApp.fileupload',
  'ctApp.tablestatic',
  'ctApp.dashboard',
  'ctApp.ProcedureGroups',
  'ctApp.uploaddata'

])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'ctApp', {
    abstract :true,
    url: '/app',
    views: {
      "main": {
        controller: 'CtAppCtrl',
        templateUrl: 'ct-app/ct-app.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'CtAppCtrl', function HomeController( $scope ,$state,$cookieStore,$localStorage,$timeout) {
$timeout(function(){
$scope.file_format = (angular.isDefined($localStorage.file_format) && $localStorage.file_format!==null)?Number($localStorage.file_format):"";

},800);


  $scope.logout = function()
  {
    $localStorage.IDN = null;
    $localStorage.userName = null;
    $localStorage.monthFilter = '';
    $localStorage.file_format = '';
    $state.go("access.signin");
  };
    $scope.toggleclass = function()
      {
        $('.app-aside').toggleClass('hidden-xs');
      };
      $scope.togglesetting = function()
      {
          console.log("dfsf");
        //$('.app-aside').toggleClass('hidden-xs');
      };
  
})

;


