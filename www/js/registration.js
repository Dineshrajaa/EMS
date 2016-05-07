﻿// google address

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
var jsonObj = {};
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

var isValid = true;
var positionHoldList = [];
var licenceTicketList = [];
var tradeExpList = [];
var licenceId = 1;
var positionId = 1;
var tradeExpId = 1;

function validate() {
    isValid = true;
    $(".required").each(function() {
        var current = $(this);
        if (current.val() == "") {
            $(current).addClass("error");
            isValid = false;
        } else {
            $(current).removeClass("error");
        }
    });
    if (isValid) {
        RegisterUser();

    } else {
        return false;
    }
    //validatePassword($("#txtPin"));
    //validateConfirmPassword($("#txtCPin"));
}

function validateRegisterFields(fieldClass, nextpageId) {
    // To validate the fields in register page
    isValid = true;
    $("." + fieldClass).each(function() {
        var current = $(this);
        if (current.val() == "") {
            $(current).addClass("error");
            isValid = false;
        } else {
            $(current).removeClass("error");
        }
    });
    if (isValid) {

        if (nextpageId !== "lastpage")
            RegisterUser(nextpageId);
        //navigatePage(nextpageId);

    } else {
        return false;
    }
}

function validateEmail(element) {
    if ($(element).val().length > 0) {
        var emailvalid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ($(element).val().match(emailvalid)) {
            $(element).removeClass("error");
            $("#spnError").html("");
            return true;
        } else {
            $(element).addClass("error");
            // $("#spnError").html("Please enter proper Email");
            $(element).focus();
            return false;
        }
    } else {
        $(element).addClass("error");
        //$("#spnError").html("Please enter Email");
        return false;
    }
}

function validatePassword(el) {
    if ($(el).val().length > 0) {
        if ($(el).val().length < 4) {
            $(el).addClass("error");
            $("#spnError").html("Pin length should be equal to 4");
            $(el).focus();
            return false;
        } else {
            $(el).removeClass("error");
            $("#spnError").html("");
            return true;
        }
    } else {
        $(el).addClass("error");
        $("#spnError").html("Please enter Pin");
        return false;
    }
}

function validateConfirmPassword(el) {
    if ($(el).val().length > 0) {
        if ($(el).val().trim() != $("#txtPin").val().trim()) {
            $(el).addClass("error");
            $("#spnError").html("Pin and confirm pin does not match");
            return false;
        } else {
            $(el).removeClass("error");
            $("#spnError").html("");
            return true;
        }
    } else {
        $(el).addClass("error");
        $("#spnError").html("Please enter confirm Pin");
        return false;
    }
}



function checkEmailExistance(nextpageId) {
    var url = serviceUrl + "Account/IsUserWithSameEmailExist";
    var jsonObj = {};
    jsonObj.email = $("#txtEmail").val().trim();
    $.ajax({
        type: "GET",
        url: url,
        data: jsonObj,
        async: false,
        success: function(result) {
            if (result.IsSuccessful) {
                if (result.Result) {
                    toast('Email already registered');
                } else {
                    register(nextpageId);
                }

            } else {
                toast('Network Error');
            }
        },
        error: function() {
            toast('Network Error');
        }
    });
}

