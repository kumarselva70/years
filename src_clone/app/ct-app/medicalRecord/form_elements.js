angular.module('ctApp.elements', [
        'ui.router'
    ])
    .filter('twelehours', function() {
        return function(input) {
            if (!angular.isUndefined(input)) {
                var output = (moment(input, "hmm").format("hh:mm A"));
                if (output == 'Invalid date') {
                    output = "Invalid Value";

                }
                return output;

            }

        };
    })
    .filter('hourmints', function() {
        return function(medical, out) {
            if(medical)
            {
            var objkey = out.split(',');
            if (typeof(objkey) !== "undefined") {
                var start = (moment(medical[objkey[0]], "hmm").format("HH:mm a"));
                var end = (moment(medical[objkey[1]], "hmm").format("HH:mm a"));

                if (start !== 'Invalid date' && end !== "Invalid date") {
                    var startTime = moment(start, "HH:mm:ss a");
                    var endTime = moment(end, "HH:mm:ss a");

                    var duration = moment.duration(endTime.diff(startTime));
                    var hours = parseInt(duration.asHours(), 10);
                    var minutes = parseInt(duration.asMinutes() + 1, 10) - hours * 60;

                    if (minutes > 0) {
                        var hourss = Math.floor(minutes / 60);

                        // minutes = minutes % 60;

                        minutes = Number(minutes - 1) + Number(hours * 60);

                        return minutes + " Mins ";
                    }

                }
            }
        }


        };
    })
    .filter("sanitize", ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        };
}])

.filter('totalhourmints', function() {
        return function(medical, out) {

            var objkey = out.split(',');
            var totalHour = '';
            var totalMins = 0;



            if (typeof(objkey) !== "undefined") {

                var orinstart = (angular.isDefined(medical[objkey[0]])) ? (moment(medical[objkey[0]], "hmm").format("HH:mm a")) : "00:00";
                var orinend = (moment(medical[objkey[1]], "hmm").format("HH:mm a"));

                var pstartstart = (moment(medical[objkey[2]], "hmm").format("HH:mm a"));
                var pend = (moment(medical[objkey[3]], "hmm").format("HH:mm a"));

                var tpend = (moment(medical[objkey[4]], "hmm").format("HH:mm a"));
                var recov5 = (moment(medical[objkey[5]], "hmm").format("HH:mm a"));



                /*if(orinstart!=='Invalid date' && orinend !=="Invalid date")
                {
                var startTime=moment(orinstart, "HH:mm:ss a");
                var endTime=moment(orinend, "HH:mm:ss a");
                var duration = moment.duration(endTime.diff(startTime));
                var hours = parseInt(duration.asHours(),10);
                var minutes = parseInt(duration.asMinutes(),10)-hours*60; 
                totalHour = hours;
                totalMins = Number(minutes);
                }
                if(pstartstart!=='Invalid date' && pend !=="Invalid date")
                {
                var startTime1=moment(pstartstart, "HH:mm:ss a");
                var endTime1=moment(pend, "HH:mm:ss a");
                var duration1 = moment.duration(endTime1.diff(startTime1));
                 var hours1 = parseInt(duration1.asHours(),10);
                 var minutes1 = parseInt(duration1.asMinutes(),10)-hours1*60; 
                 totalHour += hours1;
                totalMins = Number(totalMins) + Number(minutes1);
                }*/
                if (recov5 !== "Invalid date") {
                    var startTime2 = moment(orinstart, "HH:mm:ss a");
                    var endTime2 = moment(recov5, "HH:mm:ss a");
                    var duration2 = moment.duration(endTime2.diff(startTime2));
                    var hours2 = parseInt(duration2.asHours(), 10);
                    var minutes2 = parseInt(duration2.asMinutes(), 10) - hours2 * 60;
                    totalHour += hours2;
                    totalMins = Number(totalMins) + Number(minutes2);
                }

                //var hourss = Math.floor( totalMins / 60);

                //var minutess = totalMins % 60;


                // totalHour +=hourss;
                totalMins = Number(totalMins) + Number(totalHour * 60);

                //totalMins+=":"+minutess;
                if (totalMins > 0) {
                    return totalMins + " Mins ";
                }
                //totalHour+" Hrs "+  totalHour>0 || 
                //console.log(totalMins);

            }


        };
    })
    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;
        $stateProvider.state('ctApp.elements', {
            url: '/MedicalRecord/:editId',
            views: {
                "appNested": {
                    controller: 'elementsCtrl',
                    templateUrl: 'ct-app/medicalRecord/medicalRecord.tpl.html'
                }
            },
            data: {
                pageTitle: 'Form Elements'
            },
            access: access.public
        });
    })

