angular.module('ctApp.dashboard', [
    'ui.router'
])

.config(function config($stateProvider) {
    var access = routingConfig.accessLevels;
    $stateProvider.state('ctApp.dashboard', {
        url: '/dashboard/:IDN',
        views: {
            "appNested": {
                controller: 'DashboardCtrl',
                templateUrl: 'ct-app/dashboard-v1/dashboard-v1.tpl.html'
            }
        },
        data: {
            pageTitle: 'Dashboard'
        },
        access: access.public
    });
})

.controller('DashboardCtrl', ['$scope', '$http', 'DTOptionsBuilder', '$localStorage','$stateParams','$timeout','authService','$window',function($scope, $http, DTOptionsBuilder, $localStorage,$stateParams,$timeout,authService,$window) {
    $scope.idnValue = '';
    $scope.idnValueCondition = '';

    $scope.statuscounts = 0;
    $scope.statuscnt = 0;
    $scope.centecame = 0;
    $scope.created_onFilter = '';

    $scope.userDetals = $localStorage.userName;
    if (angular.isUndefined($scope.userDetals) || $scope.userDetals === null) {
        return false;
    }
    $scope.CenterName = $localStorage.IDN;

    mixpanel.track("Dash Board", {
                                   "USER NAME": (angular.isDefined($localStorage.userName)) ? $localStorage.userName.name : "",
                                   "CENTER NAME": (angular.isDefined($localStorage.IDN) && $localStorage.IDN !== null) ? $localStorage.IDN : ''
                                   
                               });

    

    if ($stateParams.IDN!=='' || $localStorage.monthFilter!=='') {

        $scope.idnValue = "where IDN3 = '" + $localStorage.IDN + "' ";
        
        $scope.CenterName = $stateParams.IDN ;
        if($stateParams.IDN!=='')
        {
            $scope.centecame = 1; 
            $scope.cnter = $localStorage.IDN;  
            $scope.idnValueCondition = "where IDN3 = '" + $localStorage.IDN + "' ";
        }
        

    }

    $scope.byePassLogin = function () {

        
            // console.log( $scope.userDetals);
            //ttl = 10 char 
            //nmae and id seprated yb 3948 
            //encode ttlname3948id
              var encodeStr = Math.round(new Date().getTime()/1000)+$scope.userDetals.name+"3948"+$scope.userDetals.id;
             //console.log(Api.encode64(encodeStr));
            // console.log($scope.userData);
           //$window.location.href
            
             var landingUrl = soixReportURL+"?API="+authService.encode64(encodeStr);
             $scope.landingUrl= landingUrl;
             // $window.open(landingUrl, "_blank"); 
             //console.log(Math.round(new Date().getTime()/1000));
             //console.log(Math.round(new Date().getTime()));

           //  console.log($scope.userDataM );
           // $location.path('special-reports');
        
        

    };
    $scope.byePassLogin();

    if ($scope.userDetals.hospital !== 'ALL' && $stateParams.IDN==='' && $scope.userDetals.hospital !== null) {


        if($scope.userDetals.is_super_user == 1){

        }else {
            $scope.idnValue = "where IDN3 = '" + $localStorage.IDN + "' ";
            $scope.idnValueCondition = "where IDN3 = '" + $localStorage.IDN + "' ";
        }
        
    }

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(10)
        .withOption('order', [1, 'desc']);
    $scope.dtOptions.searching = false;
    $scope.dtOptions.bPaginate = false;
    $scope.dtOptions.bInfo = false;



    var lastSixMonth = moment().subtract(6, 'months').date(1).format("YYYY-MM-DD");
    var lstyr = moment().format('YYYY');
    var lastYearFstDay = moment(lstyr + '-01-01').subtract(12, 'months').date(1).format("YYYY-MM-DD");
    var lastYearLastDay = moment(lstyr + '-12-01').subtract(12, 'months').endOf('month').format('YYYY-MM-DD');

    var lastQuterMonth = moment().subtract(3, 'months').date(1).format("YYYY-MM-DD");

    var lastMonthfstDay = moment().subtract(1, 'months').date(1).format("YYYY-MM-DD");
    var currentMonthfstDay = moment().subtract(0, 'months').date(1).format("YYYY-MM-DD");
    var currentMonthLastDay = moment().subtract(0, 'months').endOf('month').format('YYYY-MM-DD');

    var lastMonthLastDay = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');

    $scope.findIndexInData = function(data, property, value) {
        var result = -1;
        if (angular.isArray(data)) {
            data.some(function(item, i) {
                if (angular.uppercase(item[property]) === value) {
                    result = i;
                    return true;
                }
            });
            return result;
        }
    };

    $scope.dashBoardDataUpdate = function() {

        $scope.medRecordwithdrans = '';
        $scope.medRecordStatus = {};
        $scope.medRecordStatus.draft = 0;
        $scope.medRecordStatus.total = 0;
        $scope.totalpantPersentge = 0;
        $scope.patintStatus = {};
        $scope.patintStatus.total = 0;
        $scope.patintStatus.draft = 0;
        $scope.centersCount = '';
        $scope.MedRecordMaxCount = [];
        $scope.TopTenCenters = [];
        $scope.TopTenProcedures = [];
        $scope.lastBOP = {};
        $scope.lastcretedON = {};
        $scope.patnInteview = 0;
        $scope.lastBOP = '-';
        $scope.lastcretedON = '-';

        $http({
                url: apiUrl + "getCptTable?tableName=medrecidn3&filter=" + $scope.idnValue + " GROUP BY status &fields=DOP,created_on,status, COUNT(*) as statuscounts,MAX(created_on) as maxCreatDate,MAX(created_on) as maxDateDop",
                method: 'get',
                data: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(datamed) {
                
                if (angular.isArray(datamed) && datamed.length > 0) {

                    
                    $scope.medRecordStatus.draft = (angular.isDefined(datamed[0].statuscounts) && datamed[0].status==-1) ? datamed[0].statuscounts : 0;
                    
                        $scope.medRecordStatus.total = (angular.isDefined(datamed[datamed.length-1])) ? datamed[datamed.length-1].statuscounts : datamed[0].statuscounts;

                    var tst = $scope.medRecordStatus.total + $scope.medRecordStatus.draft;

                    $scope.totalpantPersentge = ($scope.medRecordStatus.total / tst) * 100;

                    $scope.lastBOP = (datamed[datamed.length-1].maxDateDop)?moment(datamed[datamed.length-1].maxDateDop).format("MM-DD-YYYY"):"-";

                    $scope.lastcretedON = (datamed[datamed.length-1].maxCreatDate!==null)?moment(datamed[datamed.length-1].maxCreatDate).format("MM-DD-YYYY"):"-";

                    $scope.statuscnt = '';

                }
            });

        $http({
                url: apiUrl + "getCptTable?tableName=medrecidn3&filter=" + $scope.idnValue + "&fields=DISTINCT IDN3",
                method: 'get',
                data: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(datamed) {
                
                $scope.medRecordwithdrans = 0;
                $scope.MedRecordIdn3 = [];
                if (datamed.length > 0) {

                    $scope.medRecordwithdrans = datamed.length;

                    angular.forEach(datamed, function(value, key) {
                        if (value.IDN3 !== null) {
                            $scope.MedRecordIdn3.push("'" + value.IDN3 + "'");
                        }

                    });
                
                if($scope.MedRecordIdn3.length>0)
                {
                   
                  $http({
                        url: apiUrl + "getCptTable?tableName=patint2&filter=where IDN3 IN(" + $scope.MedRecordIdn3.join(',') + ") " +$scope.created_onFilter +" GROUP BY status &fields=IDN3,status, COUNT(*) as statuscounts",
                        method: 'get',
                        data: '',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .success(function(datapatnt) {
                        
                        if (angular.isArray(datapatnt) && datapatnt.length > 0) {
                            $scope.patintStatus.total = (datapatnt[0].status==1) ? datapatnt[0].statuscounts : (typeof datapatnt[1] !== 'undefined')?datapatnt[1].statuscounts:0;
                            $scope.patintStatus.draft = (angular.isDefined(datapatnt[0]) && datapatnt[0].status==-1) ? datapatnt[0].statuscounts : 0;


                    $scope.patnInteview = ($scope.patintStatus.total / $scope.medRecordStatus.total) * 100;
                    
                      if(isNaN($scope.patnInteview))
                      {
                        $scope.patnInteview = 0;
                      }
                            $scope.statuscounts = '';
                        }

                    });
                }
            }
                
            });

        $http({
                url: apiUrl + "getCptTable?tableName=idndetails&filter= " + $scope.idnValueCondition + " GROUP BY IDN3 &fields=IDNNAME,IDN3, COUNT(IDN3) as centerscounts",
                method: 'get',
                data: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(datacenters) {
                if($scope.userDetals.hospital !== 'ALL' || $stateParams.IDN!=='')
                {
                    if(datacenters.length>0)
                    {
                        $scope.CenterName = (angular.isDefined(datacenters[0]))?datacenters[0].IDNNAME+" ("+""+datacenters[0].IDN3+")":$stateParams.IDN;
                    }
                        
                }
                
                $scope.centersCount = datacenters.length;

            });

        //COUNT(IDN3) as IDN3counts

        /// TOP 10 CENTERS  Start 


        $http({
                url: apiUrl + "maxcount?tableName=medrecidn3&filter=" + $scope.idnValue + " and IDN3 !='' GROUP BY IDN3 order by count(IDN3)  asc  &fields=DOP,created_on,status,IDN3, count(IDN3) as medTotal ,sum(status = 1) as medcomp,sum(patient_int = '1') as patient_intcomp",
                method: 'get',
                data: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(maxCount) {

                $scope.MedRecordMaxCount = [];
                $scope.TopTenCenters = [];
                
            if(maxCount!=='1')
            {
               // console.log(maxCount.length );
                angular.forEach(maxCount, function(value, key) {
                    $scope.MedRecordMaxCount.push("'" + value.IDN3 + "'");
                });

                $http({
                        url: apiUrl + "maxcount?tableName=patint2&filter= where IDN3 IN(" + $scope.MedRecordMaxCount.join(',') + ") " +$scope.created_onFilter +" GROUP BY IDN3 order by IDN3 asc &fields=status,IDN3, count(IDN3) as patint2Total ,sum(status = 1) as pantcomp",
                        method: 'get',
                        data: '',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .success(function(patint2Countss) {
                        $scope.MedRecordPAtntCount = [];
                        angular.forEach(maxCount, function(value, key) {
                            $scope.MedRecordPAtntCount.push("'" + value.IDN3 + "'");
                        });
                        var patint2Total = 0;
                        var pantcomp = 0;
                        $http({
                                url: apiUrl + "getCptTable?tableName=idndetails&filter=where IDN3 IN(" + $scope.MedRecordPAtntCount.join(',') + ") order by IDN3 asc &fields=IDN3,IDNNAME,id,PATINT",
                                method: 'get',
                                data: '',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .success(function(datacenters) {
                                $scope.TopTenCenters = [];
                               // console.log(datacenters.length );
                                if (patint2Countss.length > 0) {

                                    angular.forEach(datacenters, function(value, key) {

                                        var totalIndexdatamedical = $scope.findIndexInData(maxCount, 'IDN3', angular.uppercase(value.IDN3));

                                        var totalIndexdatapatnt = $scope.findIndexInData(patint2Countss, 'IDN3', angular.uppercase(value.IDN3));
                                        if (angular.isDefined(patint2Countss[totalIndexdatapatnt])) {
                                            patint2Total = patint2Countss[totalIndexdatapatnt].patint2Total;
                                            pantcomp = patint2Countss[totalIndexdatapatnt].pantcomp;
                                        }
                                        var cerdate = 0;
                                          if(angular.isDefined(maxCount[totalIndexdatamedical] && maxCount[totalIndexdatamedical].created_on!=='null'))
                                          {
                                            cerdate = maxCount[totalIndexdatamedical].created_on;
                                          }
                                          
                                        $scope.TopTenCenters.push({
                                            center: angular.uppercase(value.IDN3),
                                            centerName: value.IDNNAME+"("+angular.uppercase(value.IDN3)+")",
                                            DOP: (angular.isDefined(maxCount[totalIndexdatamedical]))?moment(maxCount[totalIndexdatamedical].DOP).format("MM-DD-YYYY"):'-',
                                            medTotalCount: angular.isDefined(maxCount[totalIndexdatamedical]) ? maxCount[totalIndexdatamedical].medTotal : 0,
                                            patntTotalCount: patint2Total,
                                            //patntcomp: pantcomp,
                                            patntcomp: angular.isDefined(maxCount[totalIndexdatamedical]) ? maxCount[totalIndexdatamedical].patient_intcomp : 0,
                                            medcomp: angular.isDefined(maxCount[totalIndexdatamedical]) ? maxCount[totalIndexdatamedical].medcomp : 0,
                                            createdOn:  (cerdate!==null && angular.isDefined(maxCount[totalIndexdatamedical]))? moment(maxCount[totalIndexdatamedical].created_on).format("MM-DD-YYYY") : '-'
                                        });
                                        
                                       });
                                       var TopTenCenters = $scope.TopTenCenters;
                                            $scope.TopTenCentersAsc = TopTenCenters.sort(function(a,b) {return (a.center > b.center) ? 1 : ((b.center > a.center) ? -1 : 0);} ); 
                                        //$scope.lastBOP = $scope.TopTenCenters[$scope.TopTenCenters.length-1];
                                        //$scope.lastcretedON = $scope.TopTenCenters[$scope.TopTenCenters.length-1];
                                      }
                                      

                           }); //idndetails table 
                    }); //patnt2 table 
              }//maxCount if loop


            }); //medrecidn3 table 

        /// TOP 10 CENTERS  End

        /// TOP 10 PROCEDURES start   

      /*  $http({
                url: apiUrl + "maxcount?tableName=medrecidn3&filter=" + $scope.idnValue + " and PROC !=''  GROUP BY PROC order by count(PROC) desc &fields=id,created_on,DOP,PROC,status,IDN3, count(PROC) as medTotal ,sum(status = 1) as medcomp",
                method: 'get',
                data: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(maxCount) {

                $scope.MedRecordMaxCount = [];

                if(maxCount!=='1')
                {
                angular.forEach(maxCount, function(value, key) {
                    $scope.MedRecordMaxCount.push("'" + value.id + "'");
                });


                $http({
                        url: apiUrl + "maxcount?tableName=patint2&filter= where ref_id IN(" + $scope.MedRecordMaxCount.join(',') + ") " +$scope.created_onFilter +" &fields=status,IDN3, count(IDN3) as patint2Total ,sum(status = 1) as patntcomp",
                        method: 'get',
                        data: '',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .success(function(patint2Count) {

                        $scope.TopTenProcedures = [];
                        
                        if (angular.isArray(maxCount)) {
                            angular.forEach(maxCount, function(value, key) {
                                var patntcomp = 0;
                                var patint2Total = 0;

                                var totalIndexdatapatnt = $scope.findIndexInData(patint2Count, 'IDN3', angular.uppercase(value.IDN3));
                                if (angular.isDefined(patint2Count[totalIndexdatapatnt])) {
                                    patint2Total = patint2Count[totalIndexdatapatnt].patint2Total;
                                    patntcomp = patint2Count[totalIndexdatapatnt].patntcomp;
                                }
                                $scope.TopTenProcedures.push({
                                    proc: value.PROC,
                                    TotalMed: value.medTotal,
                                    patntTotal: patint2Total,
                                    patntComp: patntcomp,
                                    medComp: value.medcomp,
                                    DOP: moment(value.DOP).format("MM-DD-YYYY"),
                                    createdOn: moment(value.created_on).format("MM-DD-YYYY")
                                    
                                });

                            });
                        
                                        
                                       if($scope.userDetals.is_super_user<=0)
                                       {

                                        $timeout(function()
                                            {
                                            //$scope.lastBOP = $scope.TopTenProcedures[$scope.TopTenProcedures.length-1];
                                            //$scope.lastcretedON = $scope.TopTenProcedures[$scope.TopTenProcedures.length-1];
                                        }, 3000);
                                            
                                           
                                       }    
                                       
                        }



                    }); //patnt2 table 

                }//maxCount if loop


            }); //medrecidn3 table 

*/

        /// TOP 10 PROCEDURES END 

    }; // dashBoardDataUpdate function close


    $scope.lastmonth = function() {
        $scope.monthduration = "Last Month";
      
         $(".inactiveclr").addClass("btn btn-info");
      $("#lastmonth1").removeClass("btn btn-info");
      $("#lastmonth1").addClass("btn btn-primary");

        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + lastMonthfstDay + "' and DOP <='" + lastMonthLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + lastMonthfstDay + "' and DOP <='" + lastMonthLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + lastMonthfstDay + "' and  DOP <='" + lastMonthLastDay + "')";
        $scope.dashBoardDataUpdate($scope.created_onFilter);
    };

    $scope.lastsixMonth = function() {
        $scope.monthduration = "Last Six Month";
      
         $(".inactiveclr").addClass("btn btn-info");
      $("#lastsixMonth1").removeClass("btn btn-info");
      $("#lastsixMonth1").addClass("btn btn-primary");


        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + lastSixMonth + "' and  DOP <= '" + lastMonthLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + lastSixMonth + "' and DOP <='" + lastMonthLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + lastSixMonth + "' and  DOP <='" + lastMonthLastDay + "')";
        $scope.dashBoardDataUpdate($scope.created_onFilter);
    };
    $scope.lastQuarter = function() {
        $scope.monthduration = "Last Quarter";

         $(".inactiveclr").addClass("btn btn-info");
      $("#lastQuarter1").removeClass("btn btn-info");
      $("#lastQuarter1").addClass("btn btn-primary");



        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + lastQuterMonth + "' and DOP <= '" + lastMonthLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + lastQuterMonth + "' and DOP <='" + lastMonthLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + lastQuterMonth + "' and DOP <='" + lastMonthLastDay + "')";
        $scope.dashBoardDataUpdate($scope.created_onFilter);
    };

    $scope.thisMOnth = function() {
        $scope.monthduration = "This Month";

         $(".inactiveclr").addClass("btn btn-info");
      $("#thisMOnth1").removeClass("btn btn-info");
      $("#thisMOnth1").addClass("btn btn-primary");



        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + currentMonthfstDay + "' and  DOP<='" + currentMonthLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + currentMonthfstDay + "' and DOP <='" + currentMonthLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + currentMonthfstDay + "' and DOP <='" + currentMonthLastDay + "')";
        $scope.dashBoardDataUpdate($scope.created_onFilter);
    };

    $scope.lastYear = function() {

         $(".inactiveclr").addClass("btn btn-info");
      $("#lastYear1").removeClass("btn btn-info");
      $("#lastYear1").addClass("btn btn-primary");

        $scope.monthduration = "Last Year";

        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + lastYearFstDay + "' and DOP <='" + lastYearLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + lastYearFstDay + "' and DOP <='" + lastYearLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + lastYearFstDay + "' and DOP <='" + lastYearLastDay + "')";
        $scope.dashBoardDataUpdate($scope.created_onFilter);
    };

if ($stateParams.IDN!=='' || $localStorage.monthFilter!=='')
{
        if($localStorage.monthFilter=='lastsixMonth')
        {
            $scope.lastsixMonth();
        }
        else if($localStorage.monthFilter=='lastQuarter')
        {
            $scope.lastQuarter();
        }
        else if($localStorage.monthFilter=='lastYear')
        {
            $scope.lastYear();
        }
        else if($localStorage.monthFilter=='thisMOnth')
        {
            $scope.thisMOnth();
        }
        else
        {
            $scope.lastmonth();
        }
        
}
else
{
    $scope.lastmonth();
}

}]);