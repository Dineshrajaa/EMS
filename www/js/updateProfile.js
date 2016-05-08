var isValid = true;

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        allowEdit: true,
        correctOrientation: true //Corrects Android orientation quirks
    }
    return options;
}

function openCameraOrGallery(sourceType) {
    // To open gallery or camera
    /*  var cameraOptions={
    sourceType: sourceType,
    allowEdit: true,
    destinationType:Camera.DestinationType.DATA_URL
    };*/
    if (sourceType == "Camera.PictureSourceType.CAMERA")
        sourceType = Camera.PictureSourceType.CAMERA;
    else if (sourceType == "Camera.PictureSourceType.PHOTOLIBRARY")
        sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
    var cameraOptions = setOptions(sourceType);
    console.warn("sourceType:" + sourceType + "cameraOptions:" + JSON.stringify(cameraOptions));
    navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
}

function cameraSuccess(imageData) {
    $("#profilePicImg").attr("src", "data:image/jpeg;base64," + imageData);
    updateProfilePicture(); // now send the picture to sevice    
}

function updateProfilePicture() {
    // To update profile picture of the user
    var url = serviceUrl + "Account/UpdateProfilePicture";
    var jsonObj = {};
    jsonObj.userId = $("#hdnUserId").val();
    jsonObj.pic = $("#profilePicImg").attr("src");
    showWait();
    $.ajax({
        type: "POST",
        url: url,
        data: jsonObj,
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function(result) {
            hideWait();
            toast("Profile Picture updated Successfully");
        },
        error: function(error) {
            hideWait();
        }
    });
}

function cameraError(err) {
    console.log("Camera error:" + err);
}

function validate() {
    isValid = true;
    $(".required").each(function() {
        var current = $(this);
        if (current.val() == "" && current.is(":visible")) {
            $(current).addClass("error");
            isValid = false;
        } else {
            $(current).removeClass("error");
        }
    });
    if (isValid) {
        UpdateUser();

    } else {
        return false;
    }
    //validatePassword($("#txtPin"));
    //validateConfirmPassword($("#txtCPin"));
}

function redirectWithTimeout(url) {
    setTimeout(function() {
        window.location.href = url;
    }, 5000);
}

// google address

var options = {
    types: ['geocode'],
    componentRestrictions: { country: "au" }
};
var placeSearch, autocomplete;
var componentForm = {
    street_number: 'long_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    //country: 'long_name',
    postal_code: 'long_name'
};

var input = document.getElementById("keyword");
var autocomplete = new google.maps.places.Autocomplete(input, options);
autocomplete.addListener('place_changed', fillInAddress);

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    for (var component in componentForm) {
        if (component == "route") continue;
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            if (addressType == 'route') {
                var val = place.address_components[i][componentForm[addressType]];
                document.getElementById('street_number').value += " " + val;
                document.getElementById('street_number').value = document.getElementById('street_number').value.trim();
                continue;
            }
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}



