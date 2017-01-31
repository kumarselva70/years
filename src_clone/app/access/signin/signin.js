angular.module('access.signin', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  var access = routingConfig.accessLevels;
  $stateProvider.state('access.signin', {
    url: '/signin',
    views: {
      "accessNested": {
        controller: 'signinCtrl',
        templateUrl: 'access/signin/signin.tpl.html'
      }
    },
    data:{ pageTitle: 'Form Elements' },
    access: access.public
  });
})

.controller('signinCtrl', ['$rootScope','$scope','$http','$state','$timeout','$cookieStore','authService','$localStorage','$location',  function($rootScope,$scope,$http,$state,$timeout,$cookieStore,authService,$localStorage,$location) {

  $scope.user = {};

    //API Access starts

    if($location.$$url.substr(1).split('?').length > 1) {


        args = $location.$$url.substr(1).split('?');
        args1 = args[1];
       // console.log(args1);
        var tmp = args1.split(/=/); //tmp[0] has key not needed
        //console.log(tmp[1]);
        var inComingParse = authService.decode64(tmp[1]);
        var temp1 = inComingParse.split("3948");
        var UserID = temp1[1];
        var TTL = temp1[0].substr(0,10);
        var userName =   temp1[0].substr(10);

        var currentTimeSec = new Date().getTime()/1000; // in sec
        var TTLPlusFiveMin = Number(TTL) + (5 * 60);
        console.log("id: ",UserID," TTL: ",TTL," username= ",userName);
        if(currentTimeSec <TTLPlusFiveMin ) {
            $http({
                url: apiUrl + 'getCptTable?tableName=users&filter=where id ="' + UserID + '" limit 1&fields=*', //Your url will be like this.
                method: 'get',
                data: '',
                headers: {'Content-Type': 'application/json'}
            })
                .success(function (data) {

                    if (data[0].name.trim() == userName.trim()) {

                        $scope.user.email = data[0].username;
                        $scope.user.password = data[0].password;
                        $scope.login();

                    }
                });
        }else{

            $scope.error = true;
            $scope.errmsg = "API Link Expired !!!";
            /*$timeout(function() {
                $scope.error = false;
            }, 3000);*/

        }




    }

        // API access ends

    $scope.login = function()
    {
      //free4me
      //30daytrial
      $scope.loderStatus = 1;

      $http({
                url: apiUrl+'getCptTable?tableName=users&filter=where username ="'+$scope.user.email.replace(/["']/g, "")+'" and password="'+$scope.user.password.replace(/["']/g, "")+'" limit 1&fields=*', //Your url will be like this.
                method: 'get',
                data:'' ,
                headers: {'Content-Type': 'application/json'}
                })
              .success(function(data)
                {
                  $scope.loderStatus = 0;
                  if(data.length>0) 
                  {
                    
                    $scope.Listcenters = [];
                    // $cookieStore.put('userName',data[0]);
                      $localStorage.userName = data[0];
                     authService.setuser(data[0]);
                     $rootScope.is_super_user = data[0].is_super_user;
                     $rootScope.userName = data[0].username;
                     $rootScope.centerName = data[0].name;
                     $localStorage.IDN = data[0].hospital;
                      mixpanel.identify(data[0].username);
                     mixpanel.people.set({
                                  // "$email": data.record[0]['user_email'], // only special properties need the $
                                   "$last_login": new Date(), // properties can be dates...
                                   "User Type": data[0].is_super_user,
                                   "User Name": data[0].username,
                                   //"Employee Code": data.record[0].employee_code,
                                   "Idn3":data[0].hospital
                                   // feel free to define your own properties
                               });

                     mixpanel.track("Login", {
                                   "USER NAME": (angular.isDefined($localStorage.userName)) ? $localStorage.userName.name : "",
                                   "CENTER NAME": (angular.isDefined($localStorage.IDN) && $localStorage.IDN !== null) ? $localStorage.IDN : ''
                                   
                               });

                    // $cookieStore.get('userName');

                    $state.go('ctApp.dashboard');


                    angular.forEach(data, function(value, key) {
                      
                    //$scope.cptCodes.push({CODE:"("+value.CODE+") "+value.DESCRIPTION,DESCRIPTION:value.DESCRIPTION,BENCHMARK:value.BENCHMARK,CPTCODE:value.CODE});
                    //$scope.Listcenters.push({username:value.username,password:value.password});
                  });
                    

                  } 
                  else
                  {
                    $scope.error = true;
                    $scope.errmsg = "Invalid Login";
                    $timeout(function() {
                            $scope.error = false;
                        }, 3000);
                  }

                               
                });

    };
   

   
  }]);