.controller('elementsCtrl', ['$stateParams', '$scope', '$timeout', '$http', '$state', '$cookieStore', '$localStorage', '$filter', 'popupservice', '$modal','$rootScope', '$sce', function($stateParams, $scope, $timeout, $http, $state, $cookieStore, $localStorage, $filter, popupservice, $modal,$rootScope, $sce) {
        $scope.userDetals = $localStorage.userName;
        if($scope.userDetals===null || angular.isUndefined($scope.userDetals))
              {
                return false;
              }

  //            var a = moment('2016-06-06T21:03:55');//now
//var b = moment('2016-05-06T20:03:55');
//console.log(a.diff(b, 'years')) ;// 4

           // $scope.$watch('medicalRecord.AGE', function(Newvalue, oldValue)
            //{
                $scope.agecall = function(Newvalue)
                {
                if(!angular.isUndefined(Newvalue) && Newvalue.length>1)
                                {
                    
                    $scope.ageyear = moment().subtract(Newvalue, 'years').endOf('month').format('YYYY');
                    
                    }
                };

                
            //});
                   
              

    //$scope.$watch('ageyear', function(Newvalue, oldValue) {
$scope.yearcall = function(ageyear)
{


            if ( ageyear && ageyear.length>3) {

                 var cur = new Date();
                var tar = new Date( $scope.ageyear);
                      
                  // Get difference of year
                  var age = cur.getFullYear() - tar.getFullYear();

                  // If current month is > than birth month he already had a birthday
                  if (cur.getMonth() > tar.getMonth()) {
                     age ++;
                  } 
                  // If months are the same but current day is >= than birth day same thing happened 
                  else if (cur.getMonth() == tar.getMonth() && cur.getDate() >= tar.getDate()) {
                     age ++;
                  }
                  var ag = "0"+(age-1);

                $scope.medicalRecord.AGE = (age>10)?parseInt((age-1),10):ag;
            }
        };
        //});


        $scope.medicalRecord = {};
        //$scope.medicalRecord.optionalcenter = {};
        //$scope.medicalRecord.postperative = {};
        //$scope.names= ["None","Epidural", "General", "Unassigned","MAC", "IVCONSED", "Block","Epidural", "Topical","Local","Other"];
        $scope.names3 = ["None", "Epidural", "General", "Unassigned", "MAC", "IVCONSED", "Block", "Topical", "Local", "IVGeneral ","Other"];
        // $scope.medicalRecord.ANESTHESIA=$scope.names3[0];
        $scope.names2 = ["None", "ASAI", "ASAII", "ASAIII","ASAIV", "Unassigned"];
        // $scope.medicalRecord.ASACODE=$scope.names2[0];


        //$scope.medicalRecord.ANESTHESIA = $scope.names3[0];
        //$scope.medicalRecord.ASACODE = $scope.names2[0];
        //$scope.medicalRecord.patient_int = '-1';
        $scope.patientInerview = function() {

            $state.go("ctApp.fileupload", {
                editId: $scope.lstInserId
            });
        };
        $scope.cancel = function() {
            
            $state.go("ctApp.tablestatic", {IDN:$localStorage.IDN});//{ IDN: IDN3}

            //$state.go("ctApp.tablestatic");
        };
        $scope.printForm = function() {
                var printDivCSS = String ('<link href="assets/ngbp-0.3.2.css" rel="stylesheet" type="text/css">');
           // var printContents = $('#print_Medicalform').html();
             w=window.open();

             w.document.write(printDivCSS + document.getElementById('print_Medicalform').innerHTML);
             w.print();
             w.close();
        };

        $scope.dateOptions = {
            minDate: new Date()
        };

        var now = new Date();
        

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.mindate = new Date(now.setMonth(now.getMonth() - 3));
        $scope.maxdate = new Date();


        $scope.showcalendar = function($event) {
            $scope.showdp = true;
        };
        $scope.showdp = false;


        $http({
                //url: apiUrl+'getCptTable?tableName=cpt_codes&filter=limit 5&&fields=DESCRIPTION,CODE,BENCHMARK', //Your url will be like this.
                //apiUrl+'getCptTable?tableName=cpt_groups&filter=limit 8&fields=PROCEDURE_GROUP', //Your url will be like this.
                url: apiUrl + 'getCptTable?tableName=cpt_codes&filter=order by PROCEDURE_GROUP asc limit 10&&fields=DESCRIPTION,CODE,BENCHMARK,PROCEDURE_GROUP', //Your url will be like this.
                method: 'get',
                data: $scope.medicalRecord.pin,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(data) {
                if (data.length > 0) {
                    $scope.cptCodes = [];

                    angular.forEach(data, function(value, key) {

                        /*$scope.cptCodes.push({
                            CODE: "(" + value.CODE + ") " + value.DESCRIPTION,
                            DESCRIPTION: value.PROCEDURE_GROUP,
                            BENCHMARK: value.BENCHMARK,
                            CPTCODE: value.CODE
                        });*/

                    $scope.cptCodes.push({
                            CODE:  value.PROCEDURE_GROUP +" (" + value.CODE + ") - " + value.DESCRIPTION,
                            DESCRIPTION: value.PROCEDURE_GROUP,
                            BENCHMARK: value.BENCHMARK,
                            CPTCODE: value.CODE
                        });
                        //$scope.cptCodes.push({CODE:value.PROCEDURE_GROUP,DESCRIPTION:value.PROCEDURE_GROUP});
                    });
                    //console.log($scope.cptCodes);

                }
                //console.log($scope.cptCodes);                
            });
                        
                                    var nameidn3 = ($localStorage.IDN)?$localStorage.IDN:$scope.userDetals.hospital;

                                    $http({
                                      url: apiUrl+"getCptTable?tableName=idndetails&fields=IDN3,IDNNAME&filter=where IDN3='"+nameidn3 +"' limit 0,1",
                                      method: 'get',
                                      data:'' ,
                                      headers: {'Content-Type': 'application/json'}
                                      })
                                    .success(function(data)
                                      {
                                        if(data.length>0)
                                        {
                                            $scope.centerName = data[0].IDNNAME;
                                            $scope.IDN3 = data[0].IDN3;
                                                 
                                        }
                                        
                                           
                                      });




        $scope.$watch('medicalRecord.DOP', function(Newvalue, oldValue) {

            if (Newvalue) {
                //console.log($scope.medicalRecord.DOP);
            }
        });

        $scope.$watch('medicalRecord.AntibioNam', function(Newvalue, oldValue) {


            if (Newvalue) {

                if (Newvalue.value == 'none') {
                    $scope.medicalRecord.AntibioTim = '00:00';
                    $scope.antibi = 0;
                    $scope.AntibioTimtrue = 0;
                } else {
                    $scope.antibi = 1;
                    if ($stateParams.editId === '') {
                        $scope.medicalRecord.AntibioTim = '';
                    } else {
                        $scope.medicalRecord.AntibioTim = $scope.AntibioTimINT;
                    }
                    //
                }

            }
        });


        $scope.anyDirtyAndInvalid = function() {
            $total_formname = [];

            $scope.errmsge = 'ERROR: Missing the following required fields.';
            $scope.arr = {};
            var name;
            $scope.arr = {
                "pin": "Patient Pin",
                "sex": "Patient Gender",
                "age": "Patient Age",
                "procedureorstart": "Procedure Start",
                "The_Procedure_End_Time": "Procedure End Time",
                "discharge": "Discharge Time",
                "pationDispostion": "Patient's dissposition",
                "PainVerbalized": "Pain verbalized",
                "PatientInterview": "Patient Interview",
                "dop": "Date of Service",
                "anesthesia": "Anesthesia"
            };
            //["pin", "sex", "age", "procedureorstart", "procedureorend", "discharge", "pationDispostion", "PainVerbalized", "PatientInterview", "dop"]
            //["pin", "sex", "age", "procedureorstart", "procedureorend", "discharge", "pationDispostion", "PainVerbalized", "PatientInterview", "dop"]
            if (angular.isDefined($scope.personal.$error.required)) {

                for (var x in $scope.personal.$error.required) {
                    //console.log($scope.personal.$error.required[x].$name);
                    //console.log($scope.personal.$dirty);
                    if ($scope.personal.$error.required[x].$error.required === true)


                    {
                        if ($total_formname.indexOf($scope.personal.$error.required[x].$name) == -1) {
                            if (name != $scope.arr[$scope.personal.$error.required[x].$name]) {
                                name = $scope.arr[$scope.personal.$error.required[x].$name];
                                $total_formname.push(name);

                            }

                            //$total_formname.push($scope.personal.$error.required[x].$name);
                        }
                    }
                }
                // $scope.ErrorFileds = ($total_formname.join(', ')); 
                $scope.ErrorFileds = $total_formname;
            }
            if (angular.isUndefined(name)) {
                $scope.ErrorFileds = [];
            }

        };
        $scope.submitForm = function() {

            $scope.submit = true;

        };
        $scope.onKeyUp = function(time, id, values) {

            if (!angular.isUndefined(time)) {

                $('#' + id).css('border', '1px solid #27c24c');

                if (time.length > 0) {
                    var twntyfour = time.substring(0, 2);
                    var sixty = time.substring(2, 4);
                    if (twntyfour > 23 || sixty > 59) {
                        $('#' + id).css('border', '1px solid #F00');
                        return false;
                    } else {

                        $('#' + id).css('border', '1px solid #27c24c');
                    }
                }
            } else {


                if (values !== 6) {

                    $('#' + id).css('border', '1px solid #F00');
                }




            }

        };

        $scope.PSTART = function(orgin, pstart, value, id) {
            $scope.PSTART1 = false;
            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);

                if (twntyfour > 23 || sixty > 59) {

                    $('#PSTART').css('border', '1px solid #F00');
                    $scope.PSTART1 = true;
                    return false;
                }
            }
        };
        $scope.PEND = function(orgin, pstart, value, id) {
            $scope.PEND1 = false;
            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);

                if (moment.utc(moment(orgin, "HH:mm")) > moment.utc(moment(pstart, "HH:mm")) || twntyfour > 23 || sixty > 59) {
                    $('#PEND').css('border', '1px solid #F00');
                    $scope.PEND1 = true;
                    $scope.ErrorFileds = ['Procedure End'];
                    return false;
                }
            }
        };
        $scope.OROUT = function(orgin, pstart, value, id) {
            $scope.OROUT1 = false;
            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);
                //moment.utc(moment(orgin,"HH:mm"))>moment.utc(moment(pstart,"HH:mm")) ||
                if (moment.utc(moment(orgin, "HH:mm")) > moment.utc(moment(pstart, "HH:mm")) || twntyfour > 23 || sixty > 59) {
                    $('#OROUT').css('border', '1px solid #F00');
                    $scope.OROUT1 = true;
                    return false;
                }

            }

        };

        $scope.ORin = function(orgin, pstart, value, id) {
            $scope.orintime1 = false;
            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);

                if (twntyfour > 23 || sixty > 59) {

                    $('#hourorin').css('border', '1px solid #F00');
                    $scope.orintime1 = true;
                    return false;
                }
            }
        };
        $scope.AntibioTim = function(orgin, pstart, value, id) {
            $('.AntibioTimm').css('border', '1px solid #27c24c');
            $scope.AntibioTim1 = false;
            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);
                //moment.utc(moment(orgin,"HH:mm"))<moment.utc(moment(pstart,"HH:mm")) || 
                if (twntyfour > 23 || sixty > 59) {

                    $('.AntibioTimm').css('border', '1px solid #F00');
                    $scope.AntibioTim1 = true;
                    return false;
                }

            }

        };
        $scope.RECOV5 = function(orgin, pstart, value, id) {
            $scope.RECOV51 = false;
            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);
                if (moment.utc(moment(orgin, "HH:mm")) > moment.utc(moment(pstart, "HH:mm")) || twntyfour > 23 || sixty > 59) {
                    $('#RECOV5').css('border', '1px solid #F00');
                    $scope.RECOV51 = true;
                    $scope.ErrorFileds = ['Discharge Time'];
                    return false;
                }
            }
        };

        $scope.opt1 = function(orgin, pstart, value, id) {
            $scope.opttime1 = false;
            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);

                if (twntyfour > 23 || sixty > 59) {

                    $('#RECOV1').css('border', '1px solid #F00');
                    $scope.opttime1 = true;
                    return false;
                }
            }
        };
        $scope.opt2 = function(orgin, pstart, value, id) {
            $scope.opttime2 = false;

            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);

                if (twntyfour > 23 || sixty > 59) {

                    $('#RECOV2').css('border', '1px solid #F00');
                    $scope.opttime2 = true;
                    return false;
                }
            }
        };
        $scope.opt3 = function(orgin, pstart, value, id) {
            $scope.opttime3 = false;
            if (pstart > 0) {
                var twntyfour = pstart.substring(0, 2);
                var sixty = pstart.substring(2, 4);

                if (twntyfour > 23 || sixty > 59) {

                    $('#RECOV3').css('border', '1px solid #F00');
                    $scope.opttime3 = true;
                    return false;
                }
            }
        };

        $scope.refreshAntibioNam = function() {
            // console.log($scope.medicalRecord.AntibioNam);
        };


        

        //(moment.utc(moment(now,"HH:mm:ss").diff(moment(then,"HH:mm:ss"))).format("HH:mm"));

        $scope.Antibiotic = [{
                name: "None",
                value: "none"
            }, {
                name: "Ampicillin/sulbactam",
                value: "Ampicillin/sulbactam"
            }, {
                name: "Aztreonam",
                value: "Aztreonam"
            }, {
                name: "Cefepime hydrochloride (Maxipime)",
                value: "Cefepime hydrochloride (Maxipime)"
            }, {
                name: "Cefmetazole (Zefazone)",
                value: "Cefmetazole (Zefazone)"
            }, {
                name: "Cefotetan selected",
                value: "Cefotetan selected"
            }, {
                name: "Cefoxitin (Mefoxin)",
                value: "Cefoxitin (Mefoxin)"
            }, {
                name: "Ceftazidime (Zinacef)",
                value: "Ceftazidime (Zinacef)"
            }, {
                name: "Cefuroxime (Fortaz)",
                value: "Cefuroxime (Fortaz)"
            }, {
                name: "Ceftriaxone (Rocephin)",
                value: "Ceftriaxone (Rocephin)"
            }, {
                name: "Cefuroxime (Zinacef)",
                value: "Cefuroxime (Zinacef)"
            }, {
                name: "Ciprofloxacin (Cipro)",
                value: "Ciprofloxacin (Cipro)"
            }, {
                name: "Clindamycin (Cleocin)",
                value: "Clindamycin (Cleocin)"
            }, {
                name: "Cefazolin (Ancef)",
                value: "Cefazolin (Ancef)"
            },
            {
                name: "Ertapenem (Invanz)",
                value: "Ertapenem (Invanz)"
            }, {
                name: "Erythromycin (Erythrocin)",
                value: "Erythromycin (Erythrocin)"
            }, {
                name: "Gentamicin",
                value: "Gentamicin"
            }, {
                name: "Metronidazole (Flagyl)",
                value: "Metronidazole (Flagyl)"
            }, {
                name: "Neomycin (Mycifradin, Neo-Fradin)",
                value: "Neomycin (Mycifradin, Neo-Fradin)"
            }, {
                name: "Pentamidine (Nebupent, Pentam 300)",
                value: "Pentamidine (Nebupent, Pentam 300)"
            }, {
                name: "Primaxin (imipenem & cilastatin)",
                value: "Primaxin (imipenem & cilastatin)"
            }, {
                name: "Vancomycin (Vancocin)",
                value: "Vancomycin (Vancocin)"
            }, {
                name: "Gatifloxacin (fluoroquinolone)",
                value: "Gatifloxacin (fluoroquinolone)"
            }, {
                name: "Levofloxacin (fluoroquinolone)",
                value: "Levofloxacin (fluoroquinolone)"
            }, {
                name: "Moxifloxacin (fluoroquinolone)",
                value: "Moxifloxacin (fluoroquinolone)"
            },
             {
                name: "Other IV antibiotic",
                value: "Other IV antibiotic"
            }

        ];
        $scope.medicalRecord.AntibioNam = {
            name: "None",
            value: "none"
        };
        $scope.dispostin = 0;

        $scope.closeAlert = function(index) {
            $scope.errortype = 0;
        };

        $scope.draft = function() {
            $scope.saveMedical(1);
        };
        $scope.savemedForm = function()
        {
            $scope.submit = 1;
            if ($scope.personal.$valid)
            {
                $scope.saveMedical(0);
            }
        };

        $scope.dispostin_popup = function()
        {

                var hserr = "'has-error'";
                $scope.modalInstance = $modal.open({
                                      template:'<div class="modal-content"><div class="modal-header">Notification</div><div class="modal-body"><div class="form-group"><label class="col-sm-12 control-label">Did the patient have a problem during or after their procedure?</label></div><ng-form class="form-horizontal form-validation form-horizontal location ng-scope ng-valid-pattern ng-valid-required ng-dirty ng-valid-mask ng-valid ng-valid-parse" method="get" name ="deleteconfirm" ng-submit="deleteconfirm.$valid && yes(1)"><div class="form-group"></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="yes(1)">Yes</button><button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close(0)">No</button></div>',
                                      controller: "dispositioncontroler",
                                       size: 'md'
                   });
//<label type="button" class="col-sm-4" data-dismiss="modal" ></label><label type="button" class="alert alert-danger col-sm-4" data-dismiss="modal" ng-show="errorcls">Please Enter Delete Text</label>
                  $scope.modalInstance.result.then(function(selectedItem) {
            
                            if(selectedItem>0)
                            {
                                $scope.dispostin = selectedItem;
                                //$scope.saveMedical(statu);
                            }
                        }, function() {

                        });
               
        };
        popupservice.medicalrecordsCopy = angular.copy($scope.medicalRecord);
        popupservice.medicalrecordsCopy.AntibioNam = popupservice.medicalrecordsCopy.AntibioNam['value'];
        popupservice.medicalrecordsCopy.PROC = (angular.isDefined($scope.medicalRecord.PROC))?$scope.medicalRecord.PROC['DESCRIPTION']:"";
        popupservice.medicalrecordsCopy.AntibioTim = (angular.isDefined($scope.medicalRecord.AntibioTim))?$scope.medicalRecord.AntibioTim:"";
        
        popupservice.medicalrecords = $scope.medicalRecord;
        popupservice.medicalrecords.AntibioNam = popupservice.medicalrecords.AntibioNam['value'];
        popupservice.medicalrecords.PROC = (angular.isDefined($scope.medicalRecord.PROC))?$scope.medicalRecord.PROC['DESCRIPTION']:"";
         popupservice.medicalrecords.AntibioTim = (angular.isDefined($scope.medicalRecord.AntibioTim))?$scope.medicalRecord.AntibioTim:"";

         $scope.popupFunction = function(id)
         {

             $scope.modalInstance = $modal.open({
                                    template: '<div class="modal-content"><div class="modal-header"> Post-discharge Telephone Interview</div><div class="modal-body">Continue to the Patient Interview?</div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="yes(1)">Yes</button><button type="button" class="btn btn-warning" data-dismiss="modal" ng-click="close(0)">No</button></div>',
                                    controller: "poupcontroler",
                                    size: 'md'
                                });
                                //<label type="button" class="col-sm-4" data-dismiss="modal" ></label><label type="button" class="alert alert-danger col-sm-4" data-dismiss="modal" ng-show="errorcls">Please Enter Delete Text</label>
                                $scope.modalInstance.result.then(function(selectedItem) {

                                    if (selectedItem > 0) {
                                        $scope.patientInerview();
                                    } else {
                                        $state.go("ctApp.tablestatic",{IDN:$localStorage.IDN});
                                    }
                                }, function() {

                                });

                                // $scope.patientinterviewEnable = true;
                                $scope.lstInserId = id;
                                //return false;

         };

        $scope.saveMedical = function(statu) {
            var stat = statu;
            $scope.ErrorFiledssubmit = '';
            $scope.ErrorFiledsdrft = '';


            $scope.submiterrorSubmit = 0;
            $scope.drfterro = 0;
            if (stat === 0) {
                if ($scope.RECOV51 === true || $scope.AntibioTim1 === true || $scope.OROUT1 === true || $scope.PEND1 === true || $scope.PSTART1 === true || $scope.opttime3 === true || $scope.opttime2 === true || $scope.opttime1 === true || $scope.orintime1 === true) {
                    $scope.submiterrorSubmit = 1;

                   
                    return false;
                }
                if (angular.isUndefined($scope.medicalRecord.ANESTHESIA)) {
                    $scope.submiterrorSubmit = 1;
                    $scope.ErrorFiledssubmit = 'ANESTHESIA';
                    return false;
                }

                if (angular.isUndefined($scope.medicalRecord.PROC) || $scope.medicalRecord.PROC['CODE'] === '') {
                    $scope.submiterrorSubmit = 1;
                    $scope.PrimaryProcedure = 1;

                    $scope.ErrorFiledssubmit = 'Primary Procedure';
                    return false;

                }

                 if((angular.isDefined($scope.medicalRecord.OROUT) && $scope.medicalRecord.OROUT!=='') && ($scope.medicalRecord.ORIN==='' || angular.isUndefined($scope.medicalRecord.ORIN)))
                {
                    $scope.submiterrorSubmit = 1;
                    //$scope.AntibioTimtrue = 1;

                    $scope.ErrorFiledssubmit = 'OR In';
                    return false;
                }
                
                if((angular.isDefined($scope.medicalRecord.ORIN) && $scope.medicalRecord.ORIN!=='') && ($scope.medicalRecord.OROUT==='' || angular.isUndefined($scope.medicalRecord.OROUT)))
                {
                    $scope.submiterrorSubmit = 1;
                   // $scope.AntibioTimtrue = 1;

                    $scope.ErrorFiledssubmit = 'OR Out';
                    return false;
                }
                if(angular.isDefined($scope.medicalRecord.ORIN) && angular.isDefined($scope.medicalRecord.OROUT))
                {
                    if(moment.utc(moment($scope.medicalRecord.ORIN, "HH:mm")) > moment.utc(moment($scope.medicalRecord.OROUT, "HH:mm")))
                    {
                        $scope.submiterrorSubmit = 1;
                        $scope.ErrorFiledssubmit = 'please Check Orout Time';
                        return false;
                    }
                }
                
                if ((angular.lowercase($scope.medicalRecord.AntibioNam.value) !== 'none') && ($scope.medicalRecord.AntibioTim == '00:00' || $scope.medicalRecord.AntibioTim === '') && (angular.lowercase($scope.medicalRecord.AntibioNam) !== 'none' && $scope.medicalRecord.AntibioTim === '')) {
                    $scope.submiterrorSubmit = 1;
                    $scope.AntibioTimtrue = 1;
                    if($scope.medicalRecord.AntibioNam.value!==null)
                    {
                        $scope.ErrorFiledssubmit = 'Time of Inital dose';
                    return false;    
                    }
                    
                }
               
                if ((angular.isDefined(angular.lowercase($scope.medicalRecord.AntibioNam.value)) && angular.lowercase($scope.medicalRecord.AntibioNam.value) !== 'none') && ($scope.medicalRecord.AntibioTim == '00:00' || $scope.medicalRecord.AntibioTim === '')) {
                    $scope.submiterrorSubmit = 1;
                    $scope.AntibioTimtrue = 1;
                    
                    if($scope.medicalRecord.AntibioNam.value!==null)
                    {
                        $scope.ErrorFiledssubmit = 'Time of Inital dose';
                    return false;    
                    }
                }

                if ($scope.medicalRecord.PV1 == 'Y') {
                    if (angular.isUndefined($scope.medicalRecord.PR1) || $scope.medicalRecord.PR1 === '') {
                        $scope.PR1true = 1;
                        $scope.submiterrorSubmit = 1;
                        $scope.ErrorFiledssubmit = 'Pain relieved';
                        return false;
                    }
                }
                //$scope.medrecidn3DBFields.PROC
                /*if($scope.medicalRecord.patient_int<0)
                {
                  $scope.submiterrorSubmit = 1;
                  $scope.submit = 0;
                  $scope.ErrorFiledssubmit = 'PatientInterview';
                  
                  return false;
                }*/
            }
            

            if (angular.isUndefined($scope.medicalRecord.PIN) && angular.isUndefined($scope.medicalRecord.DOP) && (angular.isUndefined($scope.medicalRecord.PROC) || $scope.medicalRecord.PROC==='') && stat === 1) {

                $scope.drfterro = 1;
                $scope.submit = null;
                $scope.ErrorFiledsdrft = 'PIN ,Procedure and DOP';

                return false;
            }
            if (angular.isUndefined($scope.medicalRecord.PIN) || $scope.medicalRecord.PIN === '' && stat === 1) {

                $scope.drfterro = 1;
                $scope.submit = null;
                $scope.ErrorFiledsdrft = 'PIN';

                return false;
            }
            if ((angular.isUndefined($scope.medicalRecord.DOP))  || $scope.medicalRecord.DOP === '' && stat === 1) {

                $scope.drfterro = 1;
                $scope.submit = null;
                $scope.ErrorFiledsdrft = 'DOP';

                return false;
            }
            if ((angular.isUndefined($scope.medicalRecord.PROC)) && stat === 1) {

                $scope.drfterro = 1;
                $scope.submit = null;
                $scope.ErrorFiledsdrft = 'Primary Procedure ';

                return false;
            }
            

            if ($scope.personal.$valid || stat === 1) {

                var idn = (angular.isDefined($scope.userDetals)) ? $scope.userDetals.hospital : "";

                                mixpanel.track("medical Record", {
                                   "PIN": (angular.isDefined($scope.medicalRecord.PIN)) ? $scope.medicalRecord.PIN : "",
                                   "IDN3": (angular.isDefined($localStorage.IDN) && $localStorage.IDN !== null) ? $localStorage.IDN : idn,
                                   "DOP": (angular.isDefined($scope.medicalRecord.DOP)) ? moment($scope.medicalRecord.DOP).format('YYYY-MM-DD HH:MM') : ""
                                   
                               });

                $scope.submit = 0;
                $scope.loderStatus = 1;
                $scope.PR1true = 0;
                $scope.AntibioTimtrue = 0;
                $scope.medrecidn3DBFields = {};
                $scope.medrecidn3DBFields.PIN = (angular.isDefined($scope.medicalRecord.PIN)) ? $scope.medicalRecord.PIN : "";
                $scope.medrecidn3DBFields.SEX = (angular.isDefined($scope.medicalRecord.SEX)) ? $scope.medicalRecord.SEX : "";
                $scope.medrecidn3DBFields.AGE = (angular.isDefined($scope.medicalRecord.AGE)) ? $scope.medicalRecord.AGE : "";

                //$scope.medrecidn3DBFields.first_name = $scope.medicalRecord.first_name;
                //$scope.medrecidn3DBFields.last_name = $scope.medicalRecord.last_name;
                $scope.medrecidn3DBFields.phone = (angular.isDefined($scope.medicalRecord.phone)) ? $scope.medicalRecord.phone : "";

                
                popupservice.medicalrecords = '';
                popupservice.medicalrecordsCopy = '';
                //console.log($scope.userDetals);
                //console.log($localStorage.IDN); 
                //$scope.medrecidn3DBFields.IDN = "ABH";
                $scope.medrecidn3DBFields.IDN = (angular.isDefined($localStorage.IDN) && $localStorage.IDN !== null) ? $localStorage.IDN : idn;

                $scope.medrecidn3DBFields.IDN3 = (angular.isDefined($localStorage.IDN) && $localStorage.IDN !== null) ? $localStorage.IDN : idn;
                // $scope.medrecidn3DBFields.IDN3 = "ABH";

                 $scope.medrecidn3DBFields.DOP = (angular.isDefined($scope.medicalRecord.DOP)) ? moment($scope.medicalRecord.DOP).format('YYYY-MM-DD HH:MM') : "";
                

                
                //$scope.medrecidn3DBFields.CPT = $scope.medicalRecord.CPT['CPTCODE'];
                $scope.medrecidn3DBFields.PROC = (angular.isDefined($scope.medicalRecord.PROC)) ? $scope.medicalRecord.PROC['DESCRIPTION'] : "";


                //$scope.medrecidn3DBFields.CPT1 = ($scope.medicalRecord.CPT1)?$scope.medicalRecord.CPT1['CPTCODE']:"";
                //$scope.medrecidn3DBFields.CPT2 = ($scope.medicalRecord.CPT2)?$scope.medicalRecord.CPT2['CPTCODE']:"";
                //$scope.medrecidn3DBFields.CPT3 = ($scope.medicalRecord.CPT3)?$scope.medicalRecord.CPT3['CPTCODE']:"";
                $scope.medrecidn3DBFields.ISV_F = ($scope.medicalRecord.ISV_F) ? $scope.medicalRecord.ISV_F : "";
                $scope.medrecidn3DBFields.ANESTHESIA = ($scope.medicalRecord.ANESTHESIA) ? $scope.medicalRecord.ANESTHESIA : "";
                $scope.medrecidn3DBFields.ASACODE = ($scope.medicalRecord.ASACODE) ? $scope.medicalRecord.ASACODE : "";
                $scope.medrecidn3DBFields.proc_desc = ($scope.medicalRecord.proc_desc) ? $scope.medicalRecord.proc_desc : "";

                var ORIN = (angular.isDefined($scope.medicalRecord.ORIN) && $scope.medicalRecord.ORIN !== '') ? $scope.medicalRecord.ORIN.replace(':', '') : "0000";
                var OROUT = (angular.isDefined($scope.medicalRecord.OROUT) && $scope.medicalRecord.OROUT !== '') ? $scope.medicalRecord.OROUT.replace(':', '') : "0000";
                var PSTART = (angular.isDefined($scope.medicalRecord.PSTART)) ? $scope.medicalRecord.PSTART.replace(':', '') : "";
                var PEND = (angular.isDefined($scope.medicalRecord.PEND)) ? $scope.medicalRecord.PEND.replace(':', '') : "";
                var AntibioTim = (angular.isDefined($scope.medicalRecord.AntibioTim)) ? $scope.medicalRecord.AntibioTim.replace(':', '') : "0000";
                var RECOV1 = ($scope.medicalRecord.RECOV1) ? $scope.medicalRecord.RECOV1.replace(':', '') : "0000";
                var RECOV2 = ($scope.medicalRecord.RECOV2) ? $scope.medicalRecord.RECOV2.replace(':', '') : "0000";
                var RECOV3 = ($scope.medicalRecord.RECOV3) ? $scope.medicalRecord.RECOV3.replace(':', '') : "0000";
                var RECOV5 = ($scope.medicalRecord.RECOV5) ? $scope.medicalRecord.RECOV5.replace(':', '') : "0000";


                $scope.medrecidn3DBFields.ORIN = (ORIN !== '0000') ? ORIN.substring(0, 2) + ":" + ORIN.substring(2, 4) : "";
                $scope.medrecidn3DBFields.OROUT = (OROUT !== '0000') ? OROUT.substring(0, 2) + ":" + OROUT.substring(2, 4) : "";
                $scope.medrecidn3DBFields.PSTART = ($scope.medicalRecord.PSTART) ? PSTART.substring(0, 2) + ":" + PSTART.substring(2, 4) : "";
                $scope.medrecidn3DBFields.PEND = ($scope.medicalRecord.PEND) ? PEND.substring(0, 2) + ":" + PEND.substring(2, 4) : "";
                $scope.medrecidn3DBFields.AntibioTim = ($scope.medicalRecord.AntibioTim) ? AntibioTim.substring(0, 2) + ":" + AntibioTim.substring(2, 4) : "00:00";


                $scope.medrecidn3DBFields.RECOV1 = ($scope.medicalRecord.RECOV1) ? RECOV1.substring(0, 2) + ":" + RECOV1.substring(2, 4) : "";

                $scope.medrecidn3DBFields.RECOV2 = ($scope.medicalRecord.RECOV2) ? RECOV2.substring(0, 2) + ":" + RECOV2.substring(2, 4) : "";
                $scope.medrecidn3DBFields.RECOV3 = ($scope.medicalRecord.RECOV3) ? RECOV3.substring(0, 2) + ":" + RECOV3.substring(2, 4) : "";
                $scope.medrecidn3DBFields.RECOV5 = ($scope.medicalRecord.RECOV5) ? RECOV5.substring(0, 2) + ":" + RECOV5.substring(2, 4) : "";
                $scope.medrecidn3DBFields.DISPOSITIO = (angular.isDefined($scope.medicalRecord.DISPOSITIO)) ? $scope.medicalRecord.DISPOSITIO : "";
                $scope.medrecidn3DBFields.AntibioNam = (angular.isDefined($scope.medicalRecord.AntibioNam.value)) ? $scope.medicalRecord.AntibioNam.value : "none";
                $scope.medrecidn3DBFields.NAUS1 = ($scope.medicalRecord.NAUS1) ? "Y" : "N";
                $scope.medrecidn3DBFields.INVOID1 = ($scope.medicalRecord.INVOID1) ? "Y" : "N";
                $scope.medrecidn3DBFields.CATHETER = ($scope.medicalRecord.CATHETER) ? "Y" : "N";
                $scope.medrecidn3DBFields.BLEED1 = ($scope.medicalRecord.BLEED1) ? "Y" : "N";
                $scope.medrecidn3DBFields.VOM1 = ($scope.medicalRecord.VOM1) ? "Y" : "N";
                $scope.medrecidn3DBFields.PAIN1 = ($scope.medicalRecord.PAIN1) ? "Y" : "N";
                $scope.medrecidn3DBFields.FALL = ($scope.medicalRecord.FALL) ? "Y" : "N";
                $scope.medrecidn3DBFields.LOC1 = ($scope.medicalRecord.LOC1) ? "Y" : "N";
                $scope.medrecidn3DBFields.RESP1 = ($scope.medicalRecord.RESP1) ? "Y" : "N";
                $scope.medrecidn3DBFields.IVS1 = ($scope.medicalRecord.IVS1) ? "Y" : "N";

                $scope.medrecidn3DBFields.PEMC1 = ($scope.medicalRecord.PEMC1) ? "Y" : "N";
                $scope.medrecidn3DBFields.IN_VIT_COM = ($scope.medicalRecord.IN_VIT_COM) ? $scope.medicalRecord.IN_VIT_COM: "";
                $scope.medrecidn3DBFields.BURN = ($scope.medicalRecord.BURN) ? "Y" : "N";
                $scope.medrecidn3DBFields.PRE_MED_CO = ($scope.medicalRecord.PRE_MED_CO) ? $scope.medicalRecord.PRE_MED_CO : "";
                $scope.medrecidn3DBFields.WRONGPAT = ($scope.medicalRecord.WRONGPAT) ? "Y" : "N";
                $scope.medrecidn3DBFields.OTHER1 = ($scope.medicalRecord.OTHER1) ? "Y" : "N";
                $scope.medrecidn3DBFields.OTHER_COMM = ($scope.medicalRecord.OTHER_COMM) ? $scope.medicalRecord.OTHER_COMM : "";

                $scope.medrecidn3DBFields.PV1 = ($scope.medicalRecord.PV1) ? $scope.medicalRecord.PV1 : "";
                $scope.medrecidn3DBFields.MO1 = ($scope.medicalRecord.MO1) ? $scope.medicalRecord.MO1 : "";
                $scope.medrecidn3DBFields.MA1 = ($scope.medicalRecord.MA1) ? $scope.medicalRecord.MA1 : "";
                $scope.medrecidn3DBFields.PR1 = ($scope.medicalRecord.PR1) ? $scope.medicalRecord.PR1 : "";
                $scope.medrecidn3DBFields.status = (stat === 1) ? -1 : 1;

                $scope.medrecidn3DBFields.ISV_A = ($scope.medicalRecord.ISV_A) ? $scope.medicalRecord.ISV_A : "";
                $scope.medrecidn3DBFields.ISV_B = ($scope.medicalRecord.ISV_B) ? $scope.medicalRecord.ISV_B : "";
                $scope.medrecidn3DBFields.ISV_C = ($scope.medicalRecord.ISV_C) ? $scope.medicalRecord.ISV_C : "";
                $scope.medrecidn3DBFields.ISV_D = ($scope.medicalRecord.ISV_D) ? $scope.medicalRecord.ISV_D : "";
                $scope.medrecidn3DBFields.ISV_E = ($scope.medicalRecord.ISV_E) ? $scope.medicalRecord.ISV_E : "";
               // $scope.medrecidn3DBFields.patient_int = ($scope.medicalRecord.patient_int !== '-1') ? $scope.medicalRecord.patient_int : "0";
                var url = '';


                if ($stateParams.editId !== '') {
                    $scope.medrecidn3DBFields.edited_on = moment().format("YYYY-MM-DD HH:MM");

                    url = apiUrl + "update?tablename=medrecidn3&filter=where id = '" + $stateParams.editId + "'&edit_id=" + $stateParams.editId; //Your url will be like this.
                } else {
                    $scope.medrecidn3DBFields.created_on = moment().format("YYYY-MM-DD HH:MM");
                    
                   

                    url = apiUrl + 'insert?tablename=medrecidn3'; //Your url will be like this.
                }
                $http({
                        url: url, //'http://patint.bitnamiapp.com:9000/insert?tablename=medrecidn3', //Your url will be like this.
                        method: 'post',
                        data: $scope.medrecidn3DBFields,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .success(function(data) {
                        $scope.errortype = 1;
                        $scope.loderStatus = 0;

                        if (data === '3') {
                            $scope.msg = 'Medical Record was successfully updated.';
                            $scope.alrttype = 'success';
                            
                            if ($scope.medicalRecord.patient_int > 0) 
                            {
                                $scope.popupFunction($stateParams.editId);
                                return false;
                            }
                            $timeout(function() {
                                $state.go("ctApp.tablestatic", {IDN:$localStorage.IDN});
                            }, 3000);
                            return false;
                            
                        }
                        if (data.insertId > 0) {
                            $scope.msg = 'Medical Record was successfully saved.';

                            $scope.alrttype = 'success';

                            if ($scope.medicalRecord.patient_int > 0) {

                                 $scope.popupFunction(data.insertId);
                                 return false;

                            }
                            $timeout(function() {
                                $state.go("ctApp.tablestatic", {IDN:$localStorage.IDN});
                            }, 3000);


                        } else {
                            $scope.msg = 'Medical record not saved due to duplicate pin number.';
                            $scope.alrttype = 'danger';
                            $scope.patientinterviewEnable = false;

                        }
                        $timeout(function() {
                            //$scope.errortype = 0;
                        }, 3000);



                    });
                // $scope.painverbalized = false;
                //$scope.patientoption = false;
            } else {
                //console.log("selvakumar");
            }


        };
        $scope.refreshcategory = function(code) {

            if (code.length > 0) {

                $http({
                        //url: apiUrl+"getCptTable?tableName=cpt_codes&filter=where CODE like '"+code + "%' || DESCRIPTION like '"+ code +"%' limit 5", //Your url will be like this.

                        //apiUrl+"getCptTable?tableName=cpt_groups&filter=where PROCEDURE_GROUP like '%"+code+"%' limit 8&fields=PROCEDURE_GROUP",
                        url: apiUrl + "getCptTable?tableName=cpt_codes&filter=where CODE like '" + code + "%' || DESCRIPTION like '%" + code + "%' || PROCEDURE_GROUP like '%"+ code +"%' order by PROCEDURE_GROUP asc limit 20&fields=DESCRIPTION,CODE,PROCEDURE_GROUP", //Your url will be like this.
                        method: 'get',
                        data: code,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })  
                    .success(function(data) {
                        //console.log(data);
                        if (data.length > 0) {
                            $scope.cptCodes = [];

                            angular.forEach(data, function(value, key) {
                                //console.log(value.CODE);
                                /*$scope.cptCodes.push({
                                    CODE: "(" + value.CODE + ") " + value.DESCRIPTION,
                                    DESCRIPTION: value.PROCEDURE_GROUP,
                                    BENCHMARK: value.BENCHMARK,
                                    CPTCODE: value.CODE
                                });*/
                                //replace(/[^\w\s]/gi, "")

                               $scope.cptCodes.push({
                                    CODE:  $sce.trustAsHtml(value.PROCEDURE_GROUP) +" (" + value.CODE + ") - " + $sce.trustAsHtml(value.DESCRIPTION),
                                    DESCRIPTION: $sce.trustAsHtml(value.PROCEDURE_GROUP),
                                    BENCHMARK: $sce.trustAsHtml(value.BENCHMARK),
                                    CPTCODE: $sce.trustAsHtml(value.CODE)
                                });
                                //$scope.cptCodes.push({CODE:value.PROCEDURE_GROUP,DESCRIPTION:value.PROCEDURE_GROUP});

                            });


                        }
                        //console.log($scope.cptCodes);                
                    });
            }

        };


        $scope.checkpinNumber = function() {
            if (!angular.isUndefined($scope.medicalRecord.PIN)) {

                $http({
                        url: apiUrl + "getCptTable?tableName=medrecidn3&filter=where PIN = '" + $scope.medicalRecord.PIN + "' and DOP like '%" + moment($scope.medicalRecord.DOP).format("YYYY-MM-DD") + "%' limit 1&fields=PIN",
                        //'http://patint.bitnamiapp.com:9000/pinNumber?pin='+$scope.medicalRecord.PIN, //Your url will be like this.

                        //"http://patint.bitnamiapp.com:9000/getCptTable?tableName=medrecidn3&filter=where PIN = '"+$scope.medicalRecord.PIN + "' limit 1",
                        method: 'get',
                        data: $scope.medicalRecord.pin,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .success(function(data) {
                        if (data.length == 1) {
                            $scope.pinExit = true;
                            $timeout(function() {
                                $scope.pinExit = false;
                            }, 2000);

                        } else {
                            $scope.pinExit = false;
                        }
                    });
            }
        };

        if ($stateParams.editId !== '')

        {
            $scope.editId = $stateParams.editId;

            $http({
                    url: apiUrl + 'getCptTable?tableName=medrecidn3&filter=where id = ' + $scope.editId + ' limit 1&fields=*',
                    method: 'get',
                    data: '',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .success(function(data) {
                    if (data.length > 0) {

                        $scope.medicalRecord = data[0];
                       
    //console.log(data[0]);

                        $scope.medicalRecord.PROC = {
                            "CODE": data[0].PROC,
                            "DESCRIPTION": data[0].PROC
                        };

                        //console.log(data[0].PV1);
                        $scope.medicalRecord.AntibioNam = {
                            name: data[0].AntibioNam,
                            value: data[0].AntibioNam
                        };
                        $scope.medicalRecord.NAUS1 = (data[0].NAUS1 == "Y") ? true : false;

                        $scope.medicalRecord.INVOID1 = (data[0].INVOID1 == "Y") ? true : false;
                        $scope.medicalRecord.CATHETER = (data[0].CATHETER == "Y") ? true : false;
                        $scope.medicalRecord.BLEED1 = (data[0].BLEED1 == "Y") ? true : false;
                        $scope.medicalRecord.VOM1 = (data[0].VOM1 == "Y") ? true : false;
                        $scope.medicalRecord.PAIN1 = (data[0].FALL == "Y") ? true : false;
                        $scope.medicalRecord.FALL = (data[0].FALL == "Y") ? true : false;
                        $scope.medicalRecord.LOC1 = (data[0].LOC1 == "Y") ? true : false;
                        $scope.medicalRecord.RESP1 = (data[0].RESP1 == "Y") ? true : false;
                        $scope.medicalRecord.IVS1 = (data[0].IVS1 == "Y") ? true : false;
                        $scope.medicalRecord.PEMC1 = (data[0].PEMC1 == "Y") ? true : false;
                        $scope.medicalRecord.BURN = (data[0].BURN == "Y") ? true : false;
                        $scope.medicalRecord.WRONGPAT = (data[0].WRONGPAT == "Y") ? true : false;
                        $scope.medicalRecord.OTHER1 = (data[0].OTHER1 == "Y") ? true : false;
                        $scope.AntibioTimINT = data[0].AntibioTim;
                        $scope.medicalRecord.DOP = data[0].DOP.substr(0, 10);//(angular.isDefined(data[0])) ? moment(data[0].DOP).format('MM-DD-YYYY') : "";

                        popupservice.medicalrecordsCopy = angular.copy($scope.medicalRecord);
                        popupservice.medicalrecordsCopy.AntibioNam = data[0].AntibioNam;
                        popupservice.medicalrecordsCopy.PROC =(angular.isDefined(data[0].PROC))?data[0].PROC:"";

                        popupservice.medicalrecords = $scope.medicalRecord;
                        popupservice.medicalrecords.AntibioNam = data[0].AntibioNam;
                        popupservice.medicalrecords.PROC = (angular.isDefined(data[0].PROC))?data[0].PROC:"";

                        var ag = "0"+data[0].AGE;
                        $scope.medicalRecord.AGE = (data[0].AGE>9)?parseInt(data[0].AGE,10):ag;
                        $scope.ageyear = moment().subtract(data[0].AGE, 'years').endOf('month').format('YYYY');

                    }

                });
        } else {
            $scope.editId = '';
        }
        $scope.calculateAge = function() {
            $scope.dob = $scope.medicalRecord.DOP;

            var date = new Date($scope.dob);
            var ageDifMs = Date.now() - date.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            // $scope.medicalRecord.AGE =  Math.abs(ageDate.getUTCFullYear() - 1970);

        };
        $scope.checkIfEnterKeyWasPressed = function($event) {
            var keyCode = $event.keyCode;
            //console.log(keyCode);
            if ($event.keyCode === 0) {
                // $event.preventDefault();
            }
        };

        //$scope.oo = $filter('hourmints')($scope.medicalRecord, $scope.medicalRecord.ORIN, $scope.medicalRecord.ORIN);

        $scope.disabled = undefined;
        $scope.searchEnabled = undefined;

        $scope.enable = function() {
            $scope.disabled = false;
        };

        $scope.disable = function() {
            $scope.disabled = true;
        };

        $scope.enableSearch = function() {
            $scope.searchEnabled = true;
        };

        $scope.disableSearch = function() {
            $scope.searchEnabled = false;
        };

        $scope.clear = function() {
            $scope.person.selected = undefined;
            $scope.address.selected = undefined;
            $scope.country.selected = undefined;
        };



        $scope.counter = 0;
        $scope.someFunction = function(item, model) {
            $scope.counter++;
            $scope.eventResult = {
                item: item,
                model: model
            };
        };

        $scope.removed = function(item, model) {
            $scope.lastRemoved = {
                item: item,
                model: model
            };
        };

    }])
    .filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;

        };
    })
    .controller('dispositioncontroler', ['$modalInstance','$scope','$state','$timeout',function($modalInstance,$scope,$state,$timeout)
{
  $scope.close = function()
    {
      $modalInstance.close(1);
    };
    $scope.yes = function()
    {
      $modalInstance.close(1);
    };
}]);

//mixpanel.track("MedicalRecord", {
//    "PIN": $scope.medrecidn3DBFields.PIN,
//    "Gender": $scope.medrecidn3DBFields.SEX,
//    "Age": $scope.medrecidn3DBFields.AGE,
//    "Phone": $scope.medrecidn3DBFields.phone,
//    "IDN":$scope.medrecidn3DBFields.IDN
//});