var trannieProfileObj = '';
var currentUser = '';
$(document).on("ready", function() {
    var currentUserObj = localStorage.getItem('userSession');
    if (currentUserObj && currentUserObj != 'undefined') {
        currentUser = JSON.parse(currentUserObj);
        fetchProfileDetail(currentUser.ID);
        GetEmployeeDetails(currentUser.ID);
    }

    getActiveLicenceType(0);
    getActiveTradeExp(0);
    getActivePositionHeld(0);

    $(document).on("change", "#ddlLicence", function() {
        var val = $(this).val();
        getLicenceTypDetail(val);
    });


    $(document).on("change", "#ddlTradeExp", function() {
        var val = $(this).val();
        getTradeExpDetail(val);
    });

    $(document).on("change", "#ddlPositionHeld", function() {
        var val = $(this).val();
        getPositionHeldDetail(val);
    });

    //    $(document).on("click", "#expTrade", function () {
    //        $("#dvTrade .exp").show();
    //        $("#dvTrade .num").hide();

    //    });
    //    $(document).on("click", "#qualTrade", function () {
    //        $("#dvTrade .exp").show();
    //        $("#dvTrade .num").show();
    //    });


    //    $(document).on("click", "#expLicence", function () {
    //        $("#dvLicence .exp").show();
    //        $("#dvLicence .num").hide();
    //    });
    //    $(document).on("click", "#qualLicence", function () {
    //        $("#dvLicence .exp").show();
    //        $("#dvLicence .num").show();
    //    });

    //    $(document).on("click", "#expPosition", function () {
    //        $("#dvPosition .exp").show();
    //        $("#dvPosition .num").hide();
    //    });
    //    $(document).on("click", "#qualPosition", function () {
    //        $("#dvPosition .exp").show();
    //        $("#dvPosition .num").show();
    //    });

    $(document).on("click", "#btnAddLicence", function() {
        $("#txtExperience").val("");
        $("#txtNumberlLicence").val("");
        //$("#ddlLicence option[value='0']").attr("selected", "selected");
        $.mobile.pageContainer.pagecontainer("change", "#addeditLicence", { transition: "slide" });
    });
    $(document).on("click", "#btnAddTrade", function() {
        $("#txtExpTrade").val("");
        $("#txtQualTrade").val("");
        $.mobile.pageContainer.pagecontainer("change", "#addeditTrade", { transition: "slide" });
    });
    $(document).on("click", "#btnAddPosition", function() {
        $("#txtExpPosition").val("");
        $("#txtQualPosition").val("");
        $.mobile.pageContainer.pagecontainer("change", "#addeditPosition", { transition: "slide" });
    });

    $(document).on("click", "#dvLicence .ui-radio", function() {
        $("#dvLicence .exp").show();
        $("#txtExperience").val("");
        $("#txtNumberlLicence").val("");
        if ($(this).children("input[name=LicencePosition]").val() === "2") {
            $("#dvLicence .num").show();
        } else {
            $("#dvLicence .num").hide();
        }
    });

    $(document).on("click", "#dvTrade .ui-radio", function() {
        $("#dvTrade .exp").show();
        $("#txtExpTrade").val("");
        $("#txtQualTrade").val("");
        if ($(this).children("input[name=TradeExpPosition]").val() === "2") {
            $("#dvTrade .num").show();
        } else {
            $("#dvTrade .num").hide();
        }
    });

    $(document).on("click", "#dvPosition .ui-radio", function() {
        $("#dvPosition .exp").show();
        $("#txtExpPosition").val("");
        $("#txtQualPosition").val("");
        if ($(this).children("input[name=CertifiedTypePosition]").val() === "2") {
            $("#dvPosition .num").show();
        } else {
            $("#dvPosition .num").hide();
        }
    });
});

function fetchProfileDetail(userId) {
    showWait();
    var url = serviceUrl + "Account/GetUserById";
    var jsonObj = {};
    jsonObj.userId = userId;
    $.ajax({
        type: "GET",
        url: url,
        data: jsonObj,
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function(result) {
            if (result && result.IsSuccessful) {
                var employeeObj = result.Result;
                $("#hdnUserId").val(employeeObj.ID);
                $("#hdnRoleId").val(employeeObj.RoleId);
                var titleId = 1;
                switch (employeeObj.Title) {
                    case "Mr":
                        titleId = 1;
                        break;
                    case "Mrs":
                        titleId = 2;
                        break;
                    case "Miss":
                        titleId = 3;
                        break;
                    case "Ms":
                        titleId = 4;
                        break;
                    default:
                        titleId = 1;
                        break;
                }
                $("#ddlTitle").val(titleId);
                $("#ddlTitle").prev().text(employeeObj.Title);
                $("#txtFirstName").val(employeeObj.FirstName);
                $("#lblName").html(employeeObj.Title + " " + employeeObj.FirstName + "  " + employeeObj.LastName);

                $("#txtMiddleName").val(employeeObj.MiddleName);
                $("#txtLastName").val(employeeObj.LastName);
                $("#txtDob").val(new Date(employeeObj.DateOfBirth).getFormattedDateInddMMYY());
                $("#lblDob").html(new Date(employeeObj.DateOfBirth).getFormattedDateInddMMYY());
                if (employeeObj.IsPaySlipSent)
                    $("#lblElePayslips").text("Yes");
                else
                    $("#lblElePayslips").text("No");


                $("#ddlGender").val(employeeObj.GenderId);
                var gender = "Male";
                switch (employeeObj.GenderId) {
                    case 1:
                        gender = "Not Specified";
                        break;
                    case 2:
                        gender = "Male";
                        break;
                    case 3:
                        gender = "Female";
                        break;
                    default:
                        gender = "Male";
                        break;
                }
                $("#ddlGender").prev().text(gender);
                $("#lblGender").html(gender);
                $("#street_number").val(employeeObj.StreetAddress);
                $("#locality").val(employeeObj.City);
                $("#lblAddr").html(employeeObj.StreetAddress);
                $("#lbllocality").html(employeeObj.City);
                $("#postal_code").val(employeeObj.Postcode);
                $("#lblpostal_code").html(employeeObj.Postcode);
                $("#lbladministrative_area_level_1").html(employeeObj.State);
                $("#administrative_area_level_1").val(employeeObj.State);
                $("#lblEmail").text(employeeObj.Email);
                $("#lblContact1").html(employeeObj.ContactNumber);
                $("#lblContact2").html(employeeObj.SecondaryContact);
                $("#txtContact1").val(employeeObj.ContactNumber);
                $("#txtContact2").val(employeeObj.SecondaryContact);
                if (employeeObj.IsPaySlipSent) {
                    $("#chkPaySlipMail").attr("checked", true).checkboxradio("refresh");
                }

            } else {
                toast("Network Error");
            }

            hideWait();
        },
        error: function(result) {
            hideWait();
            toast('Network Error');
        }
    });
}

