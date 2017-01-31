angular.module( 'ctApp.ui_grid', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  var access = routingConfig.accessLevels;

  $stateProvider.state( 'ctApp.ui_grid', {
    url: '/ListCenters',
    views: {
      "appNested": {
        controller: 'ListCenters',
        templateUrl: 'ct-app/centers/ListCenters.tpl.html'
      }
    },
    data:{ pageTitle: 'List Centers' },
    access: access.SuperAdmin
  })
  .state('ctApp.addCenter', {
    url: '/AddCenters/:editId',
    views: {
      "appNested": {
        controller: 'AddCenterscntrl',
        templateUrl: 'ct-app/centers/AddCenters.tpl.html'
      }
    },
    data:{ pageTitle: 'Add Centers' },
    access: access.public
  });
})

.controller('ListCenters', ['$scope','$http','$state','$modal','DTOptionsBuilder','$localStorage',  function($scope,$http,$state,$modal,DTOptionsBuilder,$localStorage) {

  $scope.listCenters = {};
    $scope.Listcenters = [];
    
         // $scope.dtOptions.ordering = false;
          $scope.Censtatus = [{name:"All",value:">='0'"},{name:"Active",value:"=1"},{name:"Inactive",value:"=0"}];
          //$scope.Censtatus = ["AllRecords","Active","InActive"];
          $scope.centesta = {};
          $scope.centesta.status_center = $scope.Censtatus[0];
          //$scope.status_center = $scope.Censtatus[0];
          //$scope.Centerstatus.status = $scope.Censtatus[0];

          //$scope.loderStatus = 1;
          if($localStorage.userName===null || angular.isUndefined($localStorage.userName))
              {
                return false;
              }

          var lastSixMonth = moment().subtract(6, 'months').date(1).format("YYYY-MM-DD");
          var lstyr = moment().format('YYYY');
          var lastYearFstDay = moment(lstyr + '-01-01').subtract(12, 'months').date(1).format("YYYY-MM-DD");
          var lastYearLastDay = moment(lstyr + '-12-01').subtract(12, 'months').endOf('month').format('YYYY-MM-DD');

          var lastQuterMonth = moment().subtract(3, 'months').date(1).format("YYYY-MM-DD");

          var lastMonthfstDay = moment().subtract(1, 'months').date(1).format("YYYY-MM-DD");
          var currentMonthfstDay = moment().subtract(0, 'months').date(1).format("YYYY-MM-DD");
          var currentMonthLastDay = moment().subtract(0, 'months').endOf('month').format('YYYY-MM-DD');
          $scope.idnValue = '';

          var lastMonthLastDay = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');

           $scope.findIndexInData = function (data, property, value) {
                  var result = -1;
                  data.some(function (item, i) {
                    if (angular.uppercase(item[property]) === value) {
                          result = i;
                        return true;
                      }
                  });
                  return result;
              };

                mixpanel.track("Center List", {
                                   "USER NAME": (angular.isDefined($localStorage.userName)) ? $localStorage.userName.name : "",
                                   "CENTER NAME": (angular.isDefined($localStorage.IDN) && $localStorage.IDN !== null) ? $localStorage.IDN : ''
                                   
                               });

$scope.updateCenters = function(status)
{ 
  
$scope.loderStatus = 1;
$scope.Listcenters = [];
$scope.dtOptions = DTOptionsBuilder.newOptions()
          .withPaginationType('full_numbers')
          .withDisplayLength(10)
          .withOption('order', [0, 'asc']);

                $http({
                      url: apiUrl+"getCptTable?tableName=idndetails&filter=where status "+$scope.centesta.status_center['value']+ " order by IDNNAME asc&fields=created_on,IDN3,IDNNAME,id,PATINT,status",
                      method: 'get',
                      data:'' ,
                      headers: {'Content-Type': 'application/json'}
                      })
                    .success(function(data)
                      { 
                     $http({
                      url: apiUrl+"getCptTable?tableName=medrecidn3&filter="+$scope.idnValue + " GROUP BY IDN3 &fields=status,IDN3,COUNT(*) as counts,sum(patient_int = '-1') as patient_int,sum(status = '-1') as meddrafts",
                      method: 'get',
                      data:'' ,
                      headers: {'Content-Type': 'application/json'}
                      })
                .success(function(datamed)
                      { 
                        if(datamed.length>0)
                        {
                          $scope.medIdn3values = [];
                          angular.forEach(datamed, function(value,key)
                          {
                              $scope.medIdn3values.push("'"+value.IDN3+"'");
                          });
                          
                        }
                        
                        $http({
                      url: apiUrl+"getCptTable?tableName=patint2&filter= "+$scope.idnValue + " and IDN3 IN ("+$scope.medIdn3values + ") GROUP BY IDN3 &fields=status,IDN3,COUNT(*) as counts,sum(status = '-1') as patntdrafts",
                      method: 'get',
                      data:'' ,
                      headers: {'Content-Type': 'application/json'}
                      })
                    .success(function(datapatint2)
                      { 
                        $scope.MedRecordMaxCount = [];
                        if($scope.idnValue==='')
                        {
                          $scope.idndetailsRange = 'where ';
                        }
                        else
                        {
                          $scope.idndetailsRange = $scope.idnValue + ' and ';
                        }
                        angular.forEach(datapatint2, function(value, key) {
                          $scope.MedRecordMaxCount.push("'" + value.IDN3 + "'");
                      });

                        
                              $scope.Listcenters = [];
                              
                              if(data.length>0) 
                              {
                                $scope.loderStatus = 0;
                                angular.forEach(data, function(value, key) {
                                   //totalCounts =  _.findWhere(datamed,{IDN3:value.IDN3});// _.find(datamed, function (o) {  if(o[value.IDN3] == value.IDN3) { return o.counts;} });
                                   var iidxMed = 0;
                                   var iidxPatnt = 0;
                                   var patntdrafts = 0;
                                   var meddrafts = 0;
                                    var totalIndex = $scope.findIndexInData(datamed, 'IDN3', angular.uppercase(value.IDN3));
                                    var mdedraftIndex = $scope.findIndexInData(datamed, 'IDN3', angular.uppercase(value.IDN3));
                                    var patntdraftIndex = $scope.findIndexInData(datapatint2, 'IDN3', angular.uppercase(value.IDN3));

                                     var totalIndexdatapatint2 = $scope.findIndexInData(datapatint2, 'IDN3', angular.uppercase(value.IDN3));

                                   if(totalIndex>=0)
                                   {
                                     iidxMed = datamed[totalIndex].counts;
                                   }
                                   if(totalIndexdatapatint2>=0)
                                   {
                                     iidxPatnt = datapatint2[totalIndexdatapatint2].counts;
                                   }

                                   if(mdedraftIndex>0)
                                   {
                                     meddrafts = datamed[mdedraftIndex].meddrafts;
                                   }
                                   
                                   if(patntdraftIndex>0)
                                   {

                                     patntdrafts = datamed[mdedraftIndex].patient_int;
                                   }

                                $scope.Listcenters.push({ID:value.id,IDN3:value.IDN3,IDNNAME:value.IDNNAME,PATINT:value.PATINT,medRecodsTotal:iidxMed,patntTotal:iidxPatnt,patntdrafts:patntdrafts,meddrafts:meddrafts,status:value.status});
                              });
                                

                              } 
                              
                      });//patint2 table 
                  });//medrecidn3 table
               });//idndetails

  };
  $scope.statusActiveIn = function(status,id,notiy)
  {
    $scope.statusValue = (status===0)?1:0;
    $scope.statustext = (notiy=='InActive')?'Active':'InActive';
    $scope.statusclass = (notiy=='InActive')?'text-success':'text-danger';
    $scope.modalInstance = $modal.open({
                                      template:'<div class="modal-content"><div class="modal-header">Status Notification</div><div class="modal-body"><div class="form-group"><label class="col-sm-12 control-label">Do you want '+ notiy +'!</label></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="yes(1)">Yes</button><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close(0)">Cancel</button></div>',
                                      controller: "statuscontroler",
                                       size: 'md'
                                    });
                                    $scope.modalInstance.result.then(function(selectedItem) {
            
                            if(selectedItem>0)
                            {
                                $scope.addcenterDBfields= {};
                                $scope.addcenterDBfields.status =$scope.statusValue;
                                  $http({
                                      url: apiUrl + "update?tablename=idndetails&filter=where id = '" + id + "'&edit_id=" + id, //Your url will be like this.
                                      method: 'post',
                                      data:$scope.addcenterDBfields,
                                      headers: {'Content-Type': 'application/json'}
                                      })
                                    .success(function(data)
                                      {
                                             $('#statxt'+id).html("<a  ng-click=statusActiveIn("+$scope.statusValue+","+id+",'"+$scope.statustext+"') class='"+$scope.statusclass+ " ng-scope' >"+$scope.statustext+" </a>"); 
                                      });
                                        }
                                    }, function() {

                                    });
    
  };
  $scope.chagestatus = function() {
    $scope.montharr = ["lastmonth","lastsixMonth","lastQuarter","thisMOnth","lastYear"];
    var monthfun = $scope.montharr[$scope.monthIndex];
    
    if($scope.monthIndex===0)
    {
      $scope.lastmonth();
    }
    else if($scope.monthIndex===1)
    {
        $scope.lastsixMonth();
    }
    else if($scope.monthIndex===2)
    {
      $scope.lastQuarter();
    }
    else if($scope.monthIndex===3)
    {
      $scope.thisMOnth();
    }
    else
    {
      $scope.lastYear();
    }


    
  };
  $scope.lastmonth = function() {
    $scope.monthduration = "Last Month";
    //$localStorage.monthFilter = "lastmonth";
    $(".inactiveclr").addClass("btn btn-info");
      $("#lastmonth").removeClass("btn btn-info");
      $("#lastmonth").addClass("btn btn-primary");
    $scope.monthIndex = 0;
        
            $scope.idnValue = "where (DOP >= '" + lastMonthfstDay + "' and DOP <='" + lastMonthLastDay + "')";
            $scope.updateCenters($scope.idnValue);
    };

    $scope.lastsixMonth = function() {
      $(".inactiveclr").addClass("btn btn-info");
      $("#lastsixMonth").removeClass("btn btn-info");
      $("#lastsixMonth").addClass("btn btn-primary");

     // $localStorage.monthFilter = "lastsixMonth";

      $scope.monthduration = "Last Six Month";
      $scope.monthIndex = 1;

        
            $scope.idnValue = "where (DOP >= '" + lastSixMonth + "' and  DOP <= '" + lastMonthLastDay + "')";
            $scope.updateCenters($scope.idnValue);
    };
    $scope.lastQuarter = function() {
      $(".inactiveclr").addClass("btn btn-info");
      $("#lastQuarter").removeClass("btn btn-info");
      $("#lastQuarter").addClass("btn btn-primary");
      
     // $localStorage.monthFilter = "lastQuarter";

      $scope.monthduration = "Last Quarter";
      $scope.monthIndex = 2;
        
            $scope.idnValue = "where (DOP >= '" + lastQuterMonth + "' and DOP <= '" + lastMonthLastDay + "')";
        
        $scope.updateCenters($scope.idnValue);
    };

    $scope.thisMOnth = function() {
      $(".inactiveclr").addClass("btn btn-info");
      $("#thisMOnth").removeClass("btn btn-info");
      $("#thisMOnth").addClass("btn btn-primary");

      //$localStorage.monthFilter = "thisMOnth";
      $scope.monthduration = "This Month";
      $scope.monthIndex = 3;
        
            $scope.idnValue = "where (DOP >= '" + currentMonthfstDay + "' and  DOP<='" + currentMonthLastDay + "')";
        
             $scope.updateCenters($scope.idnValue);
    };

    $scope.lastYear = function() {
      $(".inactiveclr").addClass("btn btn-info");
      $("#lastYear").removeClass("btn btn-info");
      $("#lastYear").addClass("btn btn-primary");
     // $localStorage.monthFilter = "lastYear";
      $scope.monthduration = "Last Year";
      $scope.monthIndex = 4;
            $scope.idnValue = "where (DOP >= '" + lastYearFstDay + "' and DOP <='" + lastYearLastDay + "')";
            $scope.updateCenters($scope.idnValue);
    };
  $scope.lastmonth();
              $scope.editCenters = function(IDN3)
              {
                $localStorage.IDN = IDN3;
                var params = {};
                var mnth = {'ThisMonth':"thisMOnth",'LastYear':"lastYear","LastQuarter":"lastQuarter","LastSix Month":"lastsixMonth",LastMonth:"lastmonth"};
                 $localStorage.monthFilter = mnth[$scope.monthduration.replace(" ","")];
                   $state.go("ctApp.tablestatic", {IDN:IDN3});//{ IDN: IDN3}
              };
              $scope.dashBoard = function(IDN3)
              {
                var mnth = {'ThisMonth':"thisMOnth",'LastYear':"lastYear","LastQuarter":"lastQuarter","LastSix Month":"lastsixMonth",LastMonth:"lastmonth"};
                 $localStorage.monthFilter = mnth[$scope.monthduration.replace(" ","")];
                $state.go("ctApp.dashboard", { IDN: IDN3});
                $localStorage.IDN = IDN3;
              };
             
              $scope.deleteView = function(id,index,iden)
              {
                var hserr = "'has-error'";
                $scope.modalInstance = $modal.open({
                                      template:'<div class="modal-content"><div class="modal-header">Delete Notification</div><div class="modal-body"><div class="form-group"><label class="col-sm-12 control-label">Do you want to delete,  please type DELETE to confirm !</label></div><ng-form class="form-horizontal form-validation form-horizontal location ng-scope ng-valid-pattern ng-valid-required ng-dirty ng-valid-mask ng-valid ng-valid-parse" method="get" name ="deleteconfirm" ng-submit="deleteconfirm.$valid && yes(1)"><div class="form-group"><label class="col-sm-3 control-label text-danger">Confirm Delete</label><div class="col-sm-4" ng-class="{'+hserr+': errorcls }" ><input type="text"  name="pin" class="form-control uppercase" capitalize placeholder="Enter Delete word" ng-model="deletenotify" required></div></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="yes(1)">Yes</button><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close(0)">Cancel</button></div>',
                                      controller: "deletecontroler",
                                       size: 'md'
                   });

                  $scope.modalInstance.result.then(function(selectedItem) {
            
                            if(selectedItem>0)
                            {
                                  $http({
                          url: apiUrl+'delete/'+iden+'?tableName=idndetails&filter=where id='+id, //Your url will be like this.
                          method: 'delete',
                          data:{idn:iden},
                          headers: {'Content-Type': 'application/json'}
                          })
                        .success(function(data)
                          {
                             var row = $('#removecenter'+id).closest("tr").get(0);
                             
                              var oTable = $("#centertable").dataTable(); // JQuery dataTable function to delete the row from the table
                              oTable.fnDeleteRow(oTable.fnGetPosition(row));
                                  //$('#removecenter'+id).hide();
                                  //$('#removecenter'+id).closest('tr').remove();

                                  
                                  $scope.Listcenters.splice(index, 1);

                                  $scope.dtOptions = DTOptionsBuilder.newOptions()
                                  .withPaginationType('full_numbers')
                                  .withDisplayLength(10)
                                  .withOption('order', [0, 'asc']);
                                  $scope.dtOptions.searching = true;
                                $scope.dtOptions.deferRender = true;
                                $scope.dtOptions.bPaginate=true;
                                $scope.dtOptions.bInfo = true;
                                $scope.dtOptions.iTotalRecords = $scope.Listcenters.length;
                                   
                                 // $scope.updateCenters(); 

                          });
                            }
                        }, function(stat) {


                        });
                 
              };

               $scope.editView = function(id)
              {
                  //console.log(id);
                  $state.go("ctApp.addCenter", { editId: id});
              };


   
  }])
