angular.module('ctApp.uploaddata', [
        'ui.router'
    ])
    
    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;
        $stateProvider.state('ctApp.uploaddata', {
            url: '/UploadData/',
            views: {
                "appNested": {
                    controller: 'uploaddataCtrl',
                    templateUrl: 'ct-app/uploaddata/uploaddata.tpl.html'
                }
            },
            data: {
                pageTitle: 'Upload Data'
            },
            access: access.public
        });
    })
//https://docs.google.com/spreadsheets/d/1dSiX80-N9iOCGcpGq1y6xVMIxrzT0T2zzDvcaojUoxI/edit#gid=1162041844
.controller('uploaddataCtrl', ['$stateParams', '$scope', '$timeout', '$http', '$state', '$cookieStore', '$localStorage', '$filter', 'popupservice', '$modal','$rootScope', 'FileUploader', function($stateParams, $scope, $timeout, $http, $state, $cookieStore, $localStorage, $filter, popupservice, $modal,$rootScope, FileUploader) {
	var idn = ($localStorage.IDN)?$localStorage.IDN:'';
  var created_id = ($localStorage.userName)?$localStorage.userName['id']:"";
  $scope.file_format = $localStorage.file_format;

 

	$scope.headreSt = 0;
	$scope.fileerror = 0;
	$scope.headerow = false;
  $scope.favhide = 0;
  $scope.rowcount = [];
  $scope.cptfavrow = 0;
  $scope.typefileId = "upload-1";
	var uploader = $scope.uploader = new FileUploader({
        url: apiUrl+'uploadFile?centername='+idn+"&header="+$scope.headreSt

    });

	uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            //return this.queue.length < 1;
            return item.size < 1000000;
        }
    });

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 4;
       //     return item.size < 1000000;
        }
    });
   

	$scope.uploadFun = function(value)
	{		
    $scope.fileerror = 1;
    $scope.rowcount = [];

    if($scope.UnknowfileFmt>0)
    {
       $scope.msg = "Unknow File Format Found!!!";
      //return false;
    }
      
      $scope.diasbleUpload = 1;
      $scope.typefileId = "upload-2";
      
      $scope.type ='warning';
      $scope.msg= "Please wait upload in progress!!!";
			$scope.headreSt = ($scope.headerow===true)?1:0;
      $scope.cptfav = ($scope.cptfavrow===true)?1:0;
      
								//var uploader = $scope.uploader = new FileUploader({url: apiUrl+'uploadFile?centername='+idn+"&header="+headreSt});
								uploader.queue[0].url = apiUrl+'uploadFile?centername='+idn+"&header="+$scope.headreSt+"&FileFormat="+$scope.file_format+"&created_id="+created_id+"&cptFav="+$scope.cptfav;
								//uploader.url = apiUrl+'uploadFile?centername='+idn+"&header="+$scope.headreSt;
								
								if(value)
								{
                 
								value.upload();										
								}
								else
								{
                 
									for(var i=0;i<(uploader.queue).length;i++)
									{

										uploader.queue[i].url = apiUrl+'uploadFile?centername='+idn+"&header="+$scope.headreSt+"&FileFormat="+$scope.file_format+"&created_id="+created_id+"&cptFav="+$scope.cptfav;
									}
								uploader.uploadAll();	
								}
								
			};

                        $http({
                        url: apiUrl + "getCptTable?tableName=cpt_code_fav&filter=where idn3 ='"+idn+"'  &fields=cpt_codes,idn3", //Your url will be like this.
                        method: 'get',
                        data: '',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })  
                    .success(function(datafav) {
                      if(datafav.length>0)
                      {
                        var cpt_fav_codes = JSON.parse(datafav[0].cpt_codes,true);
                        if(cpt_fav_codes.length>0){$scope.favhide = 1;}
                      }
                    });

    // FILTERS

   

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      // console.info('onWhenAddingFileFailed', item, filter, options);
      $scope.msg = '';
      $scope.uploadDisable = 0;
      if(item.size>1000000)
      {
		$scope.fileerror = 1;
		$scope.msg = "File size should be less 1 mb";
      }
	
      
      $timeout(function(){
		$scope.fileerror = 0;
      },3000);

      //console.log($scope.msg);
      
    };
    uploader.onAfterAddingFile = function(fileItem) {
		$scope.uploadDisable = 0;
    $scope.UnknowfileFmt = 0;
    console.log(fileItem.file['type']);
  if(fileItem.file['type']!=='text/csv' && fileItem.file['type']!=='application/vnd.ms-excel' && fileItem.file['type']!=='text/plain')
  {
	
		$scope.fileerror = 1;
    $scope.UnknowfileFmt = 1;
		$scope.msg = "Unknow File Format";
		$scope.uploadDisable = 1;
		$timeout(function(){
		$scope.fileerror = 0;
      },3000);
  }
       // console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
       // console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
	
 
//console.info('onBeforeUploadItem', item);

    };
    uploader.onProgressItem = function(fileItem, progress) {
        //console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        //console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {

  // $scope.resAl = _.pluck(response, 'status');
  $scope.msg = '';
   console.log(response);
   $scope.diasbleUpload = 0;
   $scope.fileerror = 1;
   $scope.rowcount = [];
   $scope.typefileId = "upload-1";
   $scope.type ='danger';

   
   if(response.failed=='error')
   {	
   fileItem.isSuccess = false;
	fileItem.isError = true;
	$scope.fileerror = 1;
	$scope.rowcount.push("Medical record cannot be saved File Name: "+response.filename);
	$scope.uploadDisable = 1;
  $scope.type ='danger';
	$timeout(function(){
	//$scope.fileerror = 0;
    },3000);
    //return false;
   }
   else
   {
    $scope.rowcount.push("Duplicate Records : "+ response.already.length);
    $scope.rowcount.push("Failed Records : "+ response.failed.length);
   $scope.rowcount.push("Medical record didn't saved because DOP is older than 3 months : "+ response.dopfailed.length);
   $scope.fileerror = 1;
  $scope.type ='success';
 // $scope.rowcount.push("Medical record saved :" + response.success.length);
  $scope.uploadDisable = 1;
   }
	
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
       // console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
       // console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        //console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
       
    };
   $scope.removeAll = function() {
       $scope.fileerror = 0;
      $scope.diasbleUpload = 0;
      $scope.rowcount = [];
      $scope.typefileId = "upload-1";
      uploader.clearQueue();
    };

    
     $scope.closeAlert = function(index) {
            $scope.fileerror = 0;
        };
        $scope.removeItem = function(item)
        {
           $scope.fileerror = 0;
      $scope.diasbleUpload = 0;
      $scope.rowcount = [];
      $scope.typefileId = "upload-1";

          item.remove();
        };

    //console.info('uploader', uploader);
}])
   .controller('fileuplodModelCtrl', ['$modalInstance','$scope','$state','$timeout',function($modalInstance,$scope,$state,$timeout)
{
  $scope.close = function()
    {
      $modalInstance.close(0);
    };
    $scope.yes = function()
    {
      $modalInstance.close(1);
    };
}]);