angular.module('ctApp.ProcedureGroups', [
    'ui.router'
])

.config(function config($stateProvider) {
    var access = routingConfig.accessLevels;
    $stateProvider.state('ctApp.ProcedureGroups', {
        url: '/Case-Distribution',
        views: {
            "appNested": {
                controller: 'ProcedureGroupsCtrl',
                templateUrl: 'ct-app/CaseDistribution/ProcedureGroups.tpl.html'
            }
        },
        data: {
            pageTitle: 'CaseDistribution'
        },
        access: access.public
    });
})

.controller('ProcedureGroupsCtrl', ['$scope', '$http', 'DTOptionsBuilder', '$localStorage','$stateParams','$timeout', function($scope, $http, DTOptionsBuilder, $localStorage,$stateParams,$timeout) {
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
    $scope.CenterName = $scope.userDetals.hospital;

    
   /*$scope.dtOptions = DTOptionsBuilder.newOptions()
          .withPaginationType('full_numbers')
          .withDisplayLength(10)
          .withOption('order', [1, 'asc']);
          $scope.dtOptions.searching=false ;*/



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

    $scope.ProcedureDataUpdate = function() {

        $scope.loderStatus = 1;   
        $scope.medrecidn3 = [];             

                            $http({
                                     url: apiUrl +"getCptTable?tableName=medrecidn3&filter=" + $scope.idnValue + "  and IDN3 !='null' and PROC !='' GROUP BY PROC,IDN3&fields=id,PROC,IDN3,status,COUNT(*) as procCount,sum(status=1) as compl,sum(patient_int = '1') as patient_int",
                                    method: 'get',
                                    data: '',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .success(function(medrecidn3) {

                                    
                                    $scope.MedRecordIdn3 =[];
                                if(medrecidn3.length>0)
                                {
                                  // $scope.medrecidn3 = medrecidn3;


                                    angular.forEach(medrecidn3, function(value, key) {
                                            if (value.IDN3 !== null) {
                                                $scope.MedRecordIdn3.push("'" + value.id + "'");
                                            }

                                        });

                                    $http({
                                            url: apiUrl + "getCptTable?tableName=patint2&filter= where ref_id IN(" + $scope.MedRecordIdn3.join(',') + ") " +$scope.created_onFilter +" order by IDN3 asc &fields=status,IDN3,sum(status = 1) as pantcomp",
                                            method: 'get',
                                            data: '',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        })
                                    .success(function(patn2cmp){

                                            if(patn2cmp.length>0)
                                            {
                                                $scope.medrecidn3 = [];
                                                $scope.patint2Idn3 = [];

                                                angular.forEach(medrecidn3, function(value, key) {
                                                        if (value.IDN3 !== null) {
                                                            $scope.patint2Idn3.push("'" + value.IDN3 + "'");
                                                        }

                                                    });
                                                $http({
                                                url: apiUrl + "getCptTable?tableName=idndetails&filter=where IDN3 IN("+$scope.patint2Idn3.join(',')+") order by IDN3 asc &fields=IDN3,IDNNAME,id",
                                                method: 'get',
                                                data: '',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                }
                                            })
                                            .success(function(indnname)
                                            {
                                                $scope.medTotal = 0;
                                                $scope.patntTotal = 0;
                                                angular.forEach(medrecidn3, function(value, key) {
                                                    var IDNNAME = '';
                                                var patntcom = 0;
                                                $scope.loderStatus = 0;
                                                    if (value.IDN3 !== null) {
                                                        
                                                        var indnameIndex = $scope.findIndexInData(indnname, 'IDN3', angular.uppercase(value.IDN3));

                                                        var patntIndex = $scope.findIndexInData(patn2cmp, 'IDN3', angular.uppercase(value.IDN3));

                                                        if(angular.isDefined(indnname[indnameIndex]))
                                                          {
                                                            IDNNAME = indnname[indnameIndex].IDNNAME;
                                                          }
                                                          if(angular.isDefined(patn2cmp[patntIndex]))
                                                          {
                                                            patntcom = patn2cmp[patntIndex].pantcomp;
                                                          }
                                                          $scope.medTotal = $scope.medTotal + value.compl;
                                                          $scope.patntTotal = $scope.patntTotal + value.patient_int;

                                                          $scope.medrecidn3.push({PROC:value.PROC,IDN3:IDNNAME+'('+value.IDN3+')',compl:value.compl,patntcom:value.patient_int});
                                                    }

                                                });
                                            });//idndetails
                                                
                                            }
                                            else
                                              {
                                                $scope.loderStatus = 0;
                                              }
                                    });

                                  }
                                  else
                                  {
                                    $scope.loderStatus = 0;
                                  }

                                });
  

        /// TOP 10 CENTERS  End

        

    }; // ProcedureDataUpdate function close


    $scope.lastmonth = function() {
        $scope.monthduration = "Last Month";

         $(".inactiveclr").addClass("btn btn-info");
      $("#lastmonth2").removeClass("btn btn-info");
      $("#lastmonth2").addClass("btn btn-primary");

        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + lastMonthfstDay + "' and DOP <='" + lastMonthLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + lastMonthfstDay + "' and DOP <='" + lastMonthLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + lastMonthfstDay + "' and  DOP <='" + lastMonthLastDay + "')";
        $scope.ProcedureDataUpdate($scope.created_onFilter);
    };

    $scope.lastsixMonth = function() {
        $scope.monthduration = "Last Six Month";

        $(".inactiveclr").addClass("btn btn-info");
      $("#lastsixMonth21").removeClass("btn btn-info");
      $("#lastsixMonth2").addClass("btn btn-primary");

        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + lastSixMonth + "' and  DOP <= '" + lastMonthLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + lastSixMonth + "' and DOP <='" + lastMonthLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + lastSixMonth + "' and  DOP <='" + lastMonthLastDay + "')";
        $scope.ProcedureDataUpdate($scope.created_onFilter);
    };
    $scope.lastQuarter = function() {
        $scope.monthduration = "Last Quarter";

         $(".inactiveclr").addClass("btn btn-info");
      $("#lastQuarter2").removeClass("btn btn-info");
      $("#lastQuarter2").addClass("btn btn-primary");

        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + lastQuterMonth + "' and DOP <= '" + lastMonthLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + lastQuterMonth + "' and DOP <='" + lastMonthLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + lastQuterMonth + "' and DOP <='" + lastMonthLastDay + "')";
        $scope.ProcedureDataUpdate($scope.created_onFilter);
    };

    $scope.thisMOnth = function() {
        $scope.monthduration = "This Month";

        $(".inactiveclr").addClass("btn btn-info");
      $("#thisMOnth2").removeClass("btn btn-info");
      $("#thisMOnth2").addClass("btn btn-primary");

        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + currentMonthfstDay + "' and  DOP<='" + currentMonthLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + currentMonthfstDay + "' and DOP <='" + currentMonthLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + currentMonthfstDay + "' and DOP <='" + currentMonthLastDay + "')";
        $scope.ProcedureDataUpdate($scope.created_onFilter);
    };

    $scope.lastYear = function() {
        $scope.monthduration = "Last Year";

        $(".inactiveclr").addClass("btn btn-info");
      $("#lastYear2").removeClass("btn btn-info");
      $("#lastYear2").addClass("btn btn-primary");

        if ($scope.idnValueCondition === '') {
            $scope.idnValue = "where (DOP >= '" + lastYearFstDay + "' and DOP <='" + lastYearLastDay + "')";
        } else {
            $scope.idnValue = $scope.idnValueCondition + " and (DOP >= '" + lastYearFstDay + "' and DOP <='" + lastYearLastDay + "')";
        }
        $scope.created_onFilter = " and (DOP >= '" + lastYearFstDay + "' and DOP <='" + lastYearLastDay + "')";
        $scope.ProcedureDataUpdate($scope.created_onFilter);
    };

    $scope.lastmonth();

}]);