.controller('AddCenterscntrl', ['$scope','$http','$state','$modal','DTOptionsBuilder','$timeout','$stateParams','$localStorage',  function($scope,$http,$state,$modal,DTOptionsBuilder,$timeout,$stateParams,$localStorage) {


  $scope.addCenter = {};
  $scope.addCenter.email = [''];

  $scope.uniqueueError = 0;
  $scope.disableButton = 0; 
  var totaluniqueue = [];
  $scope.userDetals = $localStorage.userName;
  $scope.editUser = 0;
  $scope.user_id = 0;
  $scope.addupdatebtn = "Add Center";

  $scope.closeAlert = function(index) {
              $scope.errortype = 0;
            };


  $scope.checkuniqueue = function(field,value,tablename,uniqueue)
  {
    $scope.uniqueueErroruser = 0;
    $scope.uniqueueErrorhos = 0;
    $('#'+uniqueue+"bor").css('border','');

    if(tablename==='idndetails' && $scope.copyIDN3===angular.lowercase(value)){ if(totaluniqueue.length<0){totaluniqueue = [];} return false;}
    if(tablename==='users' && $scope.copyusername===angular.lowercase(value)){  if(totaluniqueue.length<0){totaluniqueue = [];} return false;}
    
    if(angular.isDefined(value))
    { 
        if(uniqueue==='3')
        {
          var ind3hospital = (angular.isDefined($scope.addCenter.IDN3))?$scope.addCenter.IDN3:"";
          $scope.filter = "where " +field+ " = '"+ value+ "' and hospital='"+ind3hospital+"'";
          $scope.msg ="User Name Aleready Exit!!!";
          $scope.uniqueueErroruser = 3;
        }
        else
        {
            $scope.filter = "where " +field+ " = '"+ value+ "'";
            $scope.msg = "Hospital Value Aleready Exit!!";
            $scope.uniqueueErrorhos = 2;
        }
        $scope.filter = "where " +field+ " = '"+ value+ "'";

        $http({
                url:apiUrl+"getCptTable?tableName="+tablename+"&filter="+ $scope.filter+" limit 1&fields="+field, 
                method: 'get',
                data:value ,
                headers: {'Content-Type': 'application/json'}
                })
              .success(function(data)
                {

                  if(data.length ==1)
                  {
                    $scope.errortype = 1;
                    $scope.alrttype = "danger";
                    $scope.uniqueueError = uniqueue;
                    
                    totaluniqueue.push(uniqueue);
                    $('#'+uniqueue+"bor").css('border','1px solid #F00');
                    
                    $timeout(function() {/*$scope.uniqueueError=0;*/$scope.errortype = 0;}, 3000);

                  }
                  else
                  {
                    
                        var arrayindex = totaluniqueue.indexOf(uniqueue);
                        $('#'+uniqueue+"bor").css('border','1px solid #27c24c');
                          
                        if(arrayindex>=0)
                        {
                         totaluniqueue.splice(arrayindex, 1);
                         
                        }
                  }
                 
                });

    }
      
  };

  $scope.savecenter = function()
  {
    $scope.disableButton = 0; 
      if(totaluniqueue.length>0)
      {
          var unique = _.uniq(totaluniqueue);

          if($scope.copyIDN3!==angular.lowercase($scope.addCenter.IDN3) || $scope.copyusername!==angular.lowercase($scope.addCenter.username))
          {
           /* $scope.errortype = 1;
            $scope.alrttype = "danger";
            var bothunique = (unique.length>3)?" Hospital,Username":"";
            $scope.msg = "Please check "+ bothunique +" unique!!";
            return false;*/
          }
      }
     if ($scope.addcenter.$valid)
        {
          
          $scope.msg = '';

          $scope.addcenterDBfields= {};
          
          $scope.disableButton = 1;
          $scope.errortype = 0;

          $scope.addusersDBfields= {};

          $scope.addcenterDBfields.IDNNAME= $scope.addCenter.IDNNAME;
          $scope.addcenterDBfields.IDN3= $scope.addCenter.IDN3;
          $scope.addcenterDBfields.status= $scope.addCenter.status;
          
          

          $scope.addusersDBfields.username= $scope.addCenter.username;
          $scope.addusersDBfields.password= $scope.addCenter.pwd;
          $scope.addusersDBfields.is_super_user= $scope.addCenter.is_super_user;
          $scope.addusersDBfields.hospital= ($scope.addCenter.IDN3!==null && $scope.addCenter.IDN3!=='null')?$scope.addCenter.IDN3:"";
          $scope.addusersDBfields.name= $scope.addCenter.IDNNAME;
            //var arr = ($scope.addCenter.email);
            //console.log(arr.filter(function(v){return v!=='';}));
          $scope.addusersDBfields.email= ($scope.addCenter.email.length>0)?JSON.stringify($scope.addCenter.email):[];
        //  console.log(_.without($scope.addCenter.email, ""));
        mixpanel.track("Add Center", {
                                  "IDNNAME": $scope.addCenter.IDNNAME,
                                  "IDN3":$scope.addCenter.IDN3,
                                  "USERNAME": $scope.addCenter.username
                              });
          var idndetailsurl ="";
          var usersurl ="";
          if($stateParams.editId!=='' && $stateParams.editId.length>0)
          {
            idndetailsurl = apiUrl+'update?tablename=idndetails&filter=where id ='+$stateParams.editId;
            $scope.addcenterDBfields.edited_on= moment().format("YYYY-MM-DD HH:MM");
            if($scope.user_id>0)
            {
              usersurl = apiUrl+"update?tablename=users&filter=where id='"+$scope.user_id+"'";
            $scope.addusersDBfields.edited_on= moment().format("YYYY-MM-DD HH:MM");
            
            }
            else
            {
               usersurl = apiUrl+'insert?tablename=users';
               $scope.addusersDBfields.created_on= moment().format("YYYY-MM-DD HH:MM");
          
            }
            
          }
          else
          {
            idndetailsurl = apiUrl+'insert?tablename=idndetails';
            usersurl = apiUrl+'insert?tablename=users';
            
            $scope.addcenterDBfields.created_on = moment().format("YYYY-MM-DD HH:MM");
               
          }

          $http({
                url:apiUrl+"getCptTable?tableName=idndetails&filter= where IDN3 = '"+ $scope.addCenter.IDN3+"' limit 1&fields=IDN3,IDNNAME", 
                method: 'get',
                data:'' ,
                headers: {'Content-Type': 'application/json'}
                })
              .success(function(idn_data)
                {
                  
                 if(idn_data.length>0)
                 {
                    if($scope.copyIDN3!==angular.lowercase($scope.addCenter.IDN3))
                    {
                      
                    $scope.errortype = 1;
                    $scope.alrttype = "danger";
                    $scope.disableButton = 0;
                    $scope.msg = "Please check Usercode Unique!!";
                     return false;
                   }
                 }

                 $http({
                url:apiUrl+"getCptTable?tableName=users&filter= where username = '"+ $scope.addCenter.username+"' limit 1&fields=username", 
                method: 'get',
                data:'' ,
                headers: {'Content-Type': 'application/json'}
                })
              .success(function(user_data)
                {
                 if(user_data.length>0)
                 {
                  if($scope.copyusername!==angular.lowercase($scope.addCenter.username))
                  {
                    $scope.errortype = 1;
                    $scope.alrttype = "danger";
                    $scope.disableButton = 0;
                    $scope.msg = "Please check Username Unique!!";
                    return false;
                  }
                 }
                

               $http({
                       url: idndetailsurl,//'http://patint.bitnamiapp.com:9000/insert?tablename=medrecidn3', //Your url will be like this.
                      method: 'post',
                      data:$scope.addcenterDBfields,
                      headers: {'Content-Type': 'application/json'}
                      })
                    .success(function(data)
                      {
                                if(data>0)
                                {
                                        $http({
                                               url: usersurl,
                                              method: 'post',
                                              data:$scope.addusersDBfields,
                                              headers: {'Content-Type': 'application/json'}
                                              })
                                              .success(function(data)
                                               {
                                                if(data==3)
                                                {
                                                  $scope.errortype = 1;
                                                  $scope.alrttype = "success";
                                                  $scope.msg = "successfully Updated Center!!";
                                                  $timeout(function() {$state.go("ctApp.ui_grid");}, 1500);
                                                  return false;
                                                }
                                                $scope.errortype = 1;
                                                $scope.alrttype = "success";
                                                $scope.msg = "successfully Inserted Center!!";
                                                $timeout(function() {$state.go("ctApp.ui_grid");}, 1500);
                                                return false;
                                               });
                                }
                });// INSERT IDE and USER TABLE REST
      });// CHECK USER DETAILS

    });//CHECK IDEN DETAILS TBLE 
        }
  };

  


   if($stateParams.editId!=='' && $stateParams.editId.length>0)

          {
            $scope.emailaddshow = 20;
            $scope.addupdatebtn = "Update Center";
            $http({
                url: apiUrl+'getCptTable?tableName=idndetails&filter=where id= '+$stateParams.editId+' order by IDNNAME asc&fields=status,IDN3,IDNNAME,id,PATINT&limit=1', 
                method: 'get',
                data:'' ,
                headers: {'Content-Type': 'application/json'}
                })
              .success(function(data)
                {
                  
                  $scope.emailLenth = 0;
                  if(data.length>0) 
                  {
                    
                    $scope.addCenter.IDNNAME = data[0].IDNNAME;
                    $scope.addCenter.IDN3 = data[0].IDN3;
                    $scope.copyIDN3 = angular.lowercase(data[0].IDN3);
                    $scope.addCenter.status = data[0].status;

                    
                    $http({
                        url: apiUrl+"getCptTable?tableName=users&filter=where hospital= '"+$scope.addCenter.IDN3 +"' &fields=password,name,username,hospital,id,is_super_user,email&limit=1", 
                        method: 'get',
                        data:'' ,
                        headers: {'Content-Type': 'application/json'}
                        })
                      .success(function(data)
                        {
                          
                          if(data.length>0) 
                          {
                            
                            $scope.editUser = 1;
                            $scope.user_id = data[0].id;
                            $scope.addCenter.username = data[0].username;
                            $scope.copyusername = angular.lowercase(data[0].username);
                            $scope.addCenter.is_super_user = data[0].is_super_user;
                            $scope.addCenter.pwd = data[0].password;
                            //var arr = JSON.parse(data[0].email);
                            //console.log(arr.filter(function(v){return v!=='';}));
                            $scope.addCenter.email = (data[0].email!=null && data[0].email.length>0 )?JSON.parse(data[0].email):[''];
                            
                          } 
                                          
                        });
                   
                  } 
                                  
                });
          }


          $scope.addemail= function(index) {
                           
                var email = $scope.addCenter.email;
                if($scope.addCenter.email[index]==='')
                {
                  $('#row'+index).css('border', '1px solid #a94442');
                  $timeout(function(){$('#row'+index).css('border', '');},2000);
                    return false;                  
                }
                if($scope.addCenter.email.length>4)
                {
                  return false;
                }
                $scope.addCenter.email[email.length] = '';
             
            };

            $scope.removeemail = function(index2) {
                
                  
                    $scope.addCenter.email.splice(index2, 1);
                    if($scope.addCenter.email.length<=0)
                    {
                      
                      $scope.addCenter.email[0] = '';

                    }
                
            };


}])
.controller('deletecontroler', ['$modalInstance','$scope','$state','$timeout',function($modalInstance,$scope,$state,$timeout)
{
  $scope.close = function()
    {
      $modalInstance.close(0);
    };
    $scope.yes = function()
    {
      $scope.errorcls = false;
      if($scope.deletenotify!=="DELETE")
      {
        $scope.errorcls = true;
        return false;
      }

      $modalInstance.close(1);
    };
}])
.controller('statuscontroler', ['$modalInstance','$scope','$state','$timeout',function($modalInstance,$scope,$state,$timeout)
{
  $scope.close = function()
    {
      $modalInstance.close(0);
    };
    $scope.yes = function()
    {
      
      $modalInstance.close(1);
    };
}])
;
