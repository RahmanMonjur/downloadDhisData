var yestdate = new Date();
yestdate.setDate(yestdate.getDate() - 1);
programsList = [];
programStagesList = [];
dataElementsList = [];
programDataElementsList = [];
orgGroupsList = [];
orgGroupOrgsList = [];
userGroupsList = [];
userGroupUsersList = [];
userGroupsOrgsList = [];
orgsList = [];
trackedEntityInstancesList = [];
teiAttributeValuesList = [];
enrollmentsList = [];
teiAttributesList = [];
finalDeList = [];

parentOrg = '';

selectedProgramType = '';
includeTei = '';
selectedPrograms = [];
selectedProgramStages = [];
selectedDataElements = [];
selectedTeiAttributes = [];
selectedOrgGroups = [];
selectedUserGroups = [];
selectedFileFormat = '';
selectedDsFormat = '';
selectedSyntaxFormat = '';
programRawDs = [];
eventsList = [];

$(document).ready(function () {
    $('body').on('focus', '.datein', function () {
        $(this).datepicker({ dateFormat: "yy-mm-dd" });
    });
    selectedDsFormat = 'Wide';
    selectedFileFormat = 'CSV';
    selectedSyntaxFormat = 'spss';
    var reqsts = [
        //0
        $.ajax({
            type: "GET",
            url: "../../../api/programs.json?paging=false&order=displayName:ASC&fields=id,displayName,registration,programStages,programTrackedEntityAttributes",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }),
        //1
        $.ajax({
            type: "GET",
            url: "../../../api/programStages.json?paging=false&order=displayName:ASC&fields=id,displayName,program,repeatable,programStageDataElements[dataElement]",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }),
        //2
        $.ajax({
            type: "GET",
            url: "../../../api/dataElements.json?paging=fals&order=displayFormName:ASC&fields=id,displayFormName,displayDescription,optionSet",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }),
        //3
        $.ajax({
            type: "GET",
            url: "../../../api/organisationUnitGroups.json?paging=false&order=displayName:ASC&fields=id,displayName,organisationUnits",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }),
        //4
        $.ajax({
            type: "GET",
            url: "../../../api/userGroups.json?paging=false&order=displayName:ASC&fields=id,displayName,users",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }),
        //5
        $.ajax({
            type: "GET",
            url: "../../../api/users.json?paging=false&fields=id,userCredentials,organisationUnits,phoneNumber,userGroups",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }),
        //6
        $.ajax({
            type: "GET",
            url: "../../../api/organisationUnits.json?paging=false&fields=id,level,displayName,path,organisationUnitGroups,programs",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }),
        //7
        $.ajax({
            type: "GET",
            url: "../../../api/trackedEntityAttributes.json?paging=false&order=displayFormName:ASC&fields=id,code,displayName",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
    ];

    $.when.apply($, reqsts).done(function () {
        var tmpStages = [];
        var tmpTeiAttrs = [];
        var val0 = arguments[0][0];
        for (var i = 0, len = val0.programs.length; i < len; i++) {
            programsList.push({
                programUid: val0.programs[i].id,
                programName: val0.programs[i].displayName,
                needRegistration: val0.programs[i].registration
            });
            for (var j = 0, len1 = val0.programs[i].programStages.length; j < len1; j++) {
                tmpStages.push({ programStageUid: val0.programs[i].programStages[j].id, programUid: val0.programs[i].id });
            }
            if (val0.programs[i].programTrackedEntityAttributes.length > 0) {
                for (var j = 0, len1 = val0.programs[i].programTrackedEntityAttributes.length; j < len1; j++) {
                    tmpTeiAttrs.push({ teiAttrUid: val0.programs[i].programTrackedEntityAttributes[j].trackedEntityAttribute.id, programUid: val0.programs[i].id });
                }
            }
        }

        var val1 = arguments[1][0];
        for (var i = 0, len = val1.programStages.length; i < len; i++) {
            if (val1.programStages[i].program != null) {
                var tmpStages1 = $.grep(tmpStages, function (v) {
                    return v.programStageUid === val1.programStages[i].id
                });
                if (tmpStages1.length > 0) {
                    programStagesList.push({
                        programStageUid: val1.programStages[i].id,
                        programStageName: val1.programStages[i].displayName,
                        programUid: (val1.programStages[i].program != null) ? val1.programStages[i].program.id : "",
                        repeatable: (val1.programStages[i].repeatable != null) ? val1.programStages[i].repeatable : false
                    });

                    for (var j = 0, len1 = val1.programStages[i].programStageDataElements.length; j < len1; j++) {
                        var deuid = val1.programStages[i].programStageDataElements[j].dataElement.id;
                        programDataElementsList.push({ dataElementUid: deuid, programStageUid: val1.programStages[i].id, programUid: (val1.programStages[i].program != null) ? val1.programStages[i].program.id : "" });
                    }
                }
            }
        }

        var val2 = arguments[2][0];
        dataElementsList = $.grep(programDataElementsList, function (v) {
            var deshortname = "";
            var deformname = "";
            var optionset = "";
            for (var i = 0, len = val2.dataElements.length; i < len; i++) {
                if (v.dataElementUid === val2.dataElements[i].id) {
                    deshortname = (val2.dataElements[i].displayDescription != null) ? val2.dataElements[i].displayDescription : "";
                    deformname = val2.dataElements[i].displayFormName;
                    optionset = (val2.dataElements[i].optionSet != null) ? val2.dataElements[i].optionSet.id : "";
                    break;
                }
            }
            v.dataElementDescription = deshortname;
            v.dataElementFormName = deformname;
            v.optionSet = optionset;
            return true;
        });

        var val3 = arguments[3][0];
        for (var i = 0, len = val3.organisationUnitGroups.length; i < len; i++) {
            if (val3.organisationUnitGroups[i].organisationUnits != null && val3.organisationUnitGroups[i].organisationUnits.length > 0) {
                orgGroupsList.push({ orgGroupUid: val3.organisationUnitGroups[i].id, orgGroupName: val3.organisationUnitGroups[i].displayName });
                for (var j = 0, len1 = val3.organisationUnitGroups[i].organisationUnits.length; j < len1; j++) {
                    orgGroupOrgsList.push({ orgUnitUid: val3.organisationUnitGroups[i].organisationUnits[j].id, orgGroupUid: val3.organisationUnitGroups[i].id })
                }
            }
        }
        // set organisation unit groups in table
        setOrganisationUnitGroups();

        var val4 = arguments[4][0];
        for (var i = 0, len = val4.userGroups.length; i < len; i++) {
            if (val4.userGroups[i].users != null && val4.userGroups[i].users.length > 0) {
                userGroupsList.push({ userGroupUid: val4.userGroups[i].id, userGroupName: val4.userGroups[i].displayName });
                for (var j = 0, len1 = val4.userGroups[i].users.length; j < len1; j++) {
                    userGroupUsersList.push({ userUid: val4.userGroups[i].users[j].id, userGroupUid: val4.userGroups[i].id })
                }
            }
        }
        // set user groups in table
        setUserGroups();

        var val5 = arguments[5][0];
        for (var i = 0, len = val5.users.length; i < len; i++) {
            if (val5.users[i].userGroups) {
                $.each(val5.users[i].userGroups, function (uindx, usergroup) {
                    $.each(val5.users[i].organisationUnits, function (uindx, userorg) {
                        var usr = {
                            userId: val5.users[i].userCredentials.username,
                            userGroupUid: usergroup.id,
                            userOrgUid: userorg.id,
                        };
                        userGroupsOrgsList.push(usr);
                    });
                });
            }
        }

        var val6 = arguments[6][0];
        for (var i = 0, len = val6.organisationUnits.length; i < len; i++) {
            if (val6.organisationUnits[i].level === 1) {
                parentOrg = val6.organisationUnits[i].id;
            }
            var orgv = {
                orgUnitUid: val6.organisationUnits[i].id,
                orgUnitName: val6.organisationUnits[i].displayName,
                orgUnitLevel: val6.organisationUnits[i].level
            };
            orgsList.push(orgv);
        }



        /*
        .done(function (val) {
                for (var j = 0, len1 = val.trackedEntityInstances.length; j < len1; j++) {
                    if (val.trackedEntityInstances[j].deleted == "false") {
                        var tei = {
                            teiUid: val.trackedEntityInstances[j].trackedEntityInstance,
                            orgUnitUid: val.trackedEntityInstances[j].orgUnit,
                            teiVal: val.trackedEntityInstances[j].attributes
                        };
                        trackedEntityInstancesList.push(tei);
                    }
                }
            })


        */

        var val7 = arguments[7][0];
        for (var i = 0, len = val7.trackedEntityAttributes.length; i < len; i++) {
            var tmpTeiAttr1 = $.grep(tmpTeiAttrs, function (v) {
                return v.teiAttrUid === val7.trackedEntityAttributes[i].id
            });
            if (tmpTeiAttr1.length > 0) {
                var teiattr = {
                    teiAttrUid: val7.trackedEntityAttributes[i].id,
                    teiAttrCode: val7.trackedEntityAttributes[i].code,
                    teiAttrName: val7.trackedEntityAttributes[i].displayName
                };
                teiAttributesList.push(teiattr);
            }
        }

        getTeis(orgsList);

    });



    $('.chkprogramreg').change(function () {
        $('#tableProgramReg tr').each(function (i, row) {
            $(row).css('font-weight', 'normal');
        });
        var programreg = $(this).attr("id").replace("chkProgramReg", "");
        if (this.checked) {
            $('.chkprogramreg').prop("checked", false);
            $(this).prop("checked", true);
            $(this).closest('tr').css('font-weight', 'bold');
            $('#divprogram').show();
            $('#tableProgram').empty();
            var rowData = '';
            for (var i = 0, len = programsList.length; i < len; i++) {
                if (programsList[i].needRegistration.toString() === programreg) {
                    rowData += '<tr>';
                    rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + programsList[i].programUid + '" onclick="javascript: programCheckboxChecked(this);"></td>';
                    rowData += '<td align="left" style=" width:0%; display:none;" >' + programsList[i].programUid + '</td>';
                    rowData += '<td align="left" style=" width:90%;" onclick="javascript: programClick(this);">' + programsList[i].programName + '</td>';
                    rowData += '</tr>';
                }
            }
            var rowadd = $(rowData);
            $('#tableProgram').append(rowadd);
        } else {
            $('#divprogram').hide();
            $('#divprogramstage').hide();
            $('#divdataelement').hide();
            $('#tableProgram').empty();
            $('#tableProgramStage').empty();
            $('#tableDataElement').empty();
            selectedPrograms = [];
            selectedProgramStages = [];
            selectedDataElements = [];
            $('.checkall').prop("checked", false);
        }
        if (programreg === "true") {
            $('#tableTeiIncl').show();
        } else {
            $('#tableTeiIncl').hide();
            $('#chkTeiIncl').prop("checked", false);
            $('#chkTeiIncl').closest('tr').css('font-weight', 'normal');
            $('#chkDsWide').prop("checked", false);
            $('#chkDsLong').prop("checked", true);
            selectedDsFormat = "Long";
        }
    });

    $('#chkTeiIncl').change(function () {
        if (this.checked) {
            $(this).closest('tr').css('font-weight', 'bold');
            $('#divteiattr').show();
            $('#tableTeiAttr').empty();
            var rowData = '';
            for (var i = 0, len = teiAttributesList.length; i < len; i++) {
                rowData += '<tr>';
                rowData += '<td align="left" style=" width:5%; "> <input type="checkbox" id="chk' + teiAttributesList[i].teiAttrUid + '" onclick="javascript: teiAttributeCheckboxChecked(this);"></td>';
                rowData += '<td align="left" style=" width:90%;">' + teiAttributesList[i].teiAttrName + '</td>';
                rowData += '<td align="right" style=" width:5%; "> <input type="checkbox" id="chk' + teiAttributesList[i].teiAttrUid + 'mask" onclick="javascript: teiAttributeMaskCheckboxChecked(this);"></td>';
                rowData += '</tr>';
            }
            var rowadd = $(rowData);
            $('#tableTeiAttr').append(rowadd);
        } else {
            $(this).closest('tr').css('font-weight', 'normal');
            $('#divteiattr').hide();
        }
    });

    $('.chkfileformat').change(function () {
        $('#tableFileFormat tr').each(function (i, row) {
            $(row).css('font-weight', 'normal');
        });
        if (this.checked) {
            selectedFileFormat = $('td:nth(1)', $(this).closest('tr')).text();
            $('.chkfileformat').prop("checked", false);
            $(this).prop("checked", true);
            $(this).closest('tr').css('font-weight', 'bold');
        }
    });

    $('.chkdsformat').change(function () {
        $('#tableDsFormat tr').each(function (i, row) {
            $(row).css('font-weight', 'normal');
        });
        if (this.checked) {
            var programreg = $('input:radio.chkprogramreg:checked').attr("id").replace("chkProgramReg", "");
            if (programreg === "false" && $('td:nth(1)', $(this).closest('tr')).text() === "Wide") {
                alert('Long format dataset is better for event programs.')
                return;
            }
            selectedDsFormat = $('td:nth(1)', $(this).closest('tr')).text();
            $('.chkdsformat').prop("checked", false);
            $(this).prop("checked", true);
            $(this).closest('tr').css('font-weight', 'bold');
        }
    });

    $('.chksyntaxformat').change(function () {
        $('#tableSyntaxFormat tr').each(function (i, row) {
            $(row).css('font-weight', 'normal');
        });
        if (this.checked) {
            selectedSyntaxFormat = $('td:nth(1)', $(this).closest('tr')).text();
            $('.chksyntaxformat').prop("checked", false);
            $(this).prop("checked", true);
            $(this).closest('tr').css('font-weight', 'bold');
        }
    });

    $('#divGo').click(function () {
        if (selectedPrograms.length == 0) {
            alert('please select a program first');
            return;
        }
        getAllEvents(orgsList);

        /*
        var finaleventlist = [];
        $.each(selectedPrograms, function (progindx, program) {
            var progevents = $.grep(eventsList, function (v) {
                return v.programUid === program.programUid;
            });
            var filteredeventlist = getFilteredEventList(progevents);
            if (program.needRegistration === true) {
                var teieventlist = [];
                var teilist = getFilteredTeiList();
                if (teilist.length > 0) {
                    $.each(filteredeventlist, function (progindx, event) {
                        var teifound = "";
                        $.each(teilist, function (progindx, tei) {
                            if (event.teiUid === tei.teiUid) {
                                teifound = "Y";
                                return false;
                            }
                            return true;
                        });
                        if (teifound === "Y") {
                            teieventlist.push(event);
                        }
                    });
                    finaleventlist = teieventlist;
                }
            } else {
                finaleventlist = filteredeventlist;
            }
        });
        var finalDeVals = getEventDEvalues(finaleventlist);
        if (selectedDsFormat === "Long") {
            arrayToCSV(finalDeVals);
        } else {
            var devalues = [];
            $.each(finalDeVals, function (progindx, ev) {
                devalues.push([ev.eventId, ev.eventKey, ev.eventValue]);
            });
            var restarr = getPivotArray(devalues, 0, 1, 2, "TEIUID_ENROLUID");
            if (selectedFileFormat === "CSV") {
                arrayToCSV(restarr);
            } else if (selectedFileFormat === "JSON") {
                arrayToJson(restarr);
            }
        }
        */

    });

    $('#divSave').click(function () {
        var setting = {};
        setting["programreg"] = $('input:radio.chkprogramreg:checked').attr("id").replace("chkProgramReg", "");
        setting["teiincl"] = $("#chkTeiIncl").is(':checked');
        var programs = [];
        $.each(selectedPrograms, function (indx, program) {
            programs.push(program.programUid);
        });
        setting["programs"] = programs;
        var programstages = [];
        $.each(selectedProgramStages, function (indx, programstage) {
            programstages.push(programstage.programStageUid);
        });
        setting["programstages"] = programstages;
        var dataelements = [];
        $.each(selectedDataElements, function (indx, de) {
            dataelements.push({ deuid: de.dataElementUid, programstageuid: de.programStageUid, programuid: de.programUid, masked: de.masked });
        });
        setting["dataelements"] = dataelements;
        var orgs = [];
        $.each(selectedOrgGroups, function (indx, org) {
            orgs.push(org.orgGroupUid);
        });
        setting["orgs"] = orgs;
        var users = [];
        $.each(selectedUserGroups, function (indx, user) {
            users.push(user);
        });
        setting["users"] = users;
        var teiattrs = [];
        $.each(selectedTeiAttributes, function (indx, teiattr) {
            teiattrs.push({ teiattruid: teiattr.teiAttrUid, masked: teiattr.masked });
        });
        setting["teiattrs"] = teiattrs;
        setting["enrdatefrom"] = $('#txtEnrDateFrom').val();
        setting["enrdateto"] = $('#txtEnrDateTo').val();
        setting["eventdatefrom"] = $('#txtEventDateFrom').val();
        setting["eventdateto"] = $('#txtEventDateTo').val();
        setting["fileformat"] = selectedFileFormat;
        setting["dsformat"] = selectedDsFormat;
        setting["syntaxformat"] = selectedSyntaxFormat;


        var exportedFilenmae = 'Settings' + getDateNow().replace(/\//g, '') + '.txt';
        var blob = new Blob([JSON.stringify(setting)], {
            type: 'text/plain;charset=utf-8;'
        });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    });

    $('#divApply').click(function () {
        $('#choosefile').click();
    });
    $('input[type="file"]').on('change', function () {
        var file = $('#choosefile')[0].files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                var setting = JSON.parse(evt.target.result);
                if (setting != null) {
                    setSettings(setting);
                }
            }
            reader.onerror = function (evt) {
                alert("error reading settings file");
            }
        }
    });

    $('#divsyntax').click(function () {
        if (selectedPrograms.length == 0) {
            alert('please select a program first');
            return;
        }
        var programreg = $('input:radio.chkprogramreg:checked').attr("id").replace("chkProgramReg", "");
        var deOptions = [];
        $.ajax({
            type: "GET",
            url: "../../../api/optionSets.json?paging=false&fields=id,name,options[code,name]",
            contentType: "application/json; charset=utf-8",
            data: '',
            dataType: "json",
        }).done(function (results) {

            // Can be used when not depending on the download process of the dataset first
            /*
            $.each(selectedPrograms, function (pindx, program) {
                var pstagelist = $.grep(selectedProgramStages, function (v) {
                    return program.programUid === v.programUid;
                });
                if (pstagelist.length > 0) {
                    $.each(pstagelist, function (psindx, pstage) {
                        var pstagen = $.grep(programStagesList, function (v) {
                            return pstage.programUid === v.programUid && pstage.programStageUid === v.programStageUid;
                        });
                        var delist = $.grep(selectedDataElements, function (v) {
                            return pstage.programUid === v.programUid && pstage.programStageUid === v.programStageUid;
                        });
                        if (delist.length > 0) {
                            if (results.optionSets.length > 0) {
                                $.each(delist, function (dindx, de) {
                                    var des = $.grep(dataElementsList, function (de1) {
                                        return de.dataElementUid === v.dataElementUid;
                                    });
                                    if (des.length > 0) {
                                        var optionsets = $.grep(results.optionSets, function (optionset) {
                                            return optionset.id === des[0].optionSet;
                                        });
                                        if (optionsets.length > 0) {
                                            $.each(optionsets[0].options, function (opindx, option) {
                                                deOptions.push({ programStageUid:pstagen[0].programStageUid, programStageName:pstagen[0].programStageName, deUid: des[0].dataElementUid, deName: des[0].dataElementFormName, code: option.code, value: option.name.replace(/'/g, '') });
                                            });
                                        }
                                    }
                                });
                            }
                        } else {
                            var delist = $.grep(dataElementsList, function (v) {
                                return pstage.programUid === v.programUid && pstage.programStageUid === v.programStageUid;
                            });
                            if (results.optionSets.length > 0) {
                                $.each(delist, function (dindx, de) {
                                    var optionsets = $.grep(results.optionSets, function (optionset) {
                                        return optionset.id === de.optionSet;
                                    });
                                    if (optionsets.length > 0) {
                                        $.each(optionsets[0].options, function (opindx, option) {
                                            deOptions.push({ programStageUid:pstagen[0].programStageUid, programStageName:pstagen[0].programStageName, deUid: de.dataElementUid, deName: de.dataElementFormName, code: option.code, value: option.name.replace(/'/g, '') });
                                        });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    if (programreg==="false"){
                        var pstagelist = $.grep(programStagesList, function (v) {
                            return program.programUid === v.programUid;
                        });
                        if (pstagelist.length > 0) {
                            $.each(pstagelist, function (psindx, pstage) {
                                var delist = $.grep(dataElementsList, function (v) {
                                    return pstage.programUid === v.programUid && pstage.programStageUid === v.programStageUid;
                                });
                                if (results.optionSets.length > 0) {
                                    $.each(delist, function (dindx, de) {
                                        var optionsets = $.grep(results.optionSets, function (optionset) {
                                            return optionset.id === de.optionSet;
                                        });
                                        if (optionsets.length > 0) {
                                            $.each(optionsets[0].options, function (opindx, option) {
                                                deOptions.push({ programStageUid:pstagen[0].programStageUid, programStageName:pstagen[0].programStageName, deUid: de.dataElementUid, deName: de.dataElementFormName, code: option.code, value: option.name.replace(/'/g, '') });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                }

            });
            */

            if (finalDeList.length > 0) {
                if (selectedDsFormat === "Wide") {
                    $.each(finalDeList, function (fdindx, de) {
                        var dename = '';
                        var values = de.toString().toLowerCase() + " ";
                        var deuid = de.substr(de.length - 11);
                        var stguid = de.substring(0, 11);
                        var stgname = '';
                        var progstage = $.grep(programStagesList, function (v) {
                            return stguid === v.programStageUid;
                        });
                        if (progstage.length == 0) {
                            var a = "";
                        }
                        stgname = progstage.length > 0 ? progstage[0].programStageName : "";

                        var delist = $.grep(dataElementsList, function (v) {
                            return deuid === v.dataElementUid;
                        });
                        if (delist.length > 0) {
                            dename = stgname + ': ' + delist[0].dataElementFormName;
                            var optionsets = $.grep(results.optionSets, function (optionset) {
                                return optionset.id === delist[0].optionSet;
                            });
                            if (optionsets.length > 0) {
                                $.each(optionsets[0].options, function (opindx, option) {
                                    if ($.isNumeric(option.code)) {
                                        values += option.code + " '" + option.name.replace(/'/g, '') + "' ";
                                    } else {
                                        values += "'" + option.code + "' '" + option.name.replace(/'/g, '') + "' ";
                                    }
                                    //deOptions.push({ programStageUid:pstagen[0].programStageUid, programStageName:pstagen[0].programStageName, deUid: de.dataElementUid, deName: de.dataElementFormName, code: option.code, value: option.name.replace(/'/g, '') });
                                });
                                deOptions.push([de, dename, values]);
                            }
                        }
                    });
                    var rd = '';
                    var vd = '';
                    for (var i = 0, len = deOptions.length; i < len; i++) {
                        if (selectedSyntaxFormat.toLowerCase() === "spss") {
                            rd += "VARIABLE LABELS \n";
                            rd += deOptions[i][0] + " '" + deOptions[i][1].replace(/'/g, '"') + "'. \n";
                            rd += "EXECUTE. \n";
                            rd += "\n";
                            if (deOptions[i][2].length > 30) {
                                vd += "VALUE LABELS \n";
                                vd += deOptions[i][2].replace(/'/g, '"') + " .\n";
                                vd += "EXECUTE. \n";
                                vd += "\n";
                            }
                        } else if (selectedSyntaxFormat.toLowerCase() === "stata") {
                            rd += "label variable ";
                            rd += deOptions[i][0].toString().toLowerCase() + ' "' + deOptions[i][1].replace(/'/g, '"') + '" \n';
                            if (deOptions[i][2].length > 30) {
                                vd += "label define " + deOptions[i][2].toString().replace(/'/g, '"') + "\n";
                            }
                        }
                    }

                    var exportedFilenmae = 'Syntax' + getDateNow().replace(/\//g, '') + '.txt';
                    var blob = new Blob([rd + '\n\n' + vd], {
                        type: 'text/plain;charset=utf-8;'
                    });
                    if (navigator.msSaveBlob) { // IE 10+
                        navigator.msSaveBlob(blob, exportedFilenmae);
                    } else {
                        var link = document.createElement("a");
                        if (link.download !== undefined) {
                            var url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", exportedFilenmae);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    }

                } else {
                    $.each(finalDeList, function (fdindx, de) {
                        var dename = '';
                        var values = de.toString().toLowerCase() + " ";
                        var deuid = de.substr(de.length - 11);
                        var stguid = de.substring(0, 11);
                        var stgname = '';
                        var progstage = $.grep(programStagesList, function (v) {
                            return stguid === v.programStageUid;
                        });
                        stgname = progstage[0].programStageName;

                        var delist = $.grep(dataElementsList, function (v) {
                            return deuid === v.dataElementUid;
                        });
                        dename = stgname + ': ' + delist[0].dataElementFormName;
                        var optionsets = $.grep(results.optionSets, function (optionset) {
                            return optionset.id === delist[0].optionSet;
                        });
                        if (optionsets.length > 0) {
                            $.each(optionsets[0].options, function (opindx, option) {
                                if ($.isNumeric(option.code)) {
                                    values += option.code + " '" + option.name.replace(/'/g, '') + "' ";
                                } else {
                                    values += "'" + option.code + "' '" + option.name.replace(/'/g, '') + "' ";
                                }
                                deOptions.push([de, dename, values]);
                            });
                        }
                    });
                }
            } else {
                alert('You have to download the dataset first.');
                return;
            }
        });
    });
});

function getDateYMD(date) {
    var parts = date.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function setSettings(setting) {

    var programreg = '#chkProgramReg' + setting.programreg;
    $(programreg).prop('checked', true);
    $(programreg).closest('tr').css('font-weight', 'bold');
    $('#divprogram').show();
    $('#tableProgram').empty();
    var rowData = '';
    for (var i = 0, len = programsList.length; i < len; i++) {
        if (programsList[i].needRegistration.toString() === setting.programreg) {
            rowData += '<tr>';
            rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + programsList[i].programUid + '" onclick="javascript: programCheckboxChecked(this);"></td>';
            rowData += '<td align="left" style=" width:0%; display:none;" >' + programsList[i].programUid + '</td>';
            rowData += '<td align="left" style=" width:90%;" onclick="javascript: programClick(this);">' + programsList[i].programName + '</td>';
            rowData += '</tr>';
        }
    }
    var rowadd = $(rowData);
    $('#tableProgram').append(rowadd);
    if (setting.programreg === "true") {
        $('#tableTeiIncl').show();
    }
    /*
    else {
        $('#tableTeiIncl').hide();
        $('#chkTeiIncl').prop("checked", false);
        $('#chkTeiIncl').closest('tr').css('font-weight', 'normal');
        $('#chkDsWide').prop("checked", false);
        $('#chkDsLong').prop("checked", true);
        selectedDsFormat = "Long";
    }
    */

    if (setting.teiincl === true) {
        $('#chkTeiIncl').prop("checked", true);
        $('#chkTeiIncl').closest('tr').css('font-weight', 'bold');
        $('#divteiattr').show();
        $('#tableTeiAttr').empty();
        var rowData1 = '';
        for (var i = 0, len = teiAttributesList.length; i < len; i++) {
            rowData1 += '<tr>';
            rowData1 += '<td align="left" style=" width:5%; "> <input type="checkbox" id="chk' + teiAttributesList[i].teiAttrUid + '" onclick="javascript: teiAttributeCheckboxChecked(this);"></td>';
            rowData1 += '<td align="left" style=" width:90%;">' + teiAttributesList[i].teiAttrName + '</td>';
            rowData1 += '<td align="right" style=" width:5%; "> <input type="checkbox" id="chk' + teiAttributesList[i].teiAttrUid + 'mask" onclick="javascript: teiAttributeMaskCheckboxChecked(this);"></td>';
            rowData1 += '</tr>';
        }
        var rowadd1 = $(rowData1);
        $('#tableTeiAttr').append(rowadd1);
    }

    if (setting.teiattrs.length > 0) {
        $.each(setting.teiattrs, function (pindx, attr) {
            selectedTeiAttributes.push({ teiAttrUid: attr.teiattruid, masked: attr.masked });
            $('#tableTeiAttr tr').each(function (i, row) {
                if ($('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "") === attr.teiattruid) {
                    $('td:nth(0)', $(row)).find("input[type=checkbox]").prop("checked", true);
                    $(row).css('font-weight', 'bold');
                    if (attr.masked === "Y") {
                        $('td:nth(2)', $(row)).find("input[type=checkbox]").prop("checked", true);
                    }
                }
            });
        });
    }

    if (setting.programs.length > 0) {
        $.each(setting.programs, function (pindx, program) {
            var proglist = $.grep(programsList, function (v) {
                return v.programUid === program;
            });
            selectedPrograms.push({ programUid: program, programName: proglist[0].programName, needRegistration: proglist[0].needRegistration });
            $('#tableProgram tr').each(function (i, row) {
                if ($('td:nth(1)', $(row)).text() === program) {
                    $(row).find("input[type=checkbox]").prop("checked", true);
                }
            });
        });
        $('#tableProgram tr').each(function (i, row) {
            if ($('td:nth(1)', $(row)).text() === setting.programs[0]) {
                $(row).css('font-weight', 'bold');
            }
        });

        $('#tableProgramStage').empty();
        var rowData2 = '';
        for (var i = 0, len = programStagesList.length; i < len; i++) {
            if (programStagesList[i].programUid === setting.programs[0]) {
                rowData2 += '<tr>';
                rowData2 += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + programStagesList[i].programStageUid + '" onclick="javascript: programStageCheckboxChecked(this);"></td>';
                rowData2 += '<td align="left" style=" width:0%; display:none;" >' + programStagesList[i].programUid + '</td>';
                rowData2 += '<td align="left" style=" width:90%;" onclick="javascript: programStageClick(this);">' + programStagesList[i].programStageName + '</td>';
                rowData2 += '</tr>';
            }
        }
        var rowadd2 = $(rowData2);
        $('#tableProgramStage').append(rowadd2);
        $('#divprogramstage').show();
    }

    if (setting.programstages.length > 0) {
        $.each(setting.programstages, function (psindx, pstage) {
            var pstagelist = $.grep(programStagesList, function (v) {
                return v.programStageUid === pstage;
            });
            selectedProgramStages.push({ programStageUid: pstagelist[0].programStageUid, programUid: pstagelist[0].programUid });
            $('#tableProgramStage tr').each(function (i, row) {
                if ($('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "") === pstagelist[0].programStageUid) {
                    $(row).find("input[type=checkbox]").prop("checked", true);
                }
            });
        });
        var pstage1st = "";
        $('#tableProgramStage tr').each(function (i, row) {
            if ($('td:nth(0)', $(row)).find("input[type=checkbox]").is(':checked')) {
                pstage1st = $('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "");
                $(row).css('font-weight', 'bold');
                return false;
            }
        });


        $('#tableDataElement').empty();
        var rowData3 = '';
        for (var i = 0, len = dataElementsList.length; i < len; i++) {
            if (dataElementsList[i].programStageUid === pstage1st) {
                rowData3 += '<tr>';
                rowData3 += '<td align="left" style=" width:5%; "> <input type="checkbox" id="chk' + dataElementsList[i].dataElementUid + '" onclick="javascript: dataElementCheckboxChecked(this);"></td>';
                rowData3 += '<td align="left" style=" width:0%; display:none;" >' + dataElementsList[i].programStageUid + '</td>';
                rowData3 += '<td align="left" style=" width:0%; display:none;" >' + dataElementsList[i].programUid + '</td>';
                rowData3 += '<td align="left" style=" width:90%;" title="' + dataElementsList[i].dataElementDescription + '">' + dataElementsList[i].dataElementFormName + '</td>';
                rowData3 += '<td align="right" style=" width:5%; "> <input type="checkbox" id="chk' + dataElementsList[i].dataElementUid + 'mask" onclick="javascript: dataElementMaskCheckboxChecked(this);"></td>';
                rowData3 += '</tr>';
            }
        }
        var rowadd3 = $(rowData3);
        $('#tableDataElement').append(rowadd3);
        $('#divdataelement').show();

    }

    if (setting.dataelements.length > 0) {
        $.each(setting.dataelements, function (dindx, de) {
            selectedDataElements.push({ dataElementUid: de.deuid, programStageUid: de.programstageuid, programUid: de.programuid, masked: de.masked });
            $('#tableDataElement tr').each(function (i, row) {
                if ($('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "") === de.deuid && $('td:nth(1)', $(row)).text() === de.programstageuid && de.programstageuid === pstage1st) {
                    $('td:nth(0)', $(row)).find("input[type=checkbox]").prop("checked", true);
                    $(row).css('font-weight', 'bold');
                    if (de.masked === "Y") {
                        $('td:nth(4)', $(row)).find("input[type=checkbox]").prop("checked", true);
                    }
                }
            });
        });
    }

    if (setting.orgs.length > 0) {
        $.each(setting.orgs, function (oindx, org) {
            selectedOrgGroups.push(org);
            $('#tableOrgGroup tr').each(function (i, row) {
                if ($('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "") === org) {
                    $('td:nth(0)', $(row)).find("input[type=checkbox]").prop("checked", true);
                    $(row).css('font-weight', 'bold');
                }
            });
        });
    }

    if (setting.users.length > 0) {
        $.each(setting.users, function (oindx, user) {
            selectedUserGroups.push(user);
            $('#tableUserGroup tr').each(function (i, row) {
                if ($('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "") === user) {
                    $('td:nth(0)', $(row)).find("input[type=checkbox]").prop("checked", true);
                    $(row).css('font-weight', 'bold');
                }
            });
        });
    }

    $('#txtEnrDateFrom').val(setting.enrdatefrom);
    $('#txtEnrDateTo').val(setting.enrdateto);
    $('#txtEventDateFrom').val(setting.eventdatefrom);
    $('#txtEventDateTo').val(setting.eventdateto);
    selectedFileFormat = setting.fileformat || "";
    $('.chkfileformat').prop("checked", false);
    $('#chkfileformat' + setting.fileformat || "").prop("checked", true);
    selectedDsFormat = setting.dsformat || "";
    $('.chkdsformat').prop("checked", false);
    $('#chkDs' + setting.dsformat || "").prop("checked", true);
    selectedSyntaxFormat = setting.syntaxformat || "";
    $('.chksyntaxformat').prop("checked", false);
    $('#chk' + setting.syntaxformat || "").prop("checked", true);

}

function getFilteredTeiList() {
    var enrstdate = ($('#txtEnrDateFrom').val() !== '') ? $('#txtEnrDateFrom').val() : "1900-01-01";
    var enrendate = ($('#txtEnrDateTo').val() !== '') ? $('#txtEnrDateTo').val() : "2900-01-01";
    var teilist = $.grep(enrollmentsList, function (v) {
        return getDateYMD(v.enrolDate) >= getDateYMD(enrstdate) && getDateYMD(v.enrolDate) <= getDateYMD(enrendate);
    });
    return teilist;
}

function getFilteredEventList(events) {
    // Filtering event by event date parameters
    var evtstdate = ($('#txtEventDateFrom').val() !== '') ? $('#txtEventDateFrom').val() : "1900-01-01";
    var evtendate = ($('#txtEventDateTo').val() !== '') ? $('#txtEventDateTo').val() : "2900-01-01";
    var filteredeventlist = $.grep(events, function (v) {
        //return getDateYMD(v.eventDate ? v.eventDate.substring(0, 10) : "1899-01-01") >= getDateYMD(evtstdate) && getDateYMD(v.eventDate ? v.eventDate.substring(0, 10) : "2901-01-01") <= getDateYMD(evtendate);
        return getDateYMD(v.eventDate ? v.eventDate : "1899-01-01") >= getDateYMD(evtstdate) && getDateYMD(v.eventDate ? v.eventDate : "2901-01-01") <= getDateYMD(evtendate);
    });

    // Filtering event by selected user groups
    var userfilteredeventlist = [];
    if (selectedUserGroups.length > 0) {
        $.each(filteredeventlist, function (progindx, event) {
            var userfound = "";
            $.each(selectedUserGroups, function (ugindx, usergroup) {
                var userlist = $.grep(userGroupsOrgsList, function (v) {
                    return usergroup === v.userGroupUid && v.userId === event.storedBy;
                });
                if (userlist.length > 0) {
                    userfound = "Y";
                    return false;
                }
                return true;
            });
            if (userfound === "Y") {
                userfilteredeventlist.push(event);
            }
        });
    } else {
        userfilteredeventlist = filteredeventlist;
    }

    // Filtering event by selected organisation units
    var orgfilteredeventlist = [];
    if (selectedOrgGroups.length > 0) {
        $.each(userfilteredeventlist, function (progindx, event) {
            var orgfound = "";
            $.each(selectedOrgGroups, function (ugindx, orggroup) {
                var orggrouplist = $.grep(orgGroupOrgsList, function (v) {
                    return orggroup.orgGroupUid === v.orgGroupUid;
                });
                if (orggrouplist.length > 0) {
                    $.each(orggrouplist, function (ugindx, orggroupuser) {
                        var orglist = $.grep(userGroupsOrgsList, function (v) {
                            return orggroupuser.orgUnitUid === v.userOrgUid && v.userOrgUid === event.orgUnit;
                        });
                        if (orglist.length > 0) {
                            orgfound = "Y";
                            return false;
                        }
                        return true;
                    });
                    return false;
                }
                return true;
            });
            if (orgfound === "Y") {
                orgfilteredeventlist.push(event);
            }
        });
    } else {
        orgfilteredeventlist = userfilteredeventlist;
    }

    // Filtering event by selected program stages
    var stagefilteredeventlist = [];
    if (selectedProgramStages.length > 0) {
        $.each(selectedProgramStages, function (progindx, pstage) {
            var progstageeventlist = $.grep(orgfilteredeventlist, function (v) {
                return pstage.programStageUid === v.programStageUid;
            });
            stagefilteredeventlist = $.merge(stagefilteredeventlist, progstageeventlist);
            //stagefilteredeventlist.push(progstageeventlist);
        });
    } else {
        stagefilteredeventlist = orgfilteredeventlist;
    }

    return stagefilteredeventlist;
}

function getTeis(arr) {
    var promises = [];
    $("#divstat").html("Some background tasks are still going on, however, can continue with other works.");
    $("#divstat").show();
    $.each(arr, function (indx, obj) {
        var p = $.when($.ajax({
            type: "GET",
            url: "../../../api/trackedEntityInstances.json?paging=false&fields=orgUnit,trackedEntityInstance,deleted,attributes,status&ou=" + obj.orgUnitUid,
            contentType: "application/json; charset=utf-8",
            data: '',
            dataType: "json"
        }),
            $.ajax({
                type: "GET",
                url: "../../../api/enrollments.json?paging=false&fields=enrollment,program,trackedEntityInstance,orgUnit,enrollmentDate,status,deleted&ou=" + obj.orgUnitUid,
                contentType: "application/json; charset=utf-8",
                data: '',
                dataType: "json"
            })).done(function (val1, val2) {
                for (var j = 0, len1 = val1[0].trackedEntityInstances.length; j < len1; j++) {
                    if (val1[0].trackedEntityInstances[j].deleted === false) {
                        var tei = {
                            teiUid: val1[0].trackedEntityInstances[j].trackedEntityInstance,
                            orgUnitUid: val1[0].trackedEntityInstances[j].orgUnit,
                            teiVal: val1[0].trackedEntityInstances[j].attributes
                        };
                        trackedEntityInstancesList.push(tei);

                        $.each(val1[0].trackedEntityInstances[j].attributes, function (tvalindx, tval) {
                            var tei = {
                                teiUid: val1[0].trackedEntityInstances[j].trackedEntityInstance,
                                orgUid: val1[0].trackedEntityInstances[j].orgUnit,
                                teiAttrUid: tval.attribute,
                                teiAttrValue: tval.value
                            };
                            teiAttributeValuesList.push(tei);
                        });
                    }
                }
                for (var j = 0, len1 = val2[0].enrollments.length; j < len1; j++) {
                    if (val2[0].enrollments[j].deleted === false) {
                        var enrol = {
                            enrolUid: val2[0].enrollments[j].enrollment,
                            enrolDate: val2[0].enrollments[j].enrollmentDate.substring(0, 10),
                            programUid: val2[0].enrollments[j].program,
                            teiUid: val2[0].enrollments[j].trackedEntityInstance,
                            orgUnitUid: val2[0].enrollments[j].orgUnit,
                            enrolStatus: val2[0].enrollments[j].status
                        };
                        enrollmentsList.push(enrol);
                    }
                }
            });
        promises.push(p);

    });
    successfulAjaxCalls(promises).then(function (results) {
        setTimeout(function () {
            $("#divstat").hide();
        }, 1000);
    });
}

// function is executed when clicked on Go button
function getAllEvents(arrOrg) {
    var allEvents = [];
    var promises = [];
    $("#divstat").html("Some background tasks are going on for preparing the dataset. Please wait....");
    $("#divstat").show();
    $("#wait").css("display", "block");
    $.each(selectedPrograms, function (pindx, program) {
        $.each(arrOrg, function (indx, org) {
            var p = $.ajax({
                type: "GET",
                url: "../../../api/events.json?paging=false&program=" + program.programUid + "&orgUnit=" + org.orgUnitUid + "&fields=program,event,programStage,orgUnit,trackedEntityInstance,enrollment,enrollmentStatus,status,orgUnitName,eventDate,deleted,storedBy,dataValues&order=program:ASC,programStage:ASC,eventDate:ASC",
                contentType: "application/json; charset=utf-8",
                data: '',
                dataType: "json"
            })
                .done(function (val) {
                    if (val.events.length > 0) {
                        var eventdesval = []
                        $.each(val.events, function (progindx, event) {
                            var evtobj = {};
                            if (program.needRegistration === true) {
                                if (event.eventDate && event.deleted === false && (event.enrollmentStatus === "ACTIVE" || event.enrollmentStatus === "COMPLETE") && event.status !== "SCHEDULE" && event.dataValues.length > 0) {
                                    var arrexists = $.grep(eventsList, function (v) {
                                        return v.programUid + v.enrolUid + v.teiUid + v.programStageUid === event.program + event.enrollment + event.trackedEntityInstance + event.programStage;
                                    });
                                    evtobj.enrolUid = event.enrollment;
                                    evtobj.teiUid = event.trackedEntityInstance;
                                    evtobj.visitNo = arrexists.length + 1;
                                    var devalueList = [];
                                    $.each(event.dataValues, function (progindx, deval) {
                                        var valobj = {};
                                        valobj.deUid = deval.dataElement;
                                        valobj.deValue = deval.value;
                                        devalueList.push(valobj);
                                        eventdesval.push([event.program + '_' + event.enrollment + '_' + event.trackedEntityInstance + '_' + event.programStage, event.event, event.eventDate.substring(0, 10), (arrexists.length + 1), deval.dataElement, deval.value]);
                                    });
                                    evtobj.orgUid = event.orgUnit;
                                    evtobj.programUid = event.program;
                                    evtobj.programStageUid = event.programStage;
                                    evtobj.eventUid = event.event;
                                    evtobj.eventDate = event.eventDate.substring(0, 10);
                                    evtobj.deValues = devalueList;
                                    evtobj.storedBy = event.storedBy;
                                    eventsList.push(evtobj);
                                }
                            } else {
                                if (event.eventDate && event.deleted === false && event.dataValues.length > 0) {
                                    evtobj.orgUid = event.orgUnit;
                                    evtobj.programUid = event.program;
                                    evtobj.programStageUid = event.programStage;
                                    evtobj.eventUid = event.event;
                                    evtobj.eventDate = event.eventDate.substring(0, 10);
                                    var devalueList = [];
                                    $.each(event.dataValues, function (progindx, deval) {
                                        var valobj = {};
                                        valobj.deUid = deval.dataElement;
                                        valobj.deValue = deval.value;
                                        devalueList.push(valobj);
                                        eventdesval.push([event.program + '_' + event.orgUnit + '_' + event.programStage, event.event, event.eventDate.substring(0, 10), deval.dataElement, deval.value]);
                                    });
                                    evtobj.deValues = devalueList;
                                    evtobj.storedBy = event.storedBy;
                                    eventsList.push(evtobj);
                                }
                            }
                        });
                    }
                });
            promises.push(p);
        });
    });

    successfulAjaxCalls(promises).then(function (results) {
        setTimeout(function () {
            $("#divstat").hide();
            $("#wait").css("display", "none");
        }, 1000);

        var programreg = $('input:radio.chkprogramreg:checked').attr("id").replace("chkProgramReg", "");
        var filteredeventlist = getFilteredEventList(eventsList);
        if (programreg === "true") {
            var teieventlist = [];
            var teilist = getFilteredTeiList();
            if (teilist.length > 0) {
                $.each(filteredeventlist, function (progindx, event) {
                    var teifound = "";
                    $.each(teilist, function (progindx, tei) {
                        if (event.teiUid === tei.teiUid) {
                            teifound = "Y";
                            return false;
                        }
                        return true;
                    });
                    if (teifound === "Y") {
                        teieventlist.push(event);
                    }
                });
                finaleventlist = teieventlist;
            }
        } else {
            finaleventlist = filteredeventlist;
        }
        var finalDeVals = getEventDEvalues(finaleventlist);
        if (selectedDsFormat === "Long") {
            arrayToCSV(finalDeVals);
        } else {
            var devalues = [];
            $.each(finalDeVals, function (progindx, ev) {
                devalues.push([ev.eventId, ev.eventKey, ev.eventValue]);
            });
            var restarr = getPivotArray(devalues, 0, 1, 2, "TEIUID_ENROLUID");
            if (selectedFileFormat === "CSV") {
                arrayToCSV(restarr);
            } else if (selectedFileFormat === "JSON") {
                arrayToJson(restarr);
            }
        }

    });


}

// function is executed immediate after a program got selected
function getEvents(arr, program) {
    var promises = [];
    $("#divstat").html("Some background tasks are going on, however, can continue with other works.");
    $("#divstat").show();
    $.each(arr, function (indx, obj) {
        var p = $.ajax({
            type: "GET",
            url: "../../../api/events.json?paging=false&program=" + program.programUid + "&orgUnit=" + obj.orgUnitUid + "&fields=program,event,programStage,orgUnit,trackedEntityInstance,enrollment,enrollmentStatus,status,orgUnitName,eventDate,deleted,storedBy,dataValues&order=program:ASC,enrollment:ASC,programStage:ASC,eventDate:ASC",
            contentType: "application/json; charset=utf-8",
            data: '',
            dataType: "json"
        })
            .done(function (val) {
                /*
                if (val.events.length > 0) {
                    var obje = {};
                    obje["programUid"] = program;
                    obje["events"] = val.events;
                    programRawDs.push(obje);
                }
                */
                if (val.events.length > 0) {
                    var eventdesval = []
                    $.each(val.events, function (progindx, event) {
                        var evtobj = {};
                        if (program.needRegistration === true) {
                            if (event.eventDate && event.deleted === false && (event.enrollmentStatus === "ACTIVE" || event.enrollmentStatus === "COMPLETE") && event.status !== "SCHEDULE" && event.dataValues.length > 0) {
                                var arrexists = $.grep(eventsList, function (v) {
                                    return v.programUid + v.enrolUid + v.teiUid + v.programStageUid === event.program + event.enrollment + event.trackedEntityInstance + event.programStage;
                                });
                                evtobj.enrolUid = event.enrollment;
                                evtobj.teiUid = event.trackedEntityInstance;
                                evtobj.visitNo = arrexists.length + 1;
                                var devalueList = [];
                                $.each(event.dataValues, function (progindx, deval) {
                                    var valobj = {};
                                    valobj.deUid = deval.dataElement;
                                    valobj.deValue = deval.value;
                                    devalueList.push(valobj);
                                    eventdesval.push([event.program + '_' + event.enrollment + '_' + event.trackedEntityInstance + '_' + event.programStage, event.event, event.eventDate.substring(0, 10), (arrexists.length + 1), deval.dataElement, deval.value]);
                                });
                                evtobj.orgUid = event.orgUnit;
                                evtobj.programUid = event.program;
                                evtobj.programStageUid = event.programStage;
                                evtobj.eventUid = event.event;
                                evtobj.eventDate = event.eventDate.substring(0, 10);
                                evtobj.deValues = devalueList;
                                eventsList.push(evtobj);
                            }
                        } else {
                            if (event.eventDate && event.deleted === false && event.dataValues.length > 0) {
                                evtobj.orgUid = event.orgUnit;
                                evtobj.programUid = event.program;
                                evtobj.programStageUid = event.programStage;
                                evtobj.eventUid = event.event;
                                evtobj.eventDate = event.eventDate.substring(0, 10);
                                var devalueList = [];
                                $.each(event.dataValues, function (progindx, deval) {
                                    var valobj = {};
                                    valobj.deUid = deval.dataElement;
                                    valobj.deValue = deval.value;
                                    devalueList.push(valobj);
                                    eventdesval.push([event.program + '_' + event.orgUnit + '_' + event.programStage, event.event, event.eventDate.substring(0, 10), deval.dataElement, deval.value]);
                                });
                                evtobj.deValues = devalueList;
                                eventsList.push(evtobj);
                            }
                        }
                    });
                }
            });
        promises.push(p);
    });
    successfulAjaxCalls(promises).then(function (results) {
        setTimeout(function () {
            $("#divstat").hide();
        }, 1000);
    });
}

function getEventDEvalues(events) {
    /*
    events.sort(function (a, b) {
        return (a.enrolUid + a.programStageUid + (a.visitNo ? a.visitNo : '0') + a.deUid > b.enrolUid + b.programStageUid + (b.visitNo ? b.visitNo : '0') + b.deUid ) ? 1 : ((b.enrolUid + b.programStageUid + (b.visitNo ? b.visitNo : '0') + b.deUid > a.enrolUid + a.programStageUid + (a.visitNo ? a.visitNo : '0') + a.deUid) ? -1 : 0);
    });
    */


    var eventdesval = [];
    if ($("#chkTeiIncl").is(':checked')) {
        if (selectedDsFormat === "Wide") {
            var teilist = [];
            $.each(events, function (progindx, event) {
                var teiexists = $.grep(teilist, function (v) {
                    return v.teiUid === event.teiUid && v.enrolUid === event.enrolUid;
                });
                if (teiexists.length === 0) {
                    teilist.push({ teiUid: event.teiUid, enrolUid: event.enrolUid });
                }
            });
            if (selectedTeiAttributes.length > 0) {
                $.each(selectedTeiAttributes, function (tindx, attr) {
                    var teiattrexistsvalues = $.grep(teiAttributeValuesList, function (v) {
                        return v.teiAttrUid === attr.teiAttrUid;
                    });
                    $.each(teiattrexistsvalues, function (tindx, tei) {
                        var teiexists = $.grep(teilist, function (v) {
                            return v.teiUid === tei.teiUid;
                        });
                        if (teiexists.length > 0) {
                            obj = {
                                eventId: teiexists[0].teiUid + '_' + teiexists[0].enrolUid,
                                eventKey: 'ATTR_' + tei.teiAttrUid,
                                eventValue: (attr.masked === "Y") ? stringToHex(tei.teiAttrValue) : tei.teiAttrValue
                            };
                            eventdesval.push(obj);
                        }
                    });
                });
            } else {
                $.each(teiAttributesList, function (tindx, attr) {
                    var teiattrexistsvalues = $.grep(teiAttributeValuesList, function (v) {
                        return v.teiAttrUid === attr.teiAttrUid;
                    });
                    $.each(teiattrexistsvalues, function (tindx, tei) {
                        var teiexists = $.grep(teilist, function (v) {
                            return v.teiUid === tei.teiUid;
                        });
                        if (teiexists.length > 0) {
                            obj = {
                                eventId: teiexists[0].teiUid + '_' + teiexists[0].enrolUid,
                                eventKey: 'ATTR_' + tei.teiAttrUid,
                                eventValue: tei.teiAttrValue
                            };
                            eventdesval.push(obj);
                        }
                    });
                });
            }

            /*
            $.each(teiAttributeValuesList, function (tindx, tei) {
                var teiexists = $.grep(teilist, function (v) {
                    return v.teiUid === tei.teiUid;
                });
                if (teiexists.length > 0) {
                    var teiattrexists = $.grep(selectedTeiAttributes, function (v) {
                        return v.teiAttrUid === tei.teiAttrUid;
                    });
                    if (teiattrexists.length > 0 && selectedTeiAttributes.length > 0) {
                        obj = {
                            eventId: teiexists[0].teiUid + '_' + teiexists[0].enrolUid,
                            eventKey: 'Attr_' + tei.teiAttrUid,
                            eventValue: (teiattrexists[0].masked === "Y") ? stringToHex(tei.teiAttrValue) : tei.teiAttrValue
                        };
                        eventdesval.push(obj);
                    } else if (selectedTeiAttributes.length === 0) {
                        obj = {
                            eventId: teiexists[0].teiUid + '_' + teiexists[0].enrolUid,
                            eventKey: 'Attr_' + tei.teiAttrUid,
                            eventValue: tei.teiAttrValue
                        };
                        eventdesval.push(obj);
                    }
                }
            });
            */

            /*
            if (selectedTeiAttributes.length > 0) {
                $.each(teiAttributeValuesList, function (tindx, tei) {
                    var teiexists = $.grep(teilist, function (v) {
                        return v.teiUid === tei.teiUid;
                    });
                    if (teiexists.length > 0) {
                        var teiattrexists = $.grep(selectedTeiAttributes, function (v) {
                            return v.teiAttrUid === tei.teiAttrUid;
                        });
                        if (teiattrexists.length > 0) {
                            obj = {
                                eventId: teiexists[0].teiUid + '_' + teiexists[0].enrolUid,
                                eventKey: 'Attr_' + tei.teiAttrUid,
                                eventValue: tei.teiAttrValue
                            };
                            eventdesval.push(obj);
                        }
                    }
                });
            } else {
                $.each(teiAttributeValuesList, function (tindx, tei) {
                    var teiexists = $.grep(teilist, function (v) {
                        return v.teiUid === tei.teiUid;
                    });
                    if (teiexists.length > 0) {
                        obj = {
                            eventId: teiexists[0].teiUid + '_' + teiexists[0].enrolUid,
                            eventKey: 'Attr_' + tei.teiAttrUid,
                            eventValue: tei.teiAttrValue
                        };
                        eventdesval.push(obj);
                    }
                });

            }
            */
        }
    }

    if (selectedDsFormat === "Wide") {
        $.each(events, function (progindx, event) {
            var obj = {};
            obj = {
                //eventId: event.programUid + '_' + event.enrolUid + '_' + event.teiUid,
                eventId: event.teiUid + '_' + event.enrolUid,
                eventKey: event.programStageUid + '_' + event.visitNo + '_EVENTUID',
                eventValue: event.eventUid
            };
            eventdesval.push(obj);
            obj = {
                eventId: event.teiUid + '_' + event.enrolUid,
                eventKey: event.programStageUid + '_' + event.visitNo + '_ORGUNIT',
                eventValue: event.orgUid
            };
            eventdesval.push(obj);
            obj = {
                eventId: event.teiUid + '_' + event.enrolUid,
                eventKey: event.programStageUid + '_' + event.visitNo + '_EVENTDATE',
                eventValue: event.eventDate
            };
            eventdesval.push(obj);

            var pstageexists = $.grep(selectedDataElements, function (v) {
                return v.programUid + v.programStageUid === event.programUid + event.programStageUid;
            });
            if (pstageexists.length > 0) {
                $.each(pstageexists, function (progindx, del) {
                    var deexists = $.grep(event.deValues, function (v) {
                        return v.deUid === del.dataElementUid;
                    });
                    if (deexists.length > 0) {
                        obj = {
                            eventId: event.teiUid + '_' + event.enrolUid,
                            eventKey: event.programStageUid + '_' + event.visitNo + '_' + del.dataElementUid,
                            eventValue: (del.masked === "Y") ? stringToHex(deexists[0].deValue) : deexists[0].deValue
                        };
                    } else {
                        obj = {
                            eventId: event.teiUid + '_' + event.enrolUid,
                            eventKey: event.programStageUid + '_' + event.visitNo + '_' + del.dataElementUid,
                            eventValue: ""
                        };
                    }
                    eventdesval.push(obj);
                });

            } else {
                if (selectedProgramStages.length > 0) {
                    var pstageexists = $.grep(selectedProgramStages, function (v) {
                        return v.programUid + v.programStageUid === event.programUid + event.programStageUid;
                    });
                    if (pstageexists.length > 0) {
                        var delist = $.grep(programDataElementsList, function (v) {
                            return v.programUid + v.programStageUid === event.programUid + event.programStageUid;
                        });
                        if (delist.length > 0) {
                            $.each(delist, function (progindx, del) {
                                var deexists = $.grep(event.deValues, function (v) {
                                    return v.deUid === del.dataElementUid;
                                });
                                if (deexists.length > 0) {
                                    obj = {
                                        eventId: event.teiUid + '_' + event.enrolUid,
                                        eventKey: event.programStageUid + '_' + event.visitNo + '_' + del.dataElementUid,
                                        eventValue: deexists[0].deValue
                                    };
                                } else {
                                    obj = {
                                        eventId: event.teiUid + '_' + event.enrolUid,
                                        eventKey: event.programStageUid + '_' + event.visitNo + '_' + del.dataElementUid,
                                        eventValue: ""
                                    };
                                }
                                eventdesval.push(obj);
                            });
                        }
                    }
                } else {
                    var pstagelist = $.grep(programStagesList, function (v) {
                        return v.programUid === event.programUid && v.programStageUid === event.programStageUid;
                    });
                    $.each(pstagelist, function (progindx, psl) {
                        var delist = $.grep(programDataElementsList, function (v) {
                            return v.programUid + v.programStageUid === psl.programUid + psl.programStageUid;
                        });
                        $.each(delist, function (progindx, del) {
                            var deexists = $.grep(event.deValues, function (v) {
                                return v.deUid === del.dataElementUid;
                            });
                            if (deexists.length > 0) {
                                obj = {
                                    eventId: event.teiUid + '_' + event.enrolUid,
                                    eventKey: event.programStageUid + '_' + event.visitNo + '_' + del.dataElementUid,
                                    eventValue: deexists[0].deValue
                                };
                            } else {
                                obj = {
                                    eventId: event.teiUid + '_' + event.enrolUid,
                                    eventKey: event.programStageUid + '_' + event.visitNo + '_' + del.dataElementUid,
                                    eventValue: ""
                                };
                            }
                            eventdesval.push(obj);
                        });
                    });
                }
            }

            /*
            $.each(event.deValues, function (progindx, deval) {
                if (selectedDataElements.length > 0) {
                    var pstageexists = $.grep(selectedDataElements, function (v) {
                        return v.programUid + v.programStageUid === event.programUid + event.programStageUid;
                    });
                    if (pstageexists.length > 0) {
                        var deexists = $.grep(selectedDataElements, function (v) {
                            return v.dataElementUid + v.programStageUid === deval.deUid + event.programStageUid;
                        });
                        if (deexists.length > 0) {
                            obj = {
                                eventId: event.teiUid + '_' + event.enrolUid,
                                eventKey: event.programStageUid + '_' + event.visitNo + '_' + deval.deUid,
                                eventValue: (deexists[0].masked === "Y") ? stringToHex(deval.deValue) : deval.deValue
                            };
                            eventdesval.push(obj);
                        }
                    } else {
                        obj = {
                            eventId: event.teiUid + '_' + event.enrolUid,
                            eventKey: event.programStageUid + '_' + event.visitNo + '_' + deval.deUid,
                            eventValue: deval.deValue
                        };
                        eventdesval.push(obj);
                    }

                } else {
                    obj = {
                        eventId: event.teiUid + '_' + event.enrolUid,
                        eventKey: event.programStageUid + '_' + event.visitNo + '_' + deval.deUid,
                        eventValue: deval.deValue
                    };
                    eventdesval.push(obj);
                }
            });
            */
        });
    } else {
        if (selectedPrograms.length > 1) {
            alert('please select only one program to get the dataset in long format.')
            return;
        }
        var repeatstages = [];
        var repeatdes = [];
        var nonrepeatstages = [];
        var nonrepeatdes = [];
        var programreg = $('input:radio.chkprogramreg:checked').attr("id").replace("chkProgramReg", "");
        if (selectedProgramStages.length > 0) {
            $.each(selectedProgramStages, function (progindx, stage) {
                var stages = $.grep(programStagesList, function (v) {
                    return v.programStageUid === stage.programStageUid;
                });
                if (programreg === "false") {
                    repeatstages.push(stage.programStageUid);
                } else {
                    if (stages[0].repeatable === true) {
                        repeatstages.push(stage.programStageUid);
                    } else {
                        nonrepeatstages.push(stage.programStageUid);
                    }
                }
            });
        } else {
            var stages = $.grep(programStagesList, function (v) {
                return v.programUid === selectedPrograms[0].programUid;
            });
            if (programreg === "false") {
                $.each(stages, function (progindx, stage) {
                    repeatstages.push(stage.programStageUid);
                });
            }
        }
        if (programreg === "true" && repeatstages.length === 0) {
            alert('please select a program stage at least which is repeatable.')
            return;
        }
        $.each(repeatstages, function (progindx, stage) {
            var stagedes = $.grep(selectedDataElements, function (v) {
                return v.programStageUid === stage;
            });
            if (stagedes.length > 0) {
                $.each(stagedes, function (progindx, de) {
                    repeatdes.push(de.dataElementUid);
                });
            } else {
                var delist = $.grep(programDataElementsList, function (v) {
                    return v.programStageUid === stage;
                });
                $.each(delist, function (progindx, de) {
                    repeatdes.push(de.dataElementUid);
                });
            }
        });
        if (nonrepeatstages.length > 0) {
            var indextoremove = [];
            $.each(nonrepeatstages, function (stageindx, stage) {
                var delist = $.grep(programDataElementsList, function (v) {
                    return v.programStageUid === stage;
                });
                var stagedes = $.grep(selectedDataElements, function (v) {
                    return v.programStageUid === stage;
                });
                if (stagedes.length > 0) {
                    var count = 0;
                    $.each(stagedes, function (progindx, de) {
                        if (repeatdes.indexOf(de.dataElementUid) > -1) {
                            count++;
                        }
                    });
                    if (((count / stagedes.length) * 100).toFixed(0) > 50) {
                        $.each(stagedes, function (progindx, de) {
                            repeatdes.push(de.dataElementUid);
                        });
                        repeatstages.push(stage);
                        indextoremove.push(stageindx);
                    } else {
                        $.each(stagedes, function (progindx, de) {
                            nonrepeatdes.push(de.dataElementUid);
                        });
                    }
                } else {
                    var count = 0;
                    $.each(delist, function (progindx, de) {
                        if (repeatdes.indexOf(de.dataElementUid) > -1) {
                            count++;
                        }
                    });
                    if (((count / delist.length) * 100).toFixed(0) > 50) {
                        $.each(delist, function (progindx, de) {
                            repeatdes.push(de.dataElementUid);
                        });
                        repeatstages.push(stage);
                        indextoremove.push(stageindx);
                    } else {
                        $.each(delist, function (progindx, de) {
                            nonrepeatdes.push(de.dataElementUid);
                        });
                    }
                }
            });
            $.each(indextoremove, function (indx, id) {
                nonrepeatstages.splice(id, 1);
            });
        }
        repeatdes = unique(repeatdes);
        nonrepeatdes = unique(nonrepeatdes);
        var singlevals = [];
        var singlevals1 = [];
        var repeatvals = [];
        var repeatvals1 = [];



        $.each(events, function (progindx, event) {
            var obj = {};
            if (programreg === "true") {
                if (repeatstages.indexOf(event.programStageUid) > -1) {
                    /*
                    obj = {
                        eventId: event.teiUid + '_' + event.enrolUid + '_' + event.eventUid,
                        eventKey: '_EVENTUID',
                        eventValue: event.eventUid
                    };
                    repeatvals.push(obj);
                    repeatvals1.push([event.teiUid + '_' + event.enrolUid + '_' + event.eventUid, '1_EVENTUID', event.eventUid]);
                    */
                    obj = {
                        eventId: event.teiUid + '_' + event.enrolUid + '_' + event.eventUid,
                        eventKey: '_ORGUNIT',
                        eventValue: event.orgUid
                    };
                    repeatvals.push(obj);
                    repeatvals1.push([event.teiUid + '_' + event.enrolUid + '_' + event.eventUid, 'A1_ORGUNIT', event.orgUid]);
                    obj = {
                        eventId: event.teiUid + '_' + event.enrolUid + '_' + event.eventUid,
                        eventKey: '_EVENTDATE',
                        eventValue: event.eventDate
                    };
                    repeatvals.push(obj);
                    repeatvals1.push([event.teiUid + '_' + event.enrolUid + '_' + event.eventUid, 'A1_EVENTDATE', event.eventDate]);

                    $.each(repeatdes, function (progindx, de) {
                        var devalue = $.grep(event.deValues, function (v) {
                            return v.deUid === de;
                        });
                        /*
                        if (devalue.length > 0) {
                            obj = {
                                eventId: event.teiUid + '_' + event.enrolUid + '_' + event.eventUid,
                                eventKey: de,
                                eventValue: devalue[0].deValue
                            };
                            repeatvals.push(obj);
                            repeatvals1.push([event.teiUid + '_' + event.enrolUid + '_' + event.eventUid, de, devalue[0].deValue]);
                        }
                        */

                        obj = {
                            eventId: event.teiUid + '_' + event.enrolUid + '_' + event.eventUid,
                            eventKey: de,
                            eventValue: (devalue.length > 0) ? devalue[0].deValue : ""
                        };
                        repeatvals.push(obj);
                        repeatvals1.push([event.teiUid + '_' + event.enrolUid + '_' + event.eventUid, de, (devalue.length > 0) ? devalue[0].deValue : ""]);

                    });
                } else {



                    $.each(nonrepeatdes, function (progindx, de) {
                        var devalue = $.grep(event.deValues, function (v) {
                            return v.deUid === de;
                        });
                        /*
                        if (devalue.length > 0) {
                            obj = {
                                eventId: event.teiUid + '_' + event.enrolUid + '_' + event.eventUid,
                                eventKey: de,
                                eventValue: devalue[0].deValue
                            };
                            singlevals.push(obj);
                            singlevals1.push([event.teiUid + '_' + event.enrolUid + '_' + event.eventUid, de, devalue[0].deValue]);
                        }
                        */

                        obj = {
                            eventId: event.teiUid + '_' + event.enrolUid,
                            eventKey: de,
                            eventValue: (devalue.length > 0) ? devalue[0].deValue : ""
                        };
                        singlevals.push(obj);
                        singlevals1.push([event.teiUid + '_' + event.enrolUid, de, (devalue.length > 0) ? devalue[0].deValue : ""]);

                    });
                }
                /*
                $.each(event.deValues, function (progindx, deval) {
                    if (repeatdes.indexOf(deval.deUid) > -1) {
                        obj = {
                            eventId: event.teiUid + '_' + event.enrolUid,
                            eventKey: deval.deUid,
                            eventValue: deval.deValue
                        };
                        repeatvals.push(obj);
                    } else if (nonrepeatdes.indexOf(deval.deUid) > -1) {
                        obj = {
                            eventId: event.teiUid + '_' + event.enrolUid,
                            eventKey: deval.deUid,
                            eventValue: deval.deValue
                        };
                        singlevals.push(obj);
                    }
                });
                */
            } else {
                $.each(repeatdes, function (progindx, de) {
                    var devalue = $.grep(event.deValues, function (v) {
                        return v.deUid === de;
                    });
                    obj = {};
                    obj["eventId"] = event.programUid + '-' + event.eventUid;
                    obj["eventKey"] = de;
                    obj["eventValue"] = (devalue.length > 0) ? devalue[0].deValue : "";
                    repeatvals.push(obj);
                    repeatvals1.push([event.programUid + '-' + event.eventUid, de, (devalue.length > 0) ? devalue[0].deValue : ""]);
                });

            }

        });

        if (programreg === "true" && $("#chkTeiIncl").is(':checked')) {
            var teilist = [];
            $.each(events, function (progindx, event) {
                var teiexists = $.grep(teilist, function (v) {
                    return v.teiUid === event.teiUid && v.enrolUid === event.enrolUid;
                });
                if (teiexists.length === 0) {
                    teilist.push({ teiUid: event.teiUid, enrolUid: event.enrolUid });
                }
            });
            if (selectedTeiAttributes.length > 0) {
                $.each(selectedTeiAttributes, function (tindx, attr) {
                    var teiattrexistsvalues = $.grep(teiAttributeValuesList, function (v) {
                        return v.teiAttrUid === attr.teiAttrUid;
                    });
                    $.each(teiattrexistsvalues, function (tindx, tei) {
                        var teiexists = $.grep(teilist, function (v) {
                            return v.teiUid === tei.teiUid;
                        });
                        if (teiexists.length > 0) {
                            obj = {
                                eventId: teiexists[0].teiUid + '_' + teiexists[0].enrolUid,
                                eventKey: 'ATTR_' + tei.teiAttrUid,
                                eventValue: (attr.masked === "Y") ? stringToHex(tei.teiAttrValue) : tei.teiAttrValue
                            };
                            singlevals.push(obj);
                            singlevals1.push([teiexists[0].teiUid + '_' + teiexists[0].enrolUid, 'ATTR_' + tei.teiAttrUid, (attr.masked === "Y") ? stringToHex(tei.teiAttrValue) : tei.teiAttrValue]);
                        }
                    });
                });
            } else {
                $.each(teiAttributesList, function (tindx, attr) {
                    var teiattrexistsvalues = $.grep(teiAttributeValuesList, function (v) {
                        return v.teiAttrUid === attr.teiAttrUid;
                    });
                    $.each(teiattrexistsvalues, function (tindx, tei) {
                        var teiexists = $.grep(teilist, function (v) {
                            return v.teiUid === tei.teiUid;
                        });
                        if (teiexists.length > 0) {
                            obj = {
                                eventId: teiexists[0].teiUid + '_' + teiexists[0].enrolUid,
                                eventKey: 'ATTR_' + tei.teiAttrUid,
                                eventValue: tei.teiAttrValue
                            };
                            singlevals.push(obj);
                            singlevals1.push([teiexists[0].teiUid + '_' + teiexists[0].enrolUid, 'ATTR_' + tei.teiAttrUid, tei.teiAttrValue]);
                        }
                    });
                });
            }
        }
        if (programreg === "true") {
            if (repeatvals.length > 0) {
                var repeatvalues = getPivotArray(repeatvals1, 0, 1, 2, "TEIUID_ENROLUID_EVETUID");
                var singlevalues = getPivotArray(singlevals1, 0, 1, 2, "TEIUID_ENROLUID");
                /*
                $.each(repeatvals, function (progindx, val1) {
                    var b = $.grep(repeatvalues, function (val2) {
                        return val1.eventId === val2.eventId && val1.eventKey === val2.eventKey && val1.eventValue === val2.eventValue;
                    });
                    if (b.length === 0) {
                        repeatvalues.push(val1);
                    }
                });
                */
                /*
                 $.each(repeatvals, function (progindx, val1) {
                     repeatvalues.push(val1.eventId, val1.eventKey, val1.eventValue);
                 });
                 $.each(singlevals, function (progindx, val1) {
                     repeatvalues.push(val1.eventId, val1.eventKey, val1.eventValue);
                 });
                 */
                var finalarr = [];
                var emptyarr = [];
                for (var i = 0; i < repeatdes.length; i++) {
                    emptyarr.push("");
                }
                $.each(singlevalues, function (val1indx, val1) {
                    var found = "";
                    $.each(repeatvalues, function (val2indx, val2) {
                        if (val2indx > 0) {
                            if (val1[0] === val2[0].substring(0, 23)) {
                                val2[0] = val2[0].substring(24);
                                finalarr.push(val1.concat(val2));
                                found = "Y";
                            }
                        } else {
                            if (val1indx === 0) {
                                val2[0] = 'A1_EVENTUID'
                                finalarr.push(val1.concat(val2));
                                found = "Y";
                            }
                        }
                    });
                    if (found === "") {
                        finalarr.push(val1.concat(emptyarr));
                    }
                });
                eventdesval = finalarr;
            }
        } else {
            eventdesval = getPivotArray(repeatvals1, 0, 1, 2, "EVENTUID");
        }

        /*
        $.each(event.deValues, function (progindx, deval) {
            if (event.enrolUid) {
                obj = {
                    eventKey: event.programUid + '_' + event.enrolUid + '_' + event.teiUid,
                    eventStage: event.programStageUid,
                    orgUid: event.orgUid,
                    eventDate: event.eventDate,
                    visitNo: event.visitNo,
                    eventUid: event.eventUid,
                    deUid: deval.deUid,
                    deValue: deval.deValue
                };
                eventdesval.push(obj);
            } else {
                obj = {
                    eventKey: event.programUid + '_' + event.orgUid,
                    eventUid: event.eventUid,
                    eventDate: event.eventDate,
                    deUid: deval.deUid,
                    deValue: deval.deValue
                };
                eventdesval.push(obj);
            }
        });
        */
    }


    return eventdesval;
}

function successfulAjaxCalls(promises) {
    var d = $.Deferred(), results = [];
    var remaining = promises.length;
    for (var i = 0; i < promises.length; i++) {
        promises[i].then(function (res) {
            results.push(res); // on success, add to results
        }).always(function (res) {
            remaining--; // always mark as finished
            if (!remaining) d.resolve(results);
        })
    }
    return d.promise(); // return a promise on the remaining values
}

function programCheckboxChecked(ctl) {
    var programreg = $('input:radio.chkprogramreg:checked').attr("id").replace("chkProgramReg", "");
    var program = $(ctl).attr("id").replace("chk", "");
    $('#tableProgram tr').each(function (i, row) {
        $(row).css('font-weight', 'normal');
    });
    if (ctl.checked) {
        if (programreg === "false") {
            selectedPrograms = [];
            $('#tableProgram tr').each(function (i, row) {
                $(row).find("input[type=checkbox]").prop("checked", false);
            });
            $(ctl).prop("checked", true);
        }
        var proglist = $.grep(programsList, function (v) {
            return v.programUid === program;
        });
        selectedPrograms.push({ programUid: program, programName: proglist[0].programName, needRegistration: proglist[0].needRegistration });
        $(ctl).closest('tr').css('font-weight', 'bold');
        $('#tableProgramStage').empty();
        var rowData = '';
        for (var i = 0, len = programStagesList.length; i < len; i++) {
            if (programStagesList[i].programUid === program) {
                rowData += '<tr>';
                rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + programStagesList[i].programStageUid + '" onclick="javascript: programStageCheckboxChecked(this);"></td>';
                rowData += '<td align="left" style=" width:0%; display:none;" >' + programStagesList[i].programUid + '</td>';
                rowData += '<td align="left" style=" width:90%;" onclick="javascript: programStageClick(this);">' + programStagesList[i].programStageName + '</td>';
                rowData += '</tr>';
            }
        }
        var rowadd = $(rowData);
        $('#tableProgramStage').append(rowadd);
        $('#divprogramstage').show();
        /*
        var progexists = jQuery.grep(eventsList, function (v) {
            return v.programUid === program;
        });
        if (progexists.length === 0) {
            getEvents(orgsList, proglist[0]);
        }
        */
    } else {
        //selectedPrograms.splice($.inArray(program, selectedPrograms), 1);
        selectedPrograms = jQuery.grep(selectedPrograms, function (v) {
            return v.programUid !== program;
        });
        selectedProgramStages = jQuery.grep(selectedProgramStages, function (v) {
            return v.programUid !== program;
        });
        selectedDataElements = jQuery.grep(selectedDataElements, function (v) {
            return v.programUid !== program;
        });
        $('#divprogramstage').hide();
        $('#divdataelement').hide();
        $('#tableProgramStage').empty();
        $('#tableDataElement').empty();
    }
    $('.checkall').prop("checked", false);
}

function programStageCheckboxChecked(ctl) {
    var programstage = $(ctl).attr("id").replace("chk", "");
    var ptr = $(ctl).closest('tr');
    var program = $('td:nth(1)', $(ptr)).text();
    $('#tableProgramStage tr').each(function (i, row) {
        $(row).css('font-weight', 'normal');
    });
    if (ctl.checked) {
        selectedProgramStages.push({ programStageUid: programstage, programUid: program });
        $(ctl).closest('tr').css('font-weight', 'bold');
        $('#tableDataElement').empty();
        var rowData = '';
        for (var i = 0, len = dataElementsList.length; i < len; i++) {
            if (dataElementsList[i].programStageUid === programstage) {
                rowData += '<tr>';
                rowData += '<td align="left" style=" width:5%; "> <input type="checkbox" id="chk' + dataElementsList[i].dataElementUid + '" onclick="javascript: dataElementCheckboxChecked(this);"></td>';
                rowData += '<td align="left" style=" width:0%; display:none;" >' + dataElementsList[i].programStageUid + '</td>';
                rowData += '<td align="left" style=" width:0%; display:none;" >' + dataElementsList[i].programUid + '</td>';
                rowData += '<td align="left" style=" width:90%;" title="' + dataElementsList[i].dataElementDescription + '">' + dataElementsList[i].dataElementFormName + '</td>';
                rowData += '<td align="right" style=" width:5%; "> <input type="checkbox" id="chk' + dataElementsList[i].dataElementUid + 'mask" onclick="javascript: dataElementMaskCheckboxChecked(this);"></td>';
                rowData += '</tr>';
            }
        }
        var rowadd = $(rowData);
        $('#tableDataElement').append(rowadd);
        $('#divdataelement').show();
    } else {
        //selectedProgramStages.splice($.inArray(programstage, selectedProgramStages), 1 );
        selectedProgramStages = jQuery.grep(selectedProgramStages, function (v) {
            return v.programStageUid + v.programUid !== programstage + program;
        });
        $('#tableDataElement').empty();
        $('#divdataelement').hide();
    }
    $('.checkall').prop("checked", false);
}

function dataElementCheckboxChecked(ctl) {
    var dataelement = $(ctl).attr("id").replace("chk", "");
    var ptr = $(ctl).closest('tr');
    var progstage = $('td:nth(1)', $(ptr)).text();
    var program = $('td:nth(2)', $(ptr)).text();
    if (ctl.checked) {
        $(ptr).css('font-weight', 'bold');
        selectedDataElements.push({ dataElementUid: dataelement, programStageUid: progstage, programUid: program, masked: "" });
    } else {
        //selectedDataElements.splice($.inArray(dataelement, selectedDataElements), 1 );
        selectedDataElements = jQuery.grep(selectedDataElements, function (v) {
            return v.dataElementUid + v.programStageUid + v.programUid !== dataelement + progstage + program;
        });
    }
    $('.checkall').prop("checked", false);
}

function dataElementMaskCheckboxChecked(ctl) {
    var dataelement = $(ctl).attr("id").replace("chk", "").replace("mask", "");
    var ptr = $(ctl).closest('tr');
    if ($('td:nth(0)', $(ptr)).find("input[type=checkbox]").is(':checked') === false) {
        alert('please select the data element first.');
        $(ctl).prop('checked', false);
        return;
    }
    var progstage = $('td:nth(1)', $(ptr)).text();
    var program = $('td:nth(2)', $(ptr)).text();
    if (ctl.checked) {
        selectedDataElements = jQuery.grep(selectedDataElements, function (v) {
            if (v.dataElementUid + v.programStageUid + v.programUid === dataelement + progstage + program) {
                v.masked = "Y";
            }
            return 1 == 1;
        });
    } else {
        //selectedDataElements.splice($.inArray(dataelement, selectedDataElements), 1 );
        selectedDataElements = jQuery.grep(selectedDataElements, function (v) {
            if (v.dataElementUid + v.programStageUid + v.programUid === dataelement + progstage + program) {
                v.masked = "";
            }
            return 1 == 1;
        });
    }
    $('.checkall').prop("checked", false);
}

function programClick(e) {
    var ptr = $(e).closest('tr');
    if ($(ptr).find("input[type=checkbox]").is(':checked')) {
        var program = $('td:nth(1)', $(ptr)).text();
        $('#tableProgram tr').each(function (i, row) {
            $(row).css('font-weight', 'normal');
        });
        $(ptr).css('font-weight', 'bold');
        $('#tableProgramStage').empty();
        var rowData = '';
        for (var i = 0, len = programStagesList.length; i < len; i++) {
            if (programStagesList[i].programUid === program) {
                var tmpStages = $.grep(selectedProgramStages, function (v) {
                    return v.programUid === program && v.programStageUid === programStagesList[i].programStageUid
                });
                if (tmpStages.length > 0) {
                    rowData += '<tr style="font-weight:bold;">';
                    rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + programStagesList[i].programStageUid + '" onclick="javascript: programStageCheckboxChecked(this);" checked></td>';
                } else {
                    rowData += '<tr>';
                    rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + programStagesList[i].programStageUid + '" onclick="javascript: programStageCheckboxChecked(this);" ></td>';
                }
                rowData += '<td align="left" style=" width:0%; display:none;" >' + programStagesList[i].programUid + '</td>';
                rowData += '<td align="left" style=" width:90%;" onclick="javascript: programStageClick(this);">' + programStagesList[i].programStageName + '</td>';
                rowData += '</tr>';
            }
        }
        var rowadd = $(rowData);
        $('#tableProgramStage').append(rowadd);
        $('#divprogramstage').show();
        $('#tableDataElement').empty();
    }
    $('.checkall').prop("checked", false);
}

function programStageClick(e) {
    var ptr = $(e).closest('tr');
    if ($(ptr).find("input[type=checkbox]").is(':checked')) {
        var programstage = $(ptr).find("input[type=checkbox]").attr("id").replace("chk", "");
        var program = $('td:nth(1)', $(ptr)).text();
        $('#tableProgramStage tr').each(function (i, row) {
            $(row).css('font-weight', 'normal');
        });
        $(ptr).css('font-weight', 'bold');
        $('#tableDataElement').empty();
        var rowData = '';
        for (var i = 0, len = dataElementsList.length; i < len; i++) {
            if (dataElementsList[i].programUid === program && dataElementsList[i].programStageUid === programstage) {
                var programDataElementsList = $.grep(selectedDataElements, function (v) {
                    return v.programUid + v.programStageUid + v.dataElementUid === program + programstage + dataElementsList[i].dataElementUid
                });
                if (programDataElementsList.length > 0) {
                    rowData += '<tr style="font-weight:bold;">';
                    rowData += '<td align="left" style=" width:5%; "> <input type="checkbox" id="chk' + dataElementsList[i].dataElementUid + '" onclick="javascript: dataElementCheckboxChecked(this);" checked></td>';
                } else {
                    rowData += '<tr>';
                    rowData += '<td align="left" style=" width:5%; "> <input type="checkbox" id="chk' + dataElementsList[i].dataElementUid + '" onclick="javascript: dataElementCheckboxChecked(this);"></td>';
                }
                rowData += '<td align="left" style=" width:0%; display:none;" >' + dataElementsList[i].programStageUid + '</td>';
                rowData += '<td align="left" style=" width:0%; display:none;" >' + dataElementsList[i].programUid + '</td>';
                rowData += '<td align="left" style=" width:90%;" title="' + dataElementsList[i].dataElementDescription + '">' + dataElementsList[i].dataElementFormName + '</td>';
                rowData += '<td align="right" style=" width:5%; "> <input type="checkbox" id="chk' + dataElementsList[i].dataElementUid + 'mask" onclick="javascript: dataElementMaskCheckboxChecked(this);"></td>';
                rowData += '</tr>';
            }
        }
        var rowadd = $(rowData);
        $('#tableDataElement').append(rowadd);
        $('#divdataelement').show();
    }
    $('.checkall').prop("checked", false);
}

function selectAllProgramStages() {
    var frow = $('#tableProgramStage').children('tr:first');
    var program = $('td:nth(1)', $(frow)).text();
    selectedProgramStages = jQuery.grep(selectedProgramStages, function (v) {
        return v.programUid !== program;
    });
    $('#tableProgramStage tr').each(function (i, row) {
        $(row).find("input[type=checkbox]").prop("checked", true);
        var programstage = $(row).find("input[type=checkbox]").attr("id").replace("chk", "");
        selectedProgramStages.push({ programStageUid: programstage, programUid: program });
    });
}

function clearAllProgramStages(ctl) {
    var ptr = $(ctl).closest('tr');
    $(ptr).find("input[type=checkbox]").prop("checked", false);
    var frow = $('#tableProgramStage').children('tr:first');
    var program = $('td:nth(1)', $(frow)).text();
    selectedProgramStages = jQuery.grep(selectedProgramStages, function (v) {
        return v.programUid !== program;
    });
    $('#tableProgramStage tr').each(function (i, row) {
        $(row).find("input[type=checkbox]").prop("checked", false);
        $(row).css('font-weight', 'normal');
    });
}

function selectAllTeiAttributes() {
    //var frow = $('#tableTeiAttr').children('tr:first');
    $('#tableTeiAttr tr').each(function (i, row) {
        $('td:nth(0)', $(row)).find("input[type=checkbox]").prop("checked", true);
        var teiattr = $('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "");
        selectedTeiAttributes.push({ teiAttrUid: teiattr, masked: "" });
    });
}

function clearAllTeiAttributes() {
    $('#tableTeiAttr tr').each(function (i, row) {
        $('td:nth(0)', $(row)).find("input[type=checkbox]").prop("checked", false);
        //var teiattr = $('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "");
        selectedTeiAttributes = [];
    });
    $('.checkall').prop("checked", false);
}

function teiAttributeCheckboxChecked(ctl) {
    var teiattr = $(ctl).attr("id").replace("chk", "");
    if (ctl.checked) {
        selectedTeiAttributes.push({ teiAttrUid: teiattr, masked: "" });
    } else {
        selectedTeiAttributes = jQuery.grep(selectedTeiAttributes, function (v) {
            return v.teiAttrUid !== teiattr;
        });
    }
    $('.checkall').prop("checked", false);
}

function teiAttributeMaskCheckboxChecked(ctl) {
    var teiattr = $(ctl).attr("id").replace("chk", "").replace("mask", "");
    var ptr = $(ctl).closest('tr');
    if ($('td:nth(0)', $(ptr)).find("input[type=checkbox]").is(':checked') === false) {
        alert('please select the tracked entity attribute first.');
        $(ctl).prop('checked', false);
        return;
    }
    if (ctl.checked) {
        selectedTeiAttributes = jQuery.grep(selectedTeiAttributes, function (v) {
            if (v.teiAttrUid === teiattr) {
                v.masked = "Y";
            }
            return 1 == 1;
        });
    } else {
        selectedTeiAttributes = jQuery.grep(selectedTeiAttributes, function (v) {
            if (v.teiAttrUid === teiattr) {
                v.masked = "";
            }
            return 1 == 1;
        });
    }
}

function selectAllDataElements() {
    var frow = $('#tableDataElement').children('tr:first');
    var programstage = $('td:nth(1)', $(frow)).text();
    var program = $('td:nth(2)', $(frow)).text();
    selectedDataElements = jQuery.grep(selectedDataElements, function (v) {
        return v.programUid + v.programStageUid !== program + programstage;
    });
    $('#tableDataElement tr').each(function (i, row) {
        $('td:nth(0)', $(row)).find("input[type=checkbox]").prop("checked", true);
        var dataelement = $('td:nth(0)', $(row)).find("input[type=checkbox]").attr("id").replace("chk", "");
        selectedDataElements.push({ dataElementUid: dataelement, programStageUid: programstage, programUid: program });
    });
}

function clearAllDataElements(ctl) {
    var ptr = $(ctl).closest('tr');
    $(ptr).find("input[type=checkbox]").prop("checked", false);
    var frow = $('#tableDataElement').children('tr:first');
    var programstage = $('td:nth(1)', $(frow)).text();
    var program = $('td:nth(2)', $(frow)).text();
    selectedDataElements = jQuery.grep(selectedDataElements, function (v) {
        return v.programUid + v.programStageUid !== program + programstage;
    });
    $('#tableDataElement tr').each(function (i, row) {
        $(row).find("input[type=checkbox]").prop("checked", false);
        $(row).css('font-weight', 'normal');
    });
}

function setOrganisationUnitGroups() {
    $('#tableOrgGroup').empty();
    var rowData = '';
    for (var i = 0, len = orgGroupsList.length; i < len; i++) {
        var tmpgroups = $.grep(selectedOrgGroups, function (v) {
            return v.orgGroupUid === orgGroupsList[i].orgGroupUid;
        });
        if (tmpgroups.length > 0) {
            rowData += '<tr style="font-weight:bold;">';
            rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + orgGroupsList[i].orgGroupUid + '" onclick="javascript: orgGroupCheckboxChecked(this);" checked></td>';
        }
        else {
            rowData += '<tr>';
            rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + orgGroupsList[i].orgGroupUid + '" onclick="javascript: orgGroupCheckboxChecked(this);"></td>';
        }
        rowData += '<td align="left" style=" width:90%;" >' + orgGroupsList[i].orgGroupName + '</td>';
        rowData += '</tr>';
    }
    var rowadd = $(rowData);
    $('#tableOrgGroup').append(rowadd);
}

function orgGroupCheckboxChecked(ctl) {
    var ptr = $(ctl).closest('tr');
    var orggroupuid = $(ctl).attr("id").replace("chk", "");
    if (ctl.checked) {
        $(ptr).css('font-weight', 'bold');
        selectedOrgGroups.push(orggroupuid);
    } else {
        selectedOrgGroups.splice($.inArray(orggroupuid, selectedOrgGroups), 1);
        $(ptr).css('font-weight', 'normal');
    }
    $('.checkall').prop("checked", false);
}

function selectAllOrgGroups() {
    selectedOrgGroups = [];
    $('#tableOrgGroup').empty();
    var rowData = '';
    for (var i = 0, len = orgGroupsList.length; i < len; i++) {
        rowData += '<tr>';
        rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + orgGroupsList[i].orgGroupUid + '" onclick="javascript: orgGroupCheckboxChecked(this);" checked></td>';
        rowData += '<td align="left" style=" width:90%;" >' + orgGroupsList[i].orgGroupName + '</td>';
        rowData += '</tr>';
        selectedOrgGroups.push(orgGroupsList[i].orgGroupUid);
    }
    var rowadd = $(rowData);
    $('#tableOrgGroup').append(rowadd);
}

function setUserGroups() {
    $('#tableUserGroup').empty();
    var rowData = '';
    for (var i = 0, len = userGroupsList.length; i < len; i++) {
        var tmpgroups = $.grep(selectedUserGroups, function (ug) {
            return ug === userGroupsList[i].userGroupUid;
        });
        if (tmpgroups.length > 0) {
            rowData += '<tr style="font-weight:bold;">';
            rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + userGroupsList[i].userGroupUid + '" onclick="javascript: userGroupCheckboxChecked(this);" checked></td>';
        }
        else {
            rowData += '<tr>';
            rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + userGroupsList[i].userGroupUid + '" onclick="javascript: userGroupCheckboxChecked(this);"></td>';
        }
        rowData += '<td align="left" style=" width:90%;" >' + userGroupsList[i].userGroupName + '</td>';
        rowData += '</tr>';
    }
    var rowadd = $(rowData);
    $('#tableUserGroup').append(rowadd);
}

function clearAllOrgGroups(ctl) {
    var ptr = $(ctl).closest('tr');
    $(ptr).find("input[type=checkbox]").prop("checked", false);
    selectedOrgGroups = [];
    $('#tableOrgGroup').empty();
    var rowData = '';
    for (var i = 0, len = orgGroupsList.length; i < len; i++) {
        rowData += '<tr>';
        rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + orgGroupsList[i].orgGroupUid + '" onclick="javascript: orgGroupCheckboxChecked(this);"></td>';
        rowData += '<td align="left" style=" width:90%;" >' + orgGroupsList[i].orgGroupName + '</td>';
        rowData += '</tr>';
    }
    var rowadd = $(rowData);
    $('#tableOrgGroup').append(rowadd);
}

function userGroupCheckboxChecked(ctl) {
    var ptr = $(ctl).closest('tr');
    var usrgroupid = $(ctl).attr("id").replace("chk", "");
    if (ctl.checked) {
        $(ptr).css('font-weight', 'bold');
        selectedUserGroups.push(usrgroupid);
    } else {
        selectedUserGroups.splice($.inArray(usrgroupid, selectedUserGroups), 1);
        $(ptr).css('font-weight', 'normal');
    }
    $('.checkall').prop("checked", false);
}

function selectAllUserGroups() {
    selectedUserGroups = [];
    $('#tableUserGroup').empty();
    var rowData = '';
    for (var i = 0, len = userGroupsList.length; i < len; i++) {
        rowData += '<tr>';
        rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + userGroupsList[i].userGroupUid + '" onclick="javascript: userGroupCheckboxChecked(this);" checked></td>';
        rowData += '<td align="left" style=" width:90%;" >' + userGroupsList[i].userGroupName + '</td>';
        rowData += '</tr>';
        selectedUserGroups.push(userGroupsList[i].userGroupUid);
    }
    var rowadd = $(rowData);
    $('#tableUserGroup').append(rowadd);
}

function clearAllUserGroups(ctl) {
    var ptr = $(ctl).closest('tr');
    $(ptr).find("input[type=checkbox]").prop("checked", false);
    selectedUserGroups = [];
    $('#tableUserGroup').empty();
    var rowData = '';
    for (var i = 0, len = userGroupsList.length; i < len; i++) {
        rowData += '<tr>';
        rowData += '<td align="left" style=" width:10%; "> <input type="checkbox" id="chk' + userGroupsList[i].userGroupUid + '" onclick="javascript: userGroupCheckboxChecked(this);"></td>';
        rowData += '<td align="left" style=" width:90%;" >' + userGroupsList[i].userGroupName + '</td>';
        rowData += '</tr>';
    }
    var rowadd = $(rowData);
    $('#tableUserGroup').append(rowadd);
}

function getPivotArray(dataArray, rowIndex, colIndex, dataIndex, columnHeader) {
    var result = {},
        ret = [];
    var newCols = [];
    for (var i = 0, len = dataArray.length; i < len; i++) {
        if (!result[dataArray[i][rowIndex]]) {
            result[dataArray[i][rowIndex]] = {};
        }
        result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];
        //To get column names
        if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
            newCols.push(dataArray[i][colIndex]);
            finalDeList.push(dataArray[i][colIndex]);
        }
    }
    newCols.sort();
    var item = [];
    //Add Header Row
    item.push(columnHeader);
    item.push.apply(item, newCols);
    ret.push(item);
    //Add content 
    for (var key in result) {
        item = [];
        item.push(key);
        for (var i = 0, len1 = newCols.length; i < len1; i++) {
            item.push(result[key][newCols[i]] || "");
        }
        ret.push(item);
    }
    return ret;
}
function stringToHex(val) {
    for (var e = val, a = "", t = 0; t < e.length; t++) {
        a += "" + e.charCodeAt(t).toString(16);
    }
    return a;
}
function hexToString(val) {
    for (var e = val, a = "", t = 0; t < e.length; t += 2) {
        a += String.fromCharCode(parseInt(e.substr(t, 2), 16));
    }
    return a;
}
function arrayToCSV(twoDiArray) {
    var csvRows = [];
    for (var i = 0; i < twoDiArray.length; ++i) {
        for (var j = 0; j < twoDiArray[i].length; ++j) {
            twoDiArray[i][j] = '"' + twoDiArray[i][j] + '"'; // Handle elements that contain commas
        }
        csvRows.push(twoDiArray[i].join(','));
    }
    var csvString = csvRows.join('\r\n');
    var exportedFilenmae = 'ProgramData' + getDateNow().replace(/\//g, '') + '.csv';
    var blob = new Blob([csvString], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
function arrayToJson(arr) {
    var keys = arr[0];
    var temparr = arr.slice(1, arr.length);
    var jsonObj = [],
        data = temparr,
        cols = keys,
        len = cols.length;
    for (var i = 0; i < data.length; i++) {
        var val = data[i],
            obj = {};
        for (var j = 0; j < len; j++) {
            obj[cols[j]] = val[j];
        }
        jsonObj.push(obj);
    }
    var jsonString = JSON.stringify(jsonObj);
    var exportedFilenmae = 'ProgramData' + getDateNow().replace(/\//g, '') + '.json';
    var blob = new Blob([jsonString], {
        type: 'text/json;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}