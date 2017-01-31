angular.module('ctApp.fileupload', [
    'ui.router'
])

.config(function config($stateProvider) {
    var access = routingConfig.accessLevels;
    $stateProvider.state('ctApp.fileupload', {
        //url: '/PatientInterview/:cptCode',
        url: '/PatientInterview/:editId',
        views: {
            "appNested": {
                controller: 'fileuploadCtrl',
                templateUrl: 'ct-app/patientInterview/patientInterview.tpl.html',
                params: {
                    'referer': ''
                }
            }
        },
        data: {
            pageTitle: 'Patient Interview'
        },
        access: access.public
    });
})

.controller('fileuploadCtrl', ['$scope', '$state', '$stateParams', '$http', '$timeout', 'popupservice', '$localStorage', function($scope, $state, $stateParams, $http, $timeout, popupservice, $localStorage) {


    $scope.userDetals = $localStorage.userName;
            if($scope.userDetals===null || angular.isUndefined($scope.userDetals))
              {
                return false;
              }
    $scope.patientinterview = {};
    $scope.value = [];
    $scope.instructionss = [];
    $scope.patientinterview.PIN = "";
    $scope.patientinterview.CPT = "";
    $scope.patientinterview.DOP = "";
    $scope.patientinterview.SEX = "";
    $scope.patientinterview.PHONE = "";
    $scope.patientinterview.CREATEDON = "";
    $scope.patientinterview.CREATEDBY = "";
    $scope.reff_id = '';
    $scope.sugeryCenter = 0;
    $scope.view = true;
    $scope.patn2Dop = '';
    //$scope.patientinterview.PHOME=0;

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

    if ($stateParams.editId > 0) {
        $scope.reff_id = $stateParams.editId;
        $http({
                url: apiUrl + "getCptTable?tableName=patint2&filter=where ref_id = '" + $stateParams.editId + "' limit 1&fields=*",
                method: 'get',
                data: $stateParams.editId,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(data) {

                if (data.length > 0) {
                    $scope.patient_id = data[0].id;
                    $scope.patientinterview = data[0];
                    $scope.patientinterview.VOMIT1 = (data[0].VOMIT1 == "Y") ? true : false;
                    $scope.patientinterview.VOMIT2 = (data[0].VOMIT2 == "Y") ? true : false;
                    $scope.patientinterview.VOMIT3 = (data[0].VOMIT3 == "Y") ? true : false;
                    $scope.patientinterview.VOMIT4 = (data[0].VOMIT4 == "Y") ? true : false;
                    $scope.patientinterview.FEVER1 = (data[0].FEVER1 == "Y") ? true : false;
                    $scope.patientinterview.FEVER2 = (data[0].FEVER2 == "Y") ? true : false;
                    $scope.patientinterview.FEVER3 = (data[0].FEVER3 == "Y") ? true : false;
                    $scope.patientinterview.FEVER4 = (data[0].FEVER4 == "Y") ? true : false;
                    $scope.patientinterview.URINE1 = (data[0].URINE1 == "Y") ? true : false;
                    $scope.patientinterview.URINE2 = (data[0].URINE2 == "Y") ? true : false;
                    $scope.patientinterview.URINE3 = (data[0].URINE3 == "Y") ? true : false;
                    $scope.patientinterview.URINE4 = (data[0].URINE4 == "Y") ? true : false;
                    $scope.patientinterview.BLEED1 = (data[0].BLEED1 == "Y") ? true : false;
                    $scope.patientinterview.BLEED2 = (data[0].BLEED2 == "Y") ? true : false;
                    $scope.patientinterview.BLEED3 = (data[0].BLEED3 == "Y") ? true : false;
                    $scope.patientinterview.BLEED4 = (data[0].BLEED4 == "Y") ? true : false;
                    $scope.patientinterview.NAUSEA1 = (data[0].NAUSEA1 == "Y") ? true : false;
                    $scope.patientinterview.NAUSEA2 = (data[0].NAUSEA2 == "Y") ? true : false;
                    $scope.patientinterview.NAUSEA3 = (data[0].NAUSEA3 == "Y") ? true : false;
                    $scope.patientinterview.NAUSEA4 = (data[0].NAUSEA4 == "Y") ? true : false;

                    $scope.patientinterview.INSCOM = (data[0].INSCOM == "Y") ? true : false;

                    $scope.patientinterview.FOLCOM = (data[0].FOLCOM == "Y") ? true : false;
                    $scope.patientinterview.FOLOTH = (data[0].FOLOTH == "Y") ? true : false;

                    $scope.patientinterview.INFEC1 = (data[0].INFEC1 == "Y") ? true : false;
                    $scope.patientinterview.INFEC2 = (data[0].INFEC2 == "Y") ? true : false;
                    $scope.patientinterview.INFEC3 = (data[0].INFEC3 == "Y") ? true : false;
                    $scope.patientinterview.INFEC4 = (data[0].INFEC4 == "Y") ? true : false;
                    $scope.patientinterview.PHOME = (data[0].PHOME == "Y" || data[0].PHOME == 1) ? true : false;

                    $scope.patientinterview.interview_date = (data[0].interview_date !== 'Invalid date' && data[0].interview_date !== '' && data[0].interview_date !== null) ? moment(data[0].interview_date).format("MM-DD-YYYY") : "";
                    // console.log($scope.patientinterview.interview_date);
                    //console.log(data[0].interview_date);

                    if (data[0].PHOME == 1) {
                        $scope.patientinterview.USEM = (data[0].USEM == "Y") ? true : false;
                        $scope.patientinterview.FOLM = (data[0].FOLM == "Y") ? true : false;

                        $scope.sugeryCenter = 1;
                        if ($scope.patientinterview.USEM === true || $scope.patientinterview.INSCOM === true) {
                            $scope.instructionss.push(true);
                        }
                        if ($scope.patientinterview.FOLM === true || $scope.patientinterview.FOLCOM === true || $scope.patientinterview.FOLOTH === true) {
                            $scope.value.push(true);
                        }

                    }
                    
                    //  console.log($scope.value.length);
                    // console.log($scope.instructionss.length);

                }
                $http({
                        url: apiUrl + "getCptTable?tableName=medrecidn3&filter=where id = '" + $stateParams.editId + "' limit 1&fields=PIN,PROC,DOP,SEX,phone,created_on,IDN3,patient_int,AGE,status",
                        method: 'get',
                        data: $stateParams.editId,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .success(function(data) {
                        if (data.length > 0) {

                            $scope.patientinterview.PIN = data[0].PIN;
                            $scope.patientinterview.CPT = data[0].PROC;
                            $scope.patientinterview.DOP = moment(data[0].DOP).format("MM/DD/YYYY");
                            if (data[0].status >= 0) {
                                $scope.patientinterview.SEX = (data[0].SEX == "M") ? "Male" : "Female";
                            }

                            $scope.patientinterview.PHONE = data[0].phone;
                            $scope.patientinterview.CREATEDON = data[0].created_on;
                            $scope.patientinterview.IDN3 = data[0].IDN3;
                            $scope.patientinterview.status = data[0].status;
                            $scope.patientinterview.AGE = (data[0].AGE > 0) ? data[0].AGE : "";
                            $scope.patn2Dop = (angular.isDefined(data[0].DOP)) ? moment(data[0].DOP).format('YYYY-MM-DD HH:MM') : "";



                        } // medrecidn3  if loop
                        popupservice.medicalrecordsCopy = angular.copy($scope.patientinterview);
                        popupservice.medicalrecords = $scope.patientinterview;
                    }); // medrecidn3 table data

            }); //patient table get data




    }
    
    


    $scope.closeAlert = function(index) {
        $scope.errortype = 0;
    };
    $scope.painsurgery = function() {
        $scope.sugeryCenter = $scope.patientinterview.PHOME;

    };
    $scope.cancel = function() {
        $state.go("ctApp.tablestatic",{IDN:$localStorage.IDN});
    };
    $scope.printForm = function() {

            var printDivCSS = String ('<link href="assets/ngbp-0.3.2.css" rel="stylesheet" type="text/css">');

            //var printContents = document.getElementById('print_Patntform').innerHTML;

            //var printContents = document.getElementById("print_Patntform").value;
            //print_Patntform.innerHTML= printContents;
             w=window.open();
            w.document.write(printDivCSS + document.getElementById('print_Patntform').innerHTML);
            // w.document.write(printContents);
             w.print();
             w.close();
        };
    $scope.submitForm = function() {
        $scope.submit = true;
        if ($scope.interview.$valid)
        {
            $scope.saveInterview(0);
        }

        // console.log($scope.ErrorFileds);
    };

    

    $scope.anyDirtyAndInvalid = function(formName) {
        $total_formname = [];
        $scope.arr = {
            "Inretviewed": "Who is interviewed",
            "period": "During your recovery period in the center..",
            "preop": "During the pre-op care...",
            "regadmprcs": "During the registration and admission process...",
            "yourself": "Did you feel that you had all information you needed to care for yourself once you were home?",
            "ScheduleAppointment": "Did you have an appointment to see your doctor or know when to schedule an appointment?",
            "ControlPain": "Did you know what medicine or other methods to use to control pain?",
            "hadProblem": "Did you know who to call if you had a problem?",
            "afterSurgery": "Did you know what to expect after the surgery?",
            "painsurgery":'Did you have any pain related to your surgery?'
        };
        var name;


        if (angular.isDefined($scope.interview.$error.required)) {
            $total_formname = [];
            for (var x in $scope.interview.$error.required) {
                //console.log($scope.personal.$error.required[x].$name);
                //console.log($scope.personal.$dirty);
                if ($scope.interview.$error.required[x].$error.required === true) {
                    if ($total_formname.indexOf($scope.interview.$error.required[x].$name) == -1) {
                        if (name != $scope.arr[$scope.interview.$error.required[x].$name]) {
                            name = $scope.arr[$scope.interview.$error.required[x].$name];
                            $total_formname.push(name);
                        }
                    }
                }
            }
            $scope.ErrorFileds = ($total_formname);
        }

        if (angular.isUndefined(name)) {
            $scope.ErrorFileds = [];
        }
    };


   
    $scope.draft = function() {
        $scope.saveInterview(1);
    };

    $scope.saveInterview = function(stat) {

        $scope.descripe5 = 0;
        $scope.submiterrorSubmit = 0;
        $scope.patient_int = {
            patient_int: '-1'
        };
        $scope.ErrorFiledssubmit = [];
        if (stat === 0) {


            if (($scope.patientinterview.QREGADM === null || angular.isUndefined($scope.patientinterview.QREGADM)) || ($scope.patientinterview.QPREADM === null || angular.isUndefined($scope.patientinterview.QPREADM)) || ($scope.patientinterview.QRECOV === null || angular.isUndefined($scope.patientinterview.QRECOV))) {
                if (($scope.submit === true && $scope.patientinterview.PHOME === '1')) {
                    //$scope.ErrorFileds = ['Were these instructions for:','Did you follow the instructions for:'];
                    // $scope.descripe5 = 1;
                    //return false;
                }

            } 
            else if (($scope.instructionss.length <= 0 && $scope.value.length <= 0)) {


                if ($scope.patientinterview.PHOME == '1') {
                    $scope.submiterrorSubmit = 1;
                    $scope.ErrorFiledssubmit = [
                                                  "Did you receive instructions for?",
                                                  "Did you follow the instructions for?"
                                                ];
                    return false;
                }
            }
            else if (($scope.instructionss.length <= 0)) {


                if ($scope.patientinterview.PHOME == '1') {
                    $scope.submiterrorSubmit = 1;
                    $scope.ErrorFiledssubmit = ['Did you receive instructions for?'];
                    return false;
                }
            }
            else if (($scope.value.length <= 0 )) {


                if ($scope.patientinterview.PHOME == '1') {
                    $scope.submiterrorSubmit = 1;
                    $scope.ErrorFiledssubmit = ['Did you follow the instructions for?'];
                    return false;
                }
            }

            

            if (!angular.isUndefined($scope.patientinterview.interview_date)) {


                if (moment($scope.patientinterview.interview_date).format("YYYY-MM-DD") < moment($scope.patientinterview.DOP).format("YYYY-MM-DD")) {
                    $scope.submit = 0;
                    $scope.errortype = 1;
                    $scope.msg = 'Interview Date must be on AFTER the DOP!!!';
                    $scope.alrttype = 'warning';
                    $timeout(function() {
                        //$scope.submit = 1;
                    }, 3000);
                    return false;
                }
            }
            $scope.patient_int = {
                patient_int: '1'
            };
        }

        if ($scope.interview.$valid || stat === 1) {
            // return false;

                mixpanel.track("Patint Intview", {
                                  "IDN3": $scope.patientinterview.IDN3,
                                  "REF_ID":$scope.reff_id,
                                  "DOP": $scope.patientinterview.DOP
                              });

            $scope.submit = 0;
            $scope.loderStatus = 1;
            $scope.patint2 = {};
            $scope.patint2.PROB = (angular.isDefined($scope.patientinterview.PROB)) ? $scope.patientinterview.PROB : "";
            $scope.patint2.WHOCALL = (angular.isDefined($scope.patientinterview.WHOCALL)) ? $scope.patientinterview.WHOCALL : "";
            $scope.patint2.MED = (angular.isDefined($scope.patientinterview.MED)) ? $scope.patientinterview.MED : "";
            $scope.patint2.APP = (angular.isDefined($scope.patientinterview.APP)) ? $scope.patientinterview.APP : "";
            $scope.patint2.INF = (angular.isDefined($scope.patientinterview.INF)) ? $scope.patientinterview.INF : "";
            //$scope.patint2.NAUSEA1 = $scope.patientinterview.NAUSEA1;
            $scope.patint2.ref_id = $scope.reff_id;
            $scope.patint2.DOP = $scope.patn2Dop;
            
            $scope.patint2.IDN = $scope.patientinterview.IDN3;
            //var idn = (angular.isDefined($scope.userDetals))?$scope.userDetals.hospital:"";

            // $scope.patint2.IDN3 = (angular.isDefined($localStorage.IDN) && $localStorage.IDN!==null)?$localStorage.IDN:idn;
            $scope.patint2.IDN3 = $scope.patientinterview.IDN3;

            $scope.patint2.PHOME = (angular.isDefined($scope.patientinterview.PHOME)) ? $scope.patientinterview.PHOME : "";
            $scope.patint2.INSPAIN = ""; //(angular.isUndefined($scope.patientinterview.INSPAIN));
            $scope.patint2.USEM = ($scope.patientinterview.USEM) ? "Y" : "N";
            $scope.patint2.INSCOM = ($scope.patientinterview.INSCOM) ? "Y" : "N";
            $scope.patint2.FOLM = ($scope.patientinterview.FOLM) ? "Y" : "N";
            $scope.patint2.FOLCOM = ($scope.patientinterview.FOLCOM) ? "Y" : "N";
            $scope.patint2.FOLOTH = ($scope.patientinterview.FOLOTH) ? "Y" : "N";
            $scope.patint2.RELIEF = (angular.isDefined($scope.patientinterview.RELIEF)) ? $scope.patientinterview.RELIEF : "";
            $scope.patint2.QREGADM = (angular.isDefined($scope.patientinterview.QREGADM)) ? $scope.patientinterview.QREGADM : "";
            $scope.patint2.QPREADM = (angular.isDefined($scope.patientinterview.QPREADM)) ? $scope.patientinterview.QPREADM : "";
            $scope.patint2.QRECOV = (angular.isDefined($scope.patientinterview.QRECOV)) ? $scope.patientinterview.QRECOV : "";
            $scope.patint2.PAT_ISV_A = ($scope.patientinterview.PAT_ISV_A) ? $scope.patientinterview.PAT_ISV_A : "";
            $scope.patint2.PAT_ISV_B = ($scope.patientinterview.PAT_ISV_B) ? $scope.patientinterview.PAT_ISV_B : "";
            $scope.patint2.PAT_ISV_C = ($scope.patientinterview.PAT_ISV_C) ? $scope.patientinterview.PAT_ISV_C : "";
            //$scope.patint2.INT_COMMEN = $scope.patientinterview.INT_COMMEN;
            popupservice.medicalrecordsCopy ='';
            popupservice.medicalrecords = '';

            $scope.patint2.WHOWAS = (angular.isDefined($scope.patientinterview.WHOWAS)) ? $scope.patientinterview.WHOWAS : "";
            $scope.patint2.interviewer_name = ($scope.patientinterview.interviewer_name) ? $scope.patientinterview.interviewer_name : "";

            $scope.patint2.interview_date = (!angular.isUndefined($scope.patientinterview.interview_date) && $scope.patientinterview.interview_date !== '') ? moment($scope.patientinterview.interview_date).format("YYYY-MM-DD") : "";
            //$scope.patint2.created_on = moment().format("YYYY-MM-DD HH:MM");
            $scope.patint2.INT_COMMEN = ($scope.patientinterview.INT_COMMEN) ? $scope.patientinterview.INT_COMMEN : "";

            $scope.patint2.VOMIT1 = ($scope.patientinterview.VOMIT1) ? "Y" : "N";
            $scope.patint2.VOMIT2 = ($scope.patientinterview.VOMIT2) ? "Y" : "N";
            $scope.patint2.VOMIT3 = ($scope.patientinterview.VOMIT3) ? "Y" : "N";
            $scope.patint2.VOMIT4 = ($scope.patientinterview.VOMIT4) ? "Y" : "N";
            $scope.patint2.FEVER1 = ($scope.patientinterview.FEVER1) ? "Y" : "N";
            $scope.patint2.FEVER2 = ($scope.patientinterview.FEVER2) ? "Y" : "N";
            $scope.patint2.FEVER3 = ($scope.patientinterview.FEVER3) ? "Y" : "N";
            $scope.patint2.FEVER4 = ($scope.patientinterview.FEVER4) ? "Y" : "N";
            $scope.patint2.URINE1 = ($scope.patientinterview.URINE1) ? "Y" : "N";
            $scope.patint2.URINE2 = ($scope.patientinterview.URINE2) ? "Y" : "N";
            $scope.patint2.URINE3 = ($scope.patientinterview.URINE3) ? "Y" : "N";
            $scope.patint2.URINE4 = ($scope.patientinterview.URINE4) ? "Y" : "N";
            $scope.patint2.BLEED1 = ($scope.patientinterview.BLEED1) ? "Y" : "N";
            $scope.patint2.BLEED2 = ($scope.patientinterview.BLEED2) ? "Y" : "N";
            $scope.patint2.BLEED3 = ($scope.patientinterview.BLEED3) ? "Y" : "N";
            $scope.patint2.BLEED4 = ($scope.patientinterview.BLEED4) ? "Y" : "N";
            $scope.patint2.NAUSEA1 = ($scope.patientinterview.NAUSEA1) ? "Y" : "N";
            $scope.patint2.NAUSEA2 = ($scope.patientinterview.NAUSEA2) ? "Y" : "N";
            $scope.patint2.NAUSEA3 = ($scope.patientinterview.NAUSEA3) ? "Y" : "N";
            $scope.patint2.NAUSEA4 = ($scope.patientinterview.NAUSEA4) ? "Y" : "N";
            $scope.patint2.INFEC1 = ($scope.patientinterview.INFEC1) ? "Y" : "N";
            $scope.patint2.INFEC2 = ($scope.patientinterview.INFEC2) ? "Y" : "N";
            $scope.patint2.INFEC3 = ($scope.patientinterview.INFEC3) ? "Y" : "N";
            $scope.patint2.INFEC4 = ($scope.patientinterview.INFEC4) ? "Y" : "N";
            $scope.patint2.status = (stat===1) ? -1: $scope.patientinterview.status ;
            $scope.submit = 0;
            var url = "";

            if ($scope.patient_id > 0) {
                $scope.patint2.edited_on = moment().format("YYYY-MM-DD HH:MM");
                url = 'update?tablename=patint2&filter=where id = ' + $scope.patient_id;
            } else {
                $scope.patint2.created_on = moment().format("YYYY-MM-DD HH:MM");
                url = 'insert?tablename=patint2';
            }
            $http({
                    url: apiUrl + url, //Your url will be like this.
                    method: 'post',
                    data: $scope.patint2,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .success(function(data) {
                    $scope.loderStatus = 0;


                    $http({
                            url: apiUrl + "update?tablename=medrecidn3&filter=where id = '" + $scope.reff_id + "'&edit_id=" + $scope.reff_id, //Your url will be like this.
                            method: 'post',
                            data: $scope.patient_int,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .success(function(datapatient) {

                        });


                    if (data == 1) {

                        $scope.errortype = 1;
                        $scope.msg = 'You successfully Completed the Patient Interview.';
                        $scope.alrttype = 'success';
                        $timeout(function() {
                            $state.go("ctApp.tablestatic",{IDN:$localStorage.IDN});
                        }, 3000);
                    } else if (data == 3) {
                        $scope.errortype = 1;
                        $scope.msg = 'You successfully Updated the Patient Interview.';
                        $scope.alrttype = 'success';
                        $timeout(function() {
                            $state.go("ctApp.tablestatic",{IDN:$localStorage.IDN});
                        }, 3000);
                    }


                });
        }
    };

    $scope.checkBox = function(choice) {

        $scope.value = $scope.value || [];
        if (choice === true) {
            $scope.value.push(choice);

        } else {
            $scope.value.shift();
        }

    };

    $scope.instructions = function(choice) {
        $scope.instructionss = $scope.instructionss || [];

        if (choice === true) {

            $scope.instructionss.push(choice);

        } else {
            $scope.instructionss.shift();
        }

    };

}]);

//mixpanel.track("PatientInterview", {
//    "PIN": $scope.patientinterview.PIN,
//    "Proc": $scope.patientinterview.CPT,
//    "Created On": $scope.patientinterview.CREATEDON,
//    "IDN": $scope.patientinterview.IDN3
//});