function doEdit() {
    /*
        $(".editProfile").show();

        $(".viewProfile").hide();*/
    navigatePage("#editProfilePage");
}

function doUpdate() {
    showWait();

    //updateProfile(trannieProfileObj);
}

function UpdateUser() {
    var id = $("#hdnUserId").val();
    var titleId = $("#ddlTitle").val();
    var title = "Mr";
    switch (titleId) {
        case "1":
            title = "Mr";
            break;
        case "2":
            title = "Mrs";
            break;
        case "3":
            title = "Miss";
            break;
        case "4":
            title = "Ms";
            break;
        default:
            break;
    }
    var firstName = $("#txtFirstName").val();
    var middleName = $("#txtMiddleName").val();
    var lastName = $("#txtLastName").val();
    var dob = $("#txtDob").val();
    var streetAddress = $("#street_number").val();
    var city = $("#locality").val();
    var postCode = $("#postal_code").val();
    var primaryContact = $("#txtContact1").val();
    var secondaryContact = $("#txtContact2").val();
    var gender = $("#ddlGender").val();
    var state = $("#administrative_area_level_1").val();
    var isPayslip = $("#chkPaySlipMail").is(":checked") ? true : false;
    var roleId = $("#hdnRoleId").val();

    var trannieProfileObj = {};
    trannieProfileObj.ID = id;
    trannieProfileObj.Title = title;
    trannieProfileObj.FirstName = firstName;
    trannieProfileObj.MiddleName = middleName;
    trannieProfileObj.LastName = lastName;
    trannieProfileObj.DateOfBirth = dob;
    trannieProfileObj.StreetAddress = streetAddress;
    trannieProfileObj.City = city;
    trannieProfileObj.State = state;
    trannieProfileObj.Postcode = postCode;
    trannieProfileObj.ContactNumber = primaryContact;
    trannieProfileObj.SecondaryContact = secondaryContact;
    trannieProfileObj.IsPaySlipSent = isPayslip;
    trannieProfileObj.GenderId = gender;
    trannieProfileObj.roleId = roleId;

    updateProfile(trannieProfileObj);
}