function register(nextpageId) {


    var url = serviceUrl + "Account/AddUser";
    var titleId = $("#ddlTitle").val();
    var firstName = $("#txtFirstName").val();
    var middleName = $("#txtMiddleName").val();
    var lastName = $("#txtLastName").val();
    var dob = $("#txtDob").val();
    var email = $("#txtEmail").val();
    var streetAddress = $("#street_number").val();
    var city = $("#locality").val();
    var postCode = $("#postal_code").val();
    var primaryContact = $("#txtContact1").val();
    var secondaryContact = $("#txtContact2").val();
    var gender = $("#ddlGender").val();
    var pin = $("#txtPin").val();
    var state = $("#administrative_area_level_1").val();
    var isPayslip = $("#chkPaySlipMail").is(":checked") ? true : false;
    var profilePicture = $("#profilePicImg").attr("src");

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
    jsonObj.Title = title;
    jsonObj.FirstName = firstName;
    jsonObj.MiddleName = middleName;
    jsonObj.LastName = lastName;
    jsonObj.DateOfBirth = dob;
    jsonObj.Email = email;
    jsonObj.StreetAddress = streetAddress;
    jsonObj.City = city;
    jsonObj.State = state;
    jsonObj.Postcode = postCode;
    jsonObj.ContactNumber = primaryContact;
    jsonObj.SecondaryContact = secondaryContact;
    jsonObj.IsPaySlipSent = isPayslip;
    jsonObj.GenderId = gender;
    jsonObj.Password = pin;
    jsonObj.UserLicenceTicketTypes = licenceTicketList;
    jsonObj.UserTradeExperiences = tradeExpList;
    jsonObj.UserPositionHelds = positionHoldList;
    jsonObj.ProfilePicture = profilePicture == "img/avtar.png" ? "" : profilePicture;
    debugger;
    navigatePage(nextpageId);
    /*    $.ajax({
            type: "POST",
            url: url,
            data: jsonObj,
            success: function(result) {
                if (result.IsSuccessful) {
                    alert("Registration has successfully done");
                    // window.location.href = "index.html";
                } else {
                    toast("Network Error");
                }
            },
            error: function() {
                console.log('Some error occured in registration, please try again');
            }
        });*/
}

function submitProfile() {
    // To submit the profile completely
    jsonObj.UserLicenceTicketTypes = licenceTicketList;
    jsonObj.UserTradeExperiences = tradeExpList;
    jsonObj.UserPositionHelds = positionHoldList;
    jsonObj.ProfilePicture = profilePicture == "img/avtar.png" ? "" : profilePicture;
    $.ajax({
        type: "POST",
        url: url,
        data: jsonObj,
        success: function(result) {
            if (result.IsSuccessful) {
                alert("Registration has been successfully done");
                // window.location.href = "index.html";
            } else {
                toast("Network Error");
            }
        },
        error: function() {
            console.log('Some error occured in registration, please try again');
        }
    });
}

function RegisterUser(nextpageId) {

    $(".required").each(function() {
        var cur = this;
        if ($(cur).hasClass("error")) {
            return false;
        }

    });
    checkEmailExistance(nextpageId);
    //    if ($("#form_RegisterUser").valid()) {
    //        checkEmailExistance();
    //    }
    //    else {
    //        return false;
    //    }
}
$(function() {
    var demo = "date";
    var theme = "android-holo-light";
    var mode = "scroller";
    var display = "bubble";
    var lang = "en";
    $('#txtDob,#txtLicenceExpiry').mobiscroll().date({
        theme: theme,
        mode: mode,
        display: display,
        lang: lang,
        dateOrder: 'ddmmyyyy',
        dateFormat: 'dd/mm/yyyy'
    });
});

