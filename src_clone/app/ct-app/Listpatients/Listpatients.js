angular.module('ctApp.tablestatic', [
    'ui.router',
    'angularUtils.directives.dirPagination'

])

.config(function config($stateProvider) {
    var access = routingConfig.accessLevels;
    $stateProvider.state('ctApp.tablestatic', {
        url: '/Listpatients/:IDN',
        views: {
            "appNested": {
                controller: 'Listpatients',
                templateUrl: 'ct-app/Listpatients/Listpatients.tpl.html'
            }
        },
        data: {
            pageTitle: 'Listpatients'
        },
        access: access.public
    });
})

.controller('Listpatients', ['$scope', '$http', '$state', '$stateParams', '$modal', '$cookieStore', '$localStorage', '$timeout', 'DTOptionsBuilder', '$rootScope', function($scope, $http, $state, $stateParams, $modal, $cookieStore, $localStorage, $timeout, DTOptionsBuilder, $rootScope) {
        var url = "";



        $scope.userDetals = $localStorage.userName; //$cookieStore.get('userName');
        if (angular.isUndefined($scope.userDetals) || $scope.userDetals === null) {
        return false;
    }
        $scope.patientFilters = {};
        $scope.patientFilters.procdate ={
            field: "DOP",
            value: "Procedure Date"
        };
        $scope.patientFilters.pin = '';
        $scope.patientFilters.startDate = '';
        $scope.patientFilters.endDate = '';
        $scope.lastyeardate='';
        var patientFiltersProces = [];
        $scope.patientFiltersProce = [];
        $scope.loderStatus = 1;
        $scope.created_onFilter = '';
        $scope.offset = 0;
        $scope.limit = 100;
        $scope.Listpatients = [];
        $scope.ascfiled = "DOP";
        var idn3 = '';



        $scope.selcfiled = [{
            field: "DOP",
            value: "Procedure Date"
        }, {
            field: "created_on",
            value: "Created Date"
        }];

        $scope.selcstatus = ['All Records', 'Completed', 'Draft'];
        $scope.patientFilters.procstatus = $scope.selcstatus[0];
        var lastSixMonth = moment().subtract(6, 'months').date(1).format("YYYY-MM-DD");
        var lstyr = moment().format('YYYY');
        var lastYearFstDay = moment(lstyr + '-01-01').subtract(12, 'months').date(1).format("YYYY-MM-DD");
        var lastYearLastDay = moment(lstyr + '-12-01').subtract(12, 'months').endOf('month').format('YYYY-MM-DD');
        var lastQuterMonth = moment().subtract(3, 'months').date(1).format("YYYY-MM-DD");
        var lastMonthfstDay = moment().subtract(1, 'months').date(1).format("YYYY-MM-DD");
        var currentMonthfstDay = moment().subtract(0, 'months').date(1).format("YYYY-MM-DD");
        var currentMonthLastDay = moment().subtract(0, 'months').endOf('month').format('YYYY-MM-DD');
        var lastMonthLastDay = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        var whereCondition = "status!='0'";
        var now = new Date();
        $scope.mindate = new Date(now.setMonth(now.getMonth() - 12));

        if($scope.userDetals.is_super_user<=0)
        {
            $scope.lastyeardate = " and created_on >'" + moment($scope.mindate).format('YYYY-MM-DD')+"'";    
        }
        
        
        $scope.maxdate = new Date();

        /* $scope.dtOptions = DTOptionsBuilder.newOptions()
           .withPaginationType('full_numbers')
           .withDisplayLength(10)
           .withOption('order', [1, 'desc']);
           $scope.dtOptions.searching=false ;*/
        mixpanel.track("List Patient", {
            "USER NAME": (angular.isDefined($localStorage.userName) && $localStorage.userName !== null) ? $localStorage.userName.name : "",
            "CENTER NAME": (angular.isDefined($localStorage.IDN) && $localStorage.IDN !== null) ? $localStorage.IDN : ''

        });

        $http({
                url: apiUrl + "getCptTable?tableName=cpt_codes&filter= group by PROCEDURE_GROUP limit 10&fields=DESCRIPTION,CODE,PROCEDURE_GROUP",

                //url: apiUrl + "getCptTable?tableName=cpt_codes&filter=where CODE like '%" + code + "%' || DESCRIPTION like '%" + code + "%' || PROCEDURE_GROUP like '%"+ code +"%' limit 10&fields=DESCRIPTION,CODE,PROCEDURE_GROUP",
                method: 'get',
                data: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(data) {

                if (data.length > 0) {
                    angular.forEach(data, function(value, key) {

                        $scope.patientFiltersProce.push({
                            PROC: value.PROCEDURE_GROUP
                        });

                    });
                }

            });



        $scope.refreshcategory = function(code) {

            if (code.length > 0) {
                $http({

                        url: apiUrl + "getCptTable?tableName=cpt_codes&filter=where PROCEDURE_GROUP like '%" + code + "%' group by PROCEDURE_GROUP  limit 10&fields=DESCRIPTION,CODE,PROCEDURE_GROUP", //Your url will be like this.
                        method: 'get',
                        data: code,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .success(function(data) {

                        if (data.length > 0) {
                            $scope.patientFiltersProce = [];

                            angular.forEach(data, function(value, key) {
                                $scope.patientFiltersProce.push({
                                    PROC: value.PROCEDURE_GROUP
                                });

                            });


                        }

                    });
            }
        };
        $scope.Listpatients1 = [];
        $scope.loadData = function(data) {
            
            $scope.Listpatients = $scope.Listpatients1;

            $http({
                url: apiUrl + "getCptTable?tableName=medrecidn3&filter=where "+whereCondition+" " + idn3 + " " + $scope.created_onFilter + " "+$scope.lastyeardate+"  GROUP BY status &fields=DOP,created_on,status, COUNT(*) as statuscounts",
                method: 'get',
                data: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(medRecordTotalCount) {
                if(medRecordTotalCount.length>0)
                {
                    $scope.lenfgth = medRecordTotalCount[medRecordTotalCount.length-1].statuscounts;

                $scope.rowlng = medRecordTotalCount[0].statuscounts/100;
                $scope.rowLength = Math.round($scope.rowlng);
                
                $scope.maxSize = 5;

                    var maxCount = $scope.currentPage * 100;

                    if(maxCount > $scope.lenfgth){

                        maxCount = $scope.lenfgth;
                    }

                $scope.showReocrd = 'Showing '+ (Number(Number(($scope.currentPage * 100 )) + 1) - 100) +' to  '+(maxCount) +' of '+$scope.lenfgth +' entries';
                    //console.log( $scope.showReocrd);

                    var sortField = 2;
                    if($scope.ascfiled == "DOP"){
                        sortField = 2;
                    }else{
                        sortField = 1;
                    }
                    

                    $scope.dtOptions = DTOptionsBuilder.newOptions()
                                .withPaginationType('full_numbers')
                                .withDisplayLength(100)
                                .withOption('order', [sortField, 'desc']);
                            $scope.dtOptions.searching = false;
                            $scope.dtOptions.deferRender = true;
                             $scope.dtOptions.bPaginate=false;
                           // $scope.dtOptions.paging= false;
                            $scope.dtOptions.bInfo = false;

                            //$scope.dtOptions.iTotalRecords = medRecordTotalCount[0].statuscounts;
                            //$scope.dtOptions.recordsTotal =200;
                            //$scope.dtOptions.iDisplayLength = 300;
                            //$scope.dtOptions.iTotalDisplayRecords = medRecordTotalCount[0].statuscounts;

                }
                
            });
             
                            
                            //$scope.dtOptions.bJQueryUI = false;
                            //$scope.dtOptions.bDestroy= true;
                            //$scope.dtOptions.bInfo=true;
                            //$scope.dtOptions.bProcessing=true;
                            //$scope.dtOptions.bDeferRender= true;

        };

        
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        

  
  
  $scope.$watch('currentPage + numPerPage', function() {
    if(angular.isDefined($scope.rowLength))
    {

        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.getmedrecidn3('',$scope.currentPage);
        
    }
    
  });

        $scope.getmedrecidn3 = function(url,pagenumber) {

                $scope.loderStatus = 1; 
                $scope.Listpatients  = [];          

             var offset = (pagenumber>0)?(pagenumber-1)*100:0;
             
             var ofset = offset;

              var urll = apiUrl + "getCptTable?tableName=medrecidn3&filter=where "+whereCondition+" " + idn3 + " " + $scope.created_onFilter + " "+$scope.lastyeardate+" order by "+$scope.ascfiled+" desc limit " + $scope.limit + " offset " + ofset + " &fields=PIN,created_on,DOP,PROC,proc_desc,ID,ISV_F,patient_int,status";

            
            $http({
                    url: urll, //Your url will be like this.
                    method: 'get',
                    data: '',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Content-Type': 'application/json'
                    }
                })
                .success(function(data) {
                    $scope.Listpatients = [];
                    $scope.loderStatus = 0;

                    if (data.length > 0) {
                        $scope.Listpatients1 = [];
                        angular.forEach(data, function(value, key) {


                            $scope.Listpatients1.push({
                                patient_int: value.patient_int,
                                ISV_F: value.ISV_F,
                                PIN: value.PIN,
                                created_on: (value.created_on) ? moment(value.created_on).format("MM-DD-YYYY") : "",
                                DOP: moment(value.DOP).format("MM-DD-YYYY"),
                                PROC: value.PROC,
                                ID: value.ID,
                                status: value.status
                            });
                            var a = patientFiltersProces.indexOf(value.PROC);

                            if (a < 0) {
                                // patientFiltersProces.push(value.PROC);
                                //$scope.patientFiltersProce.push({PROC:value.PROC});
                            }



                        });
                        
                        
                            //$scope.offset = $scope.offset + $scope.limit;

                           

                           // $scope.getmedrecidn3(loadofsetUrl,pagenumber);

                            $scope.loadData($scope.Listpatients1);





                    }



                });
        };
        $scope.updateTableData = function(searVal) {
            $scope.Listpatients = [];
            $scope.Listpatients1 = [];
            $scope.offset = 0;
            whereCondition = "";
            
//&& !angular.isUndefined($scope.patientFilters.procdate)
            if (searVal === 0) {
                $scope.created_onFilter = '';
            }
            
            var IDNVALUE = '';

            $arr = {
                "All Records": '!=0',
                "Completed": '=1',
                "Draft": '=-1'
            };
            if ($localStorage.IDN && $localStorage.IDN !== 'ALL') {
                IDNVALUE = " and IDN3 = '" + $localStorage.IDN + "' ";
            }

            whereCondition = "status " + $arr[$scope.patientFilters.procstatus] + " " + IDNVALUE + " " + $scope.created_onFilter;

            if (!angular.isUndefined($scope.patientFilters.procdate)) {
                if (!angular.isUndefined($scope.patientFilters.startDate) && !angular.isUndefined($scope.patientFilters.endDate)) {
                    if ($scope.patientFilters.startDate !== '' && $scope.patientFilters.endDate !== '') {
                        if ($scope.patientFilters.procdate.field === 'DOP') {
                            whereCondition += " and (" + $scope.patientFilters.procdate.field + " BETWEEN  '" + moment($scope.patientFilters.startDate).format("YYYY-MM-DD 00:00") + "'  and  '" + moment($scope.patientFilters.endDate).format("YYYY-MM-DD 23:59") + "')";
                        } else {

                            whereCondition += " and (" + $scope.patientFilters.procdate.field + " BETWEEN  '" + moment($scope.patientFilters.startDate).format("YYYY-MM-DD 00:00") + "'  and  '" + moment($scope.patientFilters.endDate).format("YYYY-MM-DD 23:59") + "')";
                        }

                    }

                }
                $scope.ascfiled = $scope.patientFilters.procdate.field;
            }

            if ($scope.patientFilters.startDate === '' || $scope.patientFilters.endDate === '') {
                //$scope.showerrorMsg = true;
                // $scope.error_msg = "Please Required procedure's date";
                //$timeout(function(){$scope.showerrorMsg = false;},1000);
                // return false;
            }




            if (!angular.isUndefined($scope.patientFilters.Procedure)) {
                whereCondition += " and PROC = '" + $scope.patientFilters.Procedure.PROC + "'";
            }

            if (!angular.isUndefined($scope.patientFilters.secproce) && $scope.patientFilters.secproce !== '') {
                whereCondition += " and  proc_desc like '%" + $scope.patientFilters.secproce + "%'";
            }

            if (!angular.isUndefined($scope.patientFilters.pin) && $scope.patientFilters.pin !== '') {
                whereCondition += " and  PIN Like '%" + $scope.patientFilters.pin + "%'";
            }
            if (!angular.isUndefined($scope.patientFilters.npi) && $scope.patientFilters.npi !== '') {
                whereCondition += " and  ISV_F Like '%" + $scope.patientFilters.npi + "%'";
            }

            if (whereCondition === "") {
                $scope.showerrorMsg = true;
                $scope.error_msg = "Please Required Any One Field's";
                $timeout(function() {
                    $scope.showerrorMsg = false;
                }, 1000);
                return false;
            }

            var url = apiUrl + "getCptTable?tableName=medrecidn3&filter=where  " + whereCondition + "   order by "+$scope.ascfiled+" desc limit " + $scope.limit + " offset " + $scope.offset + " &fields=PIN,created_on,DOP,PROC,ID,proc_desc,ISV_F,patient_int,status";

            $scope.getmedrecidn3(url,0);

        };

        $scope.IDN = ($localStorage.IDN) ? $localStorage.IDN : "";

        $scope.lastmonth = function() {
            $scope.monthduration = "Last Month";
            $scope.created_onFilter = " and DOP >= '" + lastMonthfstDay + "' and  DOP <='" + lastMonthLastDay + "'";
            $scope.updateTableData($scope.created_onFilter);
        };

        $scope.lastsixMonth = function() {
            $scope.monthduration = "Last Six Month";
            $scope.created_onFilter = " and DOP >= '" + lastSixMonth + "' and  DOP <='" + lastMonthLastDay + "'";
            $scope.updateTableData($scope.created_onFilter);
        };
        $scope.lastQuarter = function() {
            $scope.monthduration = "Last Quarter";

            $scope.created_onFilter = " and DOP >= '" + lastQuterMonth + "' and DOP <='" + lastMonthLastDay + "'";
            $scope.updateTableData($scope.created_onFilter);
        };

        $scope.thisMOnth = function() {
            $scope.monthduration = "This Month";
            $scope.created_onFilter = " and DOP >= '" + currentMonthfstDay + "' and DOP <='" + currentMonthLastDay + "'";
            $scope.updateTableData($scope.created_onFilter);
        };

        $scope.lastYear = function() {
            $scope.monthduration = "Last Year";

            $scope.created_onFilter = " and DOP >= '" + lastYearFstDay + "' and DOP <='" + lastYearLastDay + "'";
            $scope.updateTableData($scope.created_onFilter);
        };

        if ($localStorage.IDN && $localStorage.IDN !== 'ALL')
        //if($localStorage.IDN!=='' && $localStorage.IDN!=null)
        {


           // $localStorage.IDN = $localStorage.IDN; //$stateParams.IDN;//$cookieStore.put('IDN',$stateParams.IDN);
            $scope.IDN = $stateParams.IDN;
            url = apiUrl + "getCptTable?tableName=medrecidn3&filter=where IDN3 = '" + $stateParams.IDN + "'  and status!=0 order by "+$scope.ascfiled+" desc limit " + $scope.limit + " offset " + $scope.offset + " &fields=PIN,created_on,DOP,PROC,proc_desc,ID,ISV_F,patient_int,status";

            // console.log(url);
            //console.log($localStorage.monthFilter);
            //      $scope.getmedrecidn3(url);
            idn3 = "and IDN3 = '" + $localStorage.IDN + "'";

            if ($localStorage.monthFilter == 'lastYear') {
                $scope.lastYear();
            } else if ($localStorage.monthFilter == 'thisMOnth') {
                $scope.thisMOnth();
            } else if ($localStorage.monthFilter == 'lastQuarter') {
                $scope.lastQuarter();
            } else if ($localStorage.monthFilter == 'lastsixMonth') {
                $scope.lastsixMonth();
            } else if ($localStorage.monthFilter == 'lastmonth') {
                $scope.lastmonth();
            } else {
                $scope.getmedrecidn3(url,0);
            }

        } else {
            
            $localStorage.monthFilter = '';
            if ($scope.userDetals === null || angular.isUndefined($scope.userDetals)) {
                return false;
            }

            if ($localStorage.IDN && $localStorage.IDN !== 'ALL' ) {
                idn3 = "and IDN3 = '" + $localStorage.IDN + "'";
            } else {
                idn3 = '';

                if ($scope.userDetals.hospital !== 'ALL') {
                    idn3 = "and IDN3 = '" + $scope.userDetals.hospital  + "'";
                }

            }


            url = apiUrl + "getCptTable?tableName=medrecidn3&filter=where status!=0  " + idn3 + " order by "+$scope.patientFilters.procdate.field+" desc limit " + $scope.limit + " offset " + $scope.offset + " &fields=PIN,created_on,DOP,PROC,proc_desc,ID,ISV_F,patient_int,status";
            $scope.IDN = $scope.userDetals.hospital;
            $scope.getmedrecidn3(url,0);
            //lastMonthLastDay = currentMonthLastDay;
            //$scope.lastsixMonth();

        }
        var nameidn3 = ($localStorage.IDN) ? $localStorage.IDN : $scope.IDN;


        $http({
                url: apiUrl + "getCptTable?tableName=idndetails&fields=IDN3,IDNNAME&filter=where IDN3='" + nameidn3 + "' limit 0,1",
                method: 'get',
                data: '',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(data) {
                if (data.length > 0) {
                    $scope.centername = data[0].IDNNAME;
                    $scope.IDNCode = data[0].IDN3;


                    // idnNameDetals.indName = [{centername:$scope.centername,IDNCode:$scope.IDNCode}];


                    // $rootScope.$broadcast('centername', [{centername:$scope.centername,IDNCode:$scope.IDNCode}]);
                    // console.log('dsaas');
                    //[{centername:$scope.centername,IDNCode:$scope.IDNCode}]

                } else {
                    $scope.IDNCode = $scope.IDN;
                }

            });


        $scope.loadUrl = url;

        $scope.closeAlert = function(index) {
            $scope.errortype = 1;
        };
        $scope.printPatIntView = function(id) {


            var url = downloadUrl + "downloadText.php?med_id=" + id;
            window.open(
                url,
                '_blank' // <- This is what makes it open in a new window.
            );
        };
        $scope.clearSearch = function() {
            $scope.loderStatus = 1;
            $scope.patientFilters = {};
            $scope.Listpatients = [];
            $scope.Listpatients1 = [];
            $scope.offset = 0;
            $scope.patientFilters.procstatus = $scope.selcstatus[0];
            //$scope.getmedrecidn3($scope.loadUrl);
            $scope.updateTableData(1);
            //$scope.lastsixMonth();

        };

        $scope.editView = function(id) {
            //console.log(id);
            $state.go("ctApp.elements", {
                editId: id
            });
        };

        $scope.editPatIntView = function(id) {
            //console.log(id);
            $state.go("ctApp.fileupload", {
                editId: id
            });
        };

        $scope.deleteView = function(id, index) {
            var hserr = "'has-error'";

            $scope.modalInstance = $modal.open({
                template: '<div class="modal-content"><div class="modal-header">Delete Notification</div><div class="modal-body"><div class="form-group"><label class="col-sm-12 control-label">Do you want to delete,  please type DELETE to confirm !</label></div><ng-form class="form-horizontal form-validation form-horizontal location ng-scope ng-valid-pattern ng-valid-required ng-dirty ng-valid-mask ng-valid ng-valid-parse" method="get" name ="deleteconfirm" ng-submit="deleteconfirm.$valid && yes(1)"><div class="form-group"><label class="col-sm-3 control-label text-danger">Confirm Delete</label><div class="col-sm-4" ng-class="{' + hserr + ': errorcls }" ><input type="text"  name="pin" class="form-control uppercase" capitalize placeholder="Enter Delete word" ng-model="deletenotify" required></div></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="yes(1)">Yes</button><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close(0)">Cancel</button></div>',
                controller: "deletecontroler",
                size: 'md'
            });
            //<label type="button" class="col-sm-4" data-dismiss="modal" ></label><label type="button" class="alert alert-danger col-sm-4" data-dismiss="modal" ng-show="errorcls">Please Enter Delete Text</label>
            $scope.modalInstance.result.then(function(selectedItem) {

                if (selectedItem > 0) {
                    $http({
                            url: apiUrl + 'delete/' + id + '?tableName=medrecidn3&filter=where id=' + id, //Your url will be like this.
                            method: 'delete',
                            data: '',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .success(function(data) {

                            $('#removeId' + id).remove();
                            $scope.Listpatients.splice(index, 1);

                            //$scope.showReocrd = 'Showing '+$scope.currentPage +' to  100 of '+$scope.Listpatients.length+' entries';

                            //$scope.Listpatients.splice($scope.Listpatients.indexOf(id),1);


                        });
                }
            }, function() {

            });

        };

    }])
    .controller('deletecontroler', ['$modalInstance', '$scope', '$state', '$timeout', function($modalInstance, $scope, $state, $timeout) {
        $scope.close = function() {
            $modalInstance.close(0);
        };
        $scope.yes = function() {
            $scope.errorcls = false;
            if ($scope.deletenotify !== "DELETE") {
                $scope.errorcls = true;
                return false;
            }

            $modalInstance.close(1);
        };
    }]);