function updateProfile(trannieProfileObj) {
    showWait();
    var url1 = serviceUrl + "Account/UpdateUser";
    $.ajax({
        type: 'POST',
        url: url1,
        data: trannieProfileObj,
        success: function(response) {
            hideWait();

            var currentUserObj = localStorage.getItem('userSession');

            var currentUser = JSON.parse(currentUserObj);
            trannieProfileObj.JobStatusType = currentUser.JobStatusType;
            var data = JSON.stringify(trannieProfileObj);
            localStorage.setItem('userSession', data);
            toast('Profile Update Sucessfully');

            redirectWithTimeout("UpdateProfile.html");
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

$(function() {
    var demo = "date";
    var theme = "android-holo-light";
    var mode = "scroller";
    var display = "bubble";
    var lang = "en";
    $('#txtDob').mobiscroll().date({
        theme: theme,
        mode: mode,
        display: display,
        lang: lang,
        dateOrder: 'ddmmyyyy',
        dateFormat: 'dd/mm/yyyy'
    });
});

function prev() {

    $.mobile.pageContainer.pagecontainer("change", "#updateProfile", { transition: "slide" });


    // $("#updateProfile_part2").hide();
    //$("#updateProfile").show();
}

function next() {
    $.mobile.pageContainer.pagecontainer("change", "#updateProfile_part2", { transition: "slide" });
    //$("#updateProfile_part2").show();
    //$("#updateProfile").hide();
}

function getActiveLicenceType(id) {
    showWait();
    var url = serviceUrl + "Account/GetActiveLicenceTicketTypes";
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                $("#ddlLicence").html("");
                var options = '<option value="0">--select--</option>';
                var result = response.Result;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].ID === id) {
                        options += '<option value=' + result[i].ID + ' selected="selected">' + result[i].Name + '</option>';
                        $("#ddlLicence").prev().text(result[i].Name);
                    } else {
                        options += '<option value=' + result[i].ID + '>' + result[i].Name + '</option>';
                    }
                }
                $("#ddlLicence").append(options);
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

function getLicenceTypDetail(id) {
    showWait();
    var obj = {};
    obj.id = parseInt(id);
    //obj = JSON.stringify(obj);
    var url = serviceUrl + "Account/GetLicenceTicketTypeById";
    $.ajax({
        type: 'GET',
        url: url,
        data: obj,
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                var result = response.Result;
                $("#dvLicence").show();
                if (result.IsQualifiedAllowed) {
                    $("#dvLicence .exp").show();
                    $("#dvLicence .num").show();
                    $("#dvLicence .container").hide();
                } else {
                    $("#dvLicence .container").show();
                    $("#dvLicence .exp").hide();
                    $("#dvLicence .num").hide();
                }


            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

function getActiveTradeExp(id) {
    showWait();
    var url = serviceUrl + "Account/GetActiveTradeExperiences";
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                $("#ddlTradeExp").html("");
                var options = '<option value="0">--select--</option>';
                var result = response.Result;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].ID === id) {
                        options += '<option value=' + result[i].ID + ' selected="selected">' + result[i].Name + '</option>';
                        $("#ddlTradeExp").prev().text(result[i].Name);
                    } else {
                        options += '<option value=' + result[i].ID + '>' + result[i].Name + '</option>';
                    }
                }
                $("#ddlTradeExp").append(options);
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

function getTradeExpDetail(id) {
    showWait();
    var obj = {};
    obj.id = parseInt(id);;
    //obj = JSON.stringify(obj);
    var url = serviceUrl + "Account/GetTradeExperienceById";
    $.ajax({
        type: 'GET',
        url: url,
        data: obj,
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                var result = response.Result;
                $("#dvTrade").show();
                if (result.IsQualifiedAllowed) {
                    $("#dvTrade .exp").show();
                    $("#dvTrade .num").show();
                    $("#dvTrade .container").hide();
                } else {
                    $("#dvTrade .container").show();
                    $("#dvTrade .exp").hide();
                    $("#dvTrade .num").hide();
                }
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

function getActivePositionHeld(id) {
    showWait();
    var url = serviceUrl + "Account/GetActivePositionHelds";
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                $("#ddlPositionHeld").html("");
                var options = '<option value="0">--select--</option>';
                var result = response.Result;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].ID === id) {
                        options += '<option value=' + result[i].ID + ' selected="selected">' + result[i].Name + '</option>';
                        $("#ddlPositionHeld").prev().text(result[i].Name);
                    } else {
                        options += '<option value=' + result[i].ID + '>' + result[i].Name + '</option>';
                    }
                }
                $("#ddlPositionHeld").append(options);
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

function getPositionHeldDetail(id) {
    showWait();
    var obj = {};
    obj.id = parseInt(id);;
    //obj = JSON.stringify(obj);
    var url = serviceUrl + "Account/GetPositionHeldById";
    $.ajax({
        type: 'GET',
        url: url,
        data: obj,
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                var result = response.Result;
                $("#dvPosition").show();
                if (result.IsQualifiedAllowed) {
                    $("#dvPosition .exp").show();
                    $("#dvPosition .num").show();
                    $("#dvPosition .container").hide();
                } else {
                    $("#dvPosition .container").show();
                    $("#dvPosition .exp").hide();
                    $("#dvPosition .num").hide();
                }
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

function GetEmployeeDetails(id) {
    showWait();
    var obj = {};
    obj.id = parseInt(id);
    var url = serviceUrl + "Account/GetEmployeeDetails";
    $.ajax({
        type: 'GET',
        url: url,
        data: obj,
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                var result = response.Result;
                var positionheldslist = result.PositionHeldList;
                var tradeExpList = result.TradeExpList;
                var licencelist = result.LicenceTicketTypeList;
                var licenceHtml = '';
                var positionHtml = '';
                var tradeHtml = '';
                if (result.PositionHeldList != null) {
                    for (var i = 0; i < result.PositionHeldList.length; i++) {
                        var Exp = (result.PositionHeldList[i].Experience != null && result.PositionHeldList[i].Experience != "null") ? result.PositionHeldList[i].Experience : "";
                        var qualNo = (result.PositionHeldList[i].QualificationNumber != null && result.PositionHeldList[i].QualificationNumber != "null") ? result.PositionHeldList[i].QualificationNumber : "";
                        positionHtml += '<tr><td>' + result.PositionHeldList[i].Name + '</td><td>' + Exp + '</td><td>' + qualNo + '</td>' +
                            //'<td>' + positionheldslist[i].UserCertificationTypeId + '</td>' +
                            '<td><a onclick="editPosition(' + result.PositionHeldList[i].Id + ')">Edit</a></td>' +
                            '<td><a onclick="deletePosition(' + result.PositionHeldList[i].Id + ',this)">Delete</a></td>' +
                            '</tr>';

                    }
                }
                if (tradeExpList != null) {
                    for (var j = 0; j < tradeExpList.length; j++) {
                        var exp = (tradeExpList[j].Experience != null && tradeExpList[j].Experience != "null") ? tradeExpList[j].Experience : "";
                        var no = (tradeExpList[j].QualificationNumber != null && tradeExpList[j].QualificationNumber != "") ? tradeExpList[j].QualificationNumber : "";
                        tradeHtml += '<tr>' +
                            '<td>' + tradeExpList[j].Name + '</td>' +
                            '<td>' + exp + '</td>' +
                            '<td>' + no + '</td>' +
                            //'<td>' + tradeExpList[j].UserCertificationTypeId + '</td>' +
                            '<td><a onclick="editTrade(' + tradeExpList[j].Id + ')">Edit</a></td>' +
                            '<td><a onclick="deleteTrade(' + tradeExpList[j].Id + ',this)">Delete</a></td>' +
                            '</tr>';

                    }
                }
                if (licencelist != null) {
                    for (var k = 0; k < licencelist.length; k++) {
                        var exp = (licencelist[k].Experience != null && licencelist[k].Experience != "") ? licencelist[k].Experience : "";
                        var no = (licencelist[k].LicenceNumber != null && licencelist[k].LicenceNumber != "") ? licencelist[k].LicenceNumber : "";
                        licenceHtml += '<tr>' +
                            '<td>' + licencelist[k].Name + '</td>' +
                            '<td>' + exp + '</td>' +
                            '<td>' + no + '</td>' +
                            //'<td>' + licencelist[k].LicenceExpiry + '</td>' +
                            // '<td>' + licencelist[k].UserCertificationTypeId + '</td>' +
                            '<td><a onclick="editLicence(' + licencelist[k].Id + ')">Edit</a></td>' +
                            '<td><a onclick="deleteLicence(' + licencelist[k].Id + ',this)">Delete</a></td>' +
                            '</tr>';
                    }
                }

                $("#tblLicenceList tbody").html(licenceHtml);
                $("#tblTradeExpList tbody").html(tradeHtml);
                $("#tblPositionList tbody").html(positionHtml);


            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}


function deletePosition(id, el) {
    var r = confirm('Are you sure');
    if (r) {
        showWait();
        var obj = {};
        obj.id = parseInt(id);
        var url = serviceUrl + "Account/DeleteUserPositionHeld/";
        $.ajax({
            type: 'POST',
            url: url + id,
            data: {},
            success: function(response) {
                hideWait();
                if (response.IsSuccessful) {

                    toast('Position Deleted Successfully');
                    $(el).parent().parent().remove();
                }
            },
            error: function() {
                hideWait();
                toast('Network Error');
            }
        });
    }
}


function deleteLicence(id, el) {
    var r = confirm('Are you sure');
    if (r) {
        showWait();
        var obj = {};
        obj.id = parseInt(id);
        var url = serviceUrl + "Account/DeleteUserLicenceTicketType/";
        $.ajax({
            type: 'POST',
            url: url + id,
            data: {},
            success: function(response) {
                hideWait();
                if (response.IsSuccessful) {

                    toast('Licence Ticket Type Deleted Successfully');
                    $(el).parent().parent().remove();
                }
            },
            error: function() {
                hideWait();
                toast('Network Error');
            }
        });
    }
}

function deleteTrade(id, el) {
    var r = confirm('Are you sure');
    if (r) {
        showWait();
        var obj = {};
        obj.id = parseInt(id);
        var url = serviceUrl + "Account/DeleteUserTradeExp/";
        $.ajax({
            type: "POST",
            url: url + id,
            data: {},
            success: function(response) {
                hideWait();
                if (response.IsSuccessful) {

                    toast('Trade Exp Deleted Successfully');
                    $(el).parent().parent().remove();
                }
            },
            error: function() {
                hideWait();
                toast('Network Error');
            }
        });
    }
}


function SaveLicence() {
    var obj = {};
    obj.Id = $("#hdnLicenceTypeId").val();
    obj.LicenceTicketTypeId = $("#ddlLicence").val();
    obj.UserId = currentUser.ID;
    obj.Experience = $("#txtExperience").val();
    obj.LicenceNumber = $("#txtNumberlLicence").val();
    obj.LicenceExpiry = "";
    obj.UserCertificationTypeId = $("input[name=LicencePosition]:checked").val(); //radio button value;
    //obj = JSON.stringify(obj);
    AddUserLicenceTicketType(obj);
}

function SaveTrade() {
    var obj = {};
    obj.Id = $("#hdnTradeId").val();
    obj.TradeExperienceId = $("#ddlTradeExp").val();
    obj.UserId = currentUser.ID;
    obj.Experience = $("#txtExpTrade").val();
    obj.QualificationNumber = $("#txtQualTrade").val();
    obj.UserCertificationTypeId = $("input[name=TradeExpPosition]:checked").val(); //radio button value;
    //obj = JSON.stringify(obj);
    AddUserTradeExp(obj);
}

function SavePosition() {
    var obj = {};
    obj.Id = $("#hdnPositionId").val();
    obj.PositionHeldId = $("#ddlPositionHeld").val();
    obj.UserId = currentUser.ID;
    obj.Experience = $("#txtExpPosition").val();
    obj.QualificationNumber = $("#txtQualPosition").val();
    obj.UserCertificationTypeId = $("input[name=CertifiedTypePosition]:checked").val(); //radio button value;
    //obj = JSON.stringify(obj);
    AddUserPositionHeld(obj);
}


function AddUserPositionHeld(obj) {
    showWait();
    var url = serviceUrl + "Account/AddUserPositionHeld";
    $.ajax({
        type: 'POST',
        url: url,
        data: obj,
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {

                toast('Position Added Successfully');
                redirectWithTimeout("UpdateProfile.html");
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });

}

function AddUserTradeExp(obj) {
    showWait();
    var url = serviceUrl + "Account/AddUserTradeExp";
    $.ajax({
        type: 'POST',
        url: url,
        data: obj,
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {

                toast('Trade Added Successfully');
                redirectWithTimeout("UpdateProfile.html");
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });

}

function AddUserLicenceTicketType(obj) {
    showWait();
    var url = serviceUrl + "Account/AddUserLicenceTicketType";
    $.ajax({
        type: 'POST',
        url: url,
        data: obj,
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {

                toast('Licence Added Successfully');
                redirectWithTimeout("UpdateProfile.html");

            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });

}

function editLicence(id) {
    showWait();
    var url = serviceUrl + "Account/GetUserLicenceTicketType/";
    $.ajax({
        type: 'GET',
        url: url + id,
        data: {},
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                $.mobile.pageContainer.pagecontainer("change", "#addeditLicence", { transition: "slide" });
                $("#hdnLicenceTypeId").val(response.Result.Id);
                getActiveLicenceType(response.Result.LicenceTicketTypeId);
                //getLicenceTypDetail(response.Result.LicenceTicketTypeId);
                $("#ddlLicence").val(response.Result.LicenceTicketTypeId);
                $("#txtExperience").val(response.Result.Experience);
                $("#txtNumberlLicence").val(response.Result.LicenceNumber);
                $("#dvLicence").show();
                $("#dvLicence .container").show();
                $("#dvLicence .exp").show();
                if (response.Result.UserCertificationTypeId === 1) {
                    $("#expLicence").attr("checked", true);
                    $("#expLicence").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                    $("#dvLicence .num").hide();
                } else {
                    if (response.Result.UserCertificationTypeId === 2) {
                        $("#qualLicence").attr("checked", true);
                        $("#qualLicence").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                        $("#dvLicence .num").show();
                    } else {
                        $("#dvLicence .container").hide();
                        $("#dvLicence .num").show();
                    }
                }
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

function editPosition(id) {
    showWait();
    var url = serviceUrl + "Account/GetUserPositionHeld/";
    $.ajax({
        type: 'GET',
        url: url + id,
        data: {},
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                $.mobile.pageContainer.pagecontainer("change", "#addeditPosition", { transition: "slide" });
                $("#hdnPositionId").val(response.Result.Id);
                getActivePositionHeld(response.Result.PositionHeldId);
                //getPositionHeldDetail(response.Result.PositionHeldId);
                $("#ddlPositionHeld").val(response.Result.PositionHeldId);
                $("#txtExpPosition").val(response.Result.Experience);
                $("#txtQualPosition").val(response.Result.QualificationNumber);
                $("#dvPosition").show();
                $("#dvPosition .container").show();
                $("#dvPosition .exp").show();
                if (response.Result.UserCertificationTypeId === 1) {
                    $("#expPosition").attr("checked", true);
                    $("#expPosition").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                    $("#dvPosition .num").hide();
                } else {
                    if (response.Result.UserCertificationTypeId === 2) {
                        $("#qualPosition").attr("checked", true);
                        $("#qualPosition").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                        $("#dvPosition .num").show();
                    } else {
                        $("#dvPosition .container").hide();
                        $("#dvPosition .num").show();
                    }
                }

            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}

function editTrade(id) {
    showWait();
    var url = serviceUrl + "Account/GetUserTradeExp/";
    $.ajax({
        type: 'GET',
        url: url + id,
        data: {},
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                $.mobile.pageContainer.pagecontainer("change", "#addeditTrade", { transition: "slide" });
                $("#hdnTradeId").val(response.Result.Id);
                getActiveTradeExp(response.Result.TradeExperienceId);
                getTradeExpDetail(response.Result.TradeExperienceId);
                $("#ddlTradeExp").val(response.Result.TradeExperienceId);
                $("#txtExpTrade").val(response.Result.Experience);
                $("#txtQualTrade").val(response.Result.QualificationNumber);
                $("#dvTrade").show();
                $("#dvTrade .container").show();
                $("#dvTrade .exp").show();
                if (response.Result.UserCertificationTypeId === 1) {
                    $("#expTrade").attr("checked", true);
                    $("#expTrade").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                    $("#dvTrade .num").hide();

                } else {
                    if (response.Result.UserCertificationTypeId === 2) {
                        $("#qualTrade").attr("checked", true);
                        $("#qualTrade").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                        $("#dvTrade .num").show();
                    } else {
                        $("#dvTrade .container").hide();
                        $("#dvTrade .num").show();
                    }
                }
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}