$(document).on("ready", function() {
    
    $(".required").on("change", function() {
        var cur = this;
        $(cur).removeClass("error");
    });

    $(document).on("click", "#btnAddLicence", function() {
        $("#txtExperience").val("");
        $("#txtNumberlLicence").val("");
        $("#hdnLicenceTypeId").val(licenceId++);
        getActiveLicenceType(0);
        $("#expLicence").attr("checked", false);
        $("#expLicence").prev().removeClass("ui-radio-on").addClass("ui-radio-off");
        $("#qualLicence").attr("checked", false);
        $("#qualLicence").prev().removeClass("ui-radio-on").addClass("ui-radio-off");
        $.mobile.pageContainer.pagecontainer("change", "#addeditLicence", { transition: "slide" });
    });
    $(document).on("click", "#btnAddTrade", function() {
        $("#txtExpTrade").val("");
        $("#txtQualTrade").val("");
        $("#hdnTradeId").val(tradeExpId++);
        getActiveTradeExp(0);
        $("#expTrade").attr("checked", false);
        $("#expTrade").prev().removeClass("ui-radio-on").addClass("ui-radio-off");
        $("#qualTrade").attr("checked", false);
        $("#qualTrade").prev().removeClass("ui-radio-on").addClass("ui-radio-off");
        //$("#ddlTradeExp").val("0");
        $.mobile.pageContainer.pagecontainer("change", "#addeditTrade", { transition: "slide" });
    });
    $(document).on("click", "#btnAddPosition", function() {
        $("#txtExpPosition").val("");
        $("#txtQualPosition").val("");
        $("#hdnPositionId").val(positionId++);
        getActivePositionHeld(0);
        $("#expPosition").attr("checked", false);
        $("#expPosition").prev().removeClass("ui-radio-on").addClass("ui-radio-off");
        $("#qualPosition").attr("checked", false);
        $("#qualPosition").prev().removeClass("ui-radio-on").addClass("ui-radio-off");
        $.mobile.pageContainer.pagecontainer("change", "#addeditPosition", { transition: "slide" });
    });

    //getActiveLicenceType(0);
    //getActiveTradeExp(0);
    //getActivePositionHeld(0);

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

    $(document).on("click", "#dvLicence .ui-radio", function() {
        $("#dvLicence .exp").show();
        $("#txtExperience").val("");
        $("#txtNumberlLicence").val("");
        if ($(this).children("input[name=LicencePosition]").val() == "2") {
            $("#dvLicence .num").show();
            $("#dvLicence .exp").hide();
            // $("#txtNumberlLicence,#txtLicenceExpiry").removeClass("licenceRequired").addClass("licenceRequired");
            // $("#txtExperience").removeClass("licenceRequired");
        } else {
            $("#dvLicence .exp").show();
            $("#dvLicence .num").hide();
            // $("#txtNumberlLicence,#txtLicenceExpiry").removeClass("licenceRequired");
            // $("#txtExperience").addClass("licenceRequired");
        }
    });
    $("input[name='LicencePosition']").on("click", function() {
        $("#dvLicence .exp").show();
        $("#txtExperience").val("");
        $("#txtNumberlLicence").val("");
        console.warn($(this).val());
        if ($(this).val() == "2") {
            $("#dvLicence .num").show();
            $("#dvLicence .exp").show();
        } else if ($(this).val() == "1") {
            $("#dvLicence .exp").show();
            $("#dvLicence .num").hide();
        }

    });
    $("input[name='TradeExpPosition']").on("click", function() {
        $("#dvTrade .exp").show();
        $("#txtExpTrade").val("");
        $("#txtNumberlLicence").val("");
        console.warn($(this).val());
        if ($(this).val() == "2") {
            $("#dvTrade .num").show();
            $("#dvTrade .exp").show();
        } else if ($(this).val() == "1") {
            $("#dvTrade .exp").show();
            $("#dvTrade .num").hide();
        }

    });
    $(document).on("click", "#dvTrade .ui-radio", function() {
        $("#dvTrade .exp").show();
        $("#txtExpTrade").val("");
        $("#txtQualTrade").val("");
        console.log($(this).children("input[name=TradeExpPosition]").val());
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
    $("input[name='CertifiedTypePosition']").on("click", function() {
        $("#dvPosition .exp").show();
        $("#txtExpPosition").val("");
        $("#txtQualPosition").val("");
        console.warn($(this).val());
        if ($(this).val() == "2") {
            $("#dvPosition .num").show();
            $("#dvTrade .exp").show();
        } else if ($(this).val() == "1") {
            $("#dvPosition .exp").show();
            $("#dvPosition .num").hide();
        }

    });

});

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
}

function cameraError(err) {
    console.log("Camera error:" + err);
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
                $("#ddlLicenceText").val(result.Name);
                console.warn(result.LicenceAbbr);
                $("#licenceTypeh").text("Licence Type: " + result.LicenceAbbr);
                if (result.IsQualifiedAllowed) {
                    $("#dvLicence .exp").show();
                    $("#dvLicence .num").show();
                    // $("#txtNumberlLicence,#txtLicenceExpiry,#txtExperience").removeClass("licenceRequired").addClass("licenceRequired");
                    $("#dvLicence .container").hide();
                } else {
                    $("#dvLicence .container").show();
                    $("#dvLicence .exp").hide();
                    $("#dvLicence .num").hide();
                    // $("#txtNumberlLicence,#txtLicenceExpiry,#txtExperience").removeClass("licenceRequired");
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
                $("#ddlTradeExpText").val(result.Name);
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
                    if (result[i].ID == id) {
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
                $("#ddlPositionHeldText").val(result.Name);
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

function deletePosition(id, el) {
    var r = confirm('Are you sure');
    if (r) {
        showWait();
        var obj = {};
        obj.Id = parseInt(id);
        debugger;
        for (var i = 0; i < positionHoldList.length; i++) {
            if (positionHoldList[i].Id == obj.Id) {
                positionHoldList.splice(positionHoldList.indexOf(positionHoldList[i]), 1);
            }
        }
        toast('Position Deleted Successfully');
        rebindGrids();
        hideWait();
    }
}


function deleteLicence(id, el) {
    var r = confirm('Are you sure');
    if (r) {
        showWait();
        var obj = {};
        obj.Id = parseInt(id);
        for (var i = 0; i < licenceTicketList.length; i++) {
            if (licenceTicketList[i].Id == obj.Id) {
                licenceTicketList.splice(licenceTicketList.indexOf(licenceTicketList[i]), 1);
            }
        }
        toast('Licence Ticket Type Deleted Successfully');
        rebindGrids();
        hideWait();

    }
}

function deleteTrade(id, el) {
    var r = confirm('Are you sure');
    if (r) {
        showWait();

        var obj = {};
        obj.Id = parseInt(id);
        for (var i = 0; i < tradeExpList.length; i++) {
            if (tradeExpList[i].Id == obj.Id) {
                tradeExpList.splice(tradeExpList.indexOf(tradeExpList[i]), 1);
            }
        }
        toast('Trade Exp Deleted Successfully');
        rebindGrids();
        hideWait();
    }
}


function SaveLicence() {
    var isValid = true;
    $(".licenceRequired").each(function() {
        console.warn($(this));
        var current = $(this);
        if (current.val() == "" && current.is(":visible")) {
            $(current).addClass("error");
            isValid = false;
        } else {
            $(current).removeClass("error");
        }
    });
    if (isValid) {
        var obj = {};
        obj.Id = $("#hdnLicenceTypeId").val();
        obj.LicenceTicketTypeId = $("#ddlLicence").val();
        //obj.UserId = currentUser.ID;
        obj.Name = $("#ddlLicenceText").val();
        obj.Experience = $("#txtExperience").val();
        obj.LicenceNumber = $("#txtNumberlLicence").val();
        obj.LicenceExpiry = $("#txtLicenceExpiry").val();
        obj.UserCertificationTypeId = $("input[name=LicencePosition]:checked").val(); //radio button value;
        //obj = JSON.stringify(obj);
        AddUserLicenceTicketType(obj);

    } else {
        return false;
    }

}

function SaveTrade() {
    var isValid = true;
    $(".tradeRequired").each(function() {
        console.warn($(this));
        var current = $(this);
        if (current.val() == "" && current.is(":visible")) {
            $(current).addClass("error");
            isValid = false;
        } else {
            $(current).removeClass("error");
        }
    });
    if (isValid) {
        var obj = {};
        obj.Id = $("#hdnTradeId").val();
        obj.TradeExperienceId = $("#ddlTradeExp").val();
        //obj.UserId = currentUser.ID;
        obj.Name = $("#ddlTradeExpText").val();
        obj.Experience = $("#txtExpTrade").val();
        obj.QualificationNumber = $("#txtQualTrade").val();
        obj.UserCertificationTypeId = $("input[name=TradeExpPosition]:checked").val() || ""; //radio button value;
        //obj = JSON.stringify(obj);
        AddUserTradeExp(obj);
    } else {
        return false;
    }

}

function SavePosition() {
    var isValid = true;
    $(".positionRequired").each(function() {
        console.warn($(this));
        var current = $(this);
        if (current.val() == "" && current.is(":visible")) {
            $(current).addClass("error");
            isValid = false;
        } else {
            $(current).removeClass("error");
        }
    });
    if (isValid) {
        var obj = {};
        obj.Id = $("#hdnPositionId").val();
        obj.PositionHeldId = $("#ddlPositionHeld").val();
        //obj.UserId = currentUser.ID;
        obj.Name = $("#ddlPositionHeldText").val();
        obj.Experience = $("#txtExpPosition").val();
        obj.QualificationNumber = $("#txtQualPosition").val();
        obj.UserCertificationTypeId = $("input[name=CertifiedTypePosition]:checked").val(); //radio button value;
        //obj = JSON.stringify(obj);
        AddUserPositionHeld(obj);
    } else {
        return false;
    }
}


function AddUserPositionHeld(obj) {
    showWait();
    for (var i = 0; i < positionHoldList.length; i++) {
        if (positionHoldList[i].Id === obj.Id) {
            positionHoldList.splice(positionHoldList.indexOf(positionHoldList[i]), 1);
        }
    }
    positionHoldList.push(obj);

    $("#hdnPositionId").val(parseInt($("#hdnPositionId").val()) + 1);
    listPositions();
    hideWait();
    $("input[type='text']").val("");
    $.mobile.pageContainer.pagecontainer("change", "#positionsPage", { transition: "slide" });
}

function listPositions() {
    // To list the positions which has been added
    var positionsHtml = "";
    if (positionHoldList != null) {
        for (var i = 0; i < positionHoldList.length; i++) {
            var Exp = (positionHoldList[i].Experience != null && positionHoldList[i].Experience != "null") ? positionHoldList[i].Experience : "";
            var qualNo = (positionHoldList[i].QualificationNumber != null && positionHoldList[i].QualificationNumber != "null") ? positionHoldList[i].QualificationNumber : "";
            positionsHtml += '<li>' +
                '<p>' + positionHoldList[i].Name + '</p>' +
                '<p>Cert Type: ' + positionHoldList[i].UserCertificationTypeId + '<br/>' +
                'QualificationNumber: ' + qualNo + '<br/>' +
                'Experience: ' + Exp +
                /*'<td><a onclick="editTrade(' + tradeExpList[j].Id + ')">Edit</a></td>' +
                '<td><a onclick="deleteTrade(' + tradeExpList[j].Id + ',this)">Delete</a></td>' +*/
                '</p></li>';

        }
        $("#addPositionsPara").hide();
        $("#positionsList").html(positionsHtml).listview().listview("refresh");
    }

}


function AddUserTradeExp(obj) {
    showWait();
    for (var i = 0; i < tradeExpList.length; i++) {
        if (tradeExpList[i].Id === obj.Id) {
            tradeExpList.splice(tradeExpList.indexOf(tradeExpList[i]), 1);
        }
    }
    tradeExpList.push(obj);
    $("#hdnTradeId").val(parseInt($("#hdnTradeId").val()) + 1);
    //rebindGrids();
    listTrade();
    hideWait();
    $("input[type='text']").val("");
    $.mobile.pageContainer.pagecontainer("change", "#experiencePage", { transition: "slide" });
}

function listTrade() {
    // To list the trade which has been added
    var tradeHtml = "";
    if (tradeExpList != null) {
        for (var j = 0; j < tradeExpList.length; j++) {
            var exp = (tradeExpList[j].Experience != null && tradeExpList[j].Experience != "null") ? tradeExpList[j].Experience : "";
            var no = (tradeExpList[j].QualificationNumber != null && tradeExpList[j].QualificationNumber != "") ? tradeExpList[j].QualificationNumber : "";
            tradeHtml += '<li>' +
                '<h1>' + tradeExpList[j].Name + '</h1>' +
                '<p>Cert Type: ' + tradeExpList[j].UserCertificationTypeId + '<br/>' +
                'QualificationNumber: ' + no + '<br/>' +
                'Experience: ' + exp + '</p>' +
                /*'<td><a onclick="editTrade(' + tradeExpList[j].Id + ')">Edit</a></td>' +
                '<td><a onclick="deleteTrade(' + tradeExpList[j].Id + ',this)">Delete</a></td>' +*/
                '</li>';

        }
        $("#addTradePara").hide();
        $("#tradeList").html(tradeHtml).listview().listview("refresh");
    }
}

function AddUserLicenceTicketType(obj) {
    showWait();
    for (var i = 0; i < licenceTicketList.length; i++) {
        if (licenceTicketList[i].Id === obj.Id) {
            licenceTicketList.splice(licenceTicketList.indexOf(licenceTicketList[i]), 1);
        }
    }
    licenceTicketList.push(obj);
    $("#hdnLicenceTypeId").val(parseInt($("#hdnLicenceTypeId").val()) + 1);
    listTickets();
    hideWait();
    $("input[type='text']").val("");
    $.mobile.pageContainer.pagecontainer("change", "#licencePage", { transition: "slide" });
}

function listTickets() {
    var licenceHtml = "";
    $("#addLicencePara").hide();
    if (licenceTicketList != null) {
        for (var i = 0; i < licenceTicketList.length; i++) {
            var exp = (licenceTicketList[i].Experience != null && licenceTicketList[i].Experience != "") ? licenceTicketList[i].Experience : "";
            var no = (licenceTicketList[i].LicenceNumber != null && licenceTicketList[i].LicenceNumber != "") ? licenceTicketList[i].LicenceNumber : "";
            var expiryDate = (licenceTicketList[i].LicenceExpiry != null && licenceTicketList[i].LicenceExpiry != "") ? licenceTicketList[i].LicenceExpiry : "";
            licenceHtml += '<li><h1>' + licenceTicketList[i].Name + '</h1><br/>' +
                '<p>Licence No.: ' + no + '<br/>' +
                'Expiry: ' + expiryDate + 
                'Experience: ' + exp +'</p>' +
                /*<div class="behind"><a href="#" class="ui-btn delete-btn">Delete</a><a href="#" class="ui-btn edit-btn pull-left">Edit</a></div>' +
                '<a href="#"></a>*/
                //'<td>' + licenceTicketList[k].LicenceExpiry + '</td>' +
                // '<td>' + licenceTicketList[k].UserCertificationTypeId + '</td>' +
                /*'<td><a onclick="editLicence(' + licenceTicketList[i].Id + ')">Edit</a></td>' +
                '<td><a onclick="deleteLicence(' + licenceTicketList[i].Id + ',this)">Delete</a></td>' +*/
                '</li>';
        }
        $("#tblLicenceList").html(licenceHtml).trigger("create").listview().listview("refresh");
    }
}

function editLicence(id) {
    showWait();
    var count = 0;
    for (var i = 0; i < licenceTicketList.length; i++) {
        if (licenceTicketList[i].Id == id) {
            count = i;
        }
    }
    $.mobile.pageContainer.pagecontainer("change", "#addeditLicence", { transition: "slide" });
    getActiveLicenceType(licenceTicketList[count].LicenceTicketTypeId);
    //getLicenceTypDetail(licenceTicketList[count].LicenceTicketTypeId);
    $("#ddlLicence").val(licenceTicketList[count].LicenceTicketTypeId);
    $("#txtExperience").val(licenceTicketList[count].Experience);
    $("#txtNumberlLicence").val(licenceTicketList[count].LicenceNumber);
    $("#dvLicence").show();
    $("#dvLicence .container").show();
    $("#dvLicence .exp").show();
    if (licenceTicketList[count].UserCertificationTypeId === 1) {
        $("#expLicence").attr("checked", true);
        $("#expLicence").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
        $("#dvLicence .num").hide();
    } else {
        if (licenceTicketList[count].UserCertificationTypeId === 2) {
            $("#qualLicence").attr("checked", true);
            $("#qualLicence").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
            $("#dvLicence .num").show();
        } else {
            $("#dvLicence .container").hide();
            $("#dvLicence .num").show();
        }
    }
    hideWait();
}

function editPosition(id) {
    showWait();
    var count = 0;
    for (var i = 0; i < positionHoldList.length; i++) {
        if (positionHoldList[i].Id == id) {
            count = i;
        }
    }
    debugger;
    $.mobile.pageContainer.pagecontainer("change", "#addeditPosition", { transition: "slide" });
    $("#hdnPositionId").val(positionHoldList[count].Id);
    getActivePositionHeld(positionHoldList[count].PositionHeldId);
    //getPositionHeldDetail(positionHoldList[count].PositionHeldId);
    $("#ddlPositionHeld").val(positionHoldList[count].PositionHeldId);
    $("#txtExpPosition").val(positionHoldList[count].Experience);
    $("#txtQualPosition").val(positionHoldList[count].QualificationNumber);
    $("#dvPosition").show();
    $("#dvPosition .container").show();
    $("#dvPosition .exp").show();
    if (positionHoldList[count].UserCertificationTypeId === "1") {
        $("#expPosition").attr("checked", true);
        $("#expPosition").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
        $("#dvPosition .num").hide();
    } else {
        if (positionHoldList[count].UserCertificationTypeId === "2") {
            $("#qualPosition").attr("checked", true);
            $("#qualPosition").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
            $("#dvPosition .num").show();
        } else {
            $("#dvPosition .container").hide();
            $("#dvPosition .num").show();
        }
    }
    hideWait();
}

function editTrade(id) {
    showWait();
    var count = 0;
    for (var i = 0; i < tradeExpList.length; i++) {
        if (tradeExpList[i].Id == id) {
            count = i;
        }
    }
    $.mobile.pageContainer.pagecontainer("change", "#addeditTrade", { transition: "slide" });
    $("#hdnTradeId").val(tradeExpList[count].Id);
    getActiveTradeExp(tradeExpList[count].TradeExperienceId);
    getTradeExpDetail(tradeExpList[count].TradeExperienceId);
    $("#ddlTradeExp").val(tradeExpList[count].TradeExperienceId);
    $("#txtExpTrade").val(tradeExpList[count].Experience);
    $("#txtQualTrade").val(tradeExpList[count].QualificationNumber);
    $("#dvTrade").show();
    $("#dvTrade .container").show();
    $("#dvTrade .exp").show();
    if (tradeExpList[count].UserCertificationTypeId === 1) {
        $("#expTrade").attr("checked", true);
        $("#expTrade").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
        $("#dvTrade .num").hide();

    } else {
        if (tradeExpList[count].UserCertificationTypeId === 2) {
            $("#qualTrade").attr("checked", true);
            $("#qualTrade").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
            $("#dvTrade .num").show();
        } else {
            $("#dvTrade .container").hide();
            $("#dvTrade .num").show();
        }
    }
    hideWait();
}

function rebindGrids() {
    var licenceHtml = '';
    var positionHtml = '';
    var tradeHtml = '';
    if (positionHoldList != null) {
        for (var i = 0; i < positionHoldList.length; i++) {
            var Exp = (positionHoldList[i].Experience != null && positionHoldList[i].Experience != "null") ? positionHoldList[i].Experience : "";
            var qualNo = (positionHoldList[i].QualificationNumber != null && positionHoldList[i].QualificationNumber != "null") ? positionHoldList[i].QualificationNumber : "";
            positionHtml += '<tr><td>' + positionHoldList[i].Name + '</td><td>' + Exp + '</td><td>' + qualNo + '</td>' +
                //'<td>' + positionheldslist[i].UserCertificationTypeId + '</td>' +
                '<td><a onclick="editPosition(' + positionHoldList[i].Id + ')">Edit</a></td>' +
                '<td><a onclick="deletePosition(' + positionHoldList[i].Id + ',this)">Delete</a></td>' +
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
    if (licenceTicketList != null) {
        for (var k = 0; k < licenceTicketList.length; k++) {
            var exp = (licenceTicketList[k].Experience != null && licenceTicketList[k].Experience != "") ? licenceTicketList[k].Experience : "";
            var no = (licenceTicketList[k].LicenceNumber != null && licenceTicketList[k].LicenceNumber != "") ? licenceTicketList[k].LicenceNumber : "";
            licenceHtml += '<tr>' +
                '<td>' + licenceTicketList[k].Name + '</td>' +
                '<td>' + exp + '</td>' +
                '<td>' + no + '</td>' +
                //'<td>' + licenceTicketList[k].LicenceExpiry + '</td>' +
                // '<td>' + licenceTicketList[k].UserCertificationTypeId + '</td>' +
                '<td><a onclick="editLicence(' + licenceTicketList[k].Id + ')">Edit</a></td>' +
                '<td><a onclick="deleteLicence(' + licenceTicketList[k].Id + ',this)">Delete</a></td>' +
                '</tr>';
        }
    }

    $("#tblLicenceList tbody").html(licenceHtml);
    $("#tblTradeExpList tbody").html(tradeHtml);
    $("#tblPositionList tbody").html(positionHtml);
}
