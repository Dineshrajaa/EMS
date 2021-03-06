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
    //console.warn("sourceType:" + sourceType + "cameraOptions:" + JSON.stringify(cameraOptions));
    navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
}

function cameraSuccess(imageData) {
    // $("#profilePicImg").attr("src", "data:image/jpeg;base64," + imageData);
    var imageData = "data:image/jpeg;base64," + imageData;
    $(".profileCircle").css("background-image", "url(" + imageData + ")");
    localStorage.ProfilePicture = imageData;
    updateProfilePicture(); // now send the picture to sevice 

}

function updateProfilePicture() {
    // To update profile picture of the user
    var url = serviceUrl + "Account/UpdateProfilePicture";
    var jsonObj = new Object();
    jsonObj.UserId = $("#hdnUserId").val();
    jsonObj.ProfileImage = localStorage.ProfilePicture || "";
    //console.warn(JSON.stringify(jsonObj));
    showWait();
    $.ajax({
        type: "POST",
        url: url,
        data: jsonObj,
        //contentType: "application/json",
        //dataType: "json",
        //async: false,
        success: function(result) {
            hideWait();
            //console.warn("result:" + result);
            if (result.IsSuccessful) {
                $("#imgUserImage").attr('src', localStorage.ProfilePicture);
                var currentUserObj = localStorage.getItem('userSession');
                if (currentUserObj && currentUserObj != 'undefined' && currentUserObj != null) {
                    currentUserObj = JSON.parse(currentUserObj);
                    currentUserObj.ProfilePicture = localStorage.ProfilePicture;
                    localStorage.userSession = JSON.stringify(currentUserObj);
                }
                localStorage.ProfilePicture = ""; // clear the profilepicture to avoid memory problems

                toast("Profile Picture updated Successfully");
                $('#profileDetailsPage,#avatarPage').unblock();
            }
        },
        error: function(error) {
            hideWait();
            $('#profileDetailsPage,#avatarPage').unblock();
        }
    });
}

function cameraError(err) {
    //console.log("Camera error:" + err);
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


function blockIT() {
    // To block the ui
    $("#cameraTypeList").panel("open");
    $('#profileDetailsPage').block({ message: null });
}
var trannieProfileObj = '';
var currentUser = '';
$(document).on("ready", function() {
    var currentUserObj = localStorage.getItem('userSession');
    if (currentUserObj && currentUserObj != 'undefined') {
        currentUser = JSON.parse(currentUserObj);
        fetchProfileDetail(currentUser.ID);
        GetEmployeeDetails(currentUser.ID);
        fillProfilePicture();
    }


    getActiveLTP(); // Fetch Documents
    /*getActiveLicenceType(0);
    getActiveTradeExp(0);
    getActivePositionHeld(0);*/

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

    /*$(document).on("click", "#dvLicence .ui-radio", function() {
        $("#dvLicence .exp").show();
        $("#txtExperience").val("");
        $("#txtNumberlLicence").val("");
        if ($(this).children("input[name=LicencePosition]").val() == "2") {
            $("#dvLicence .num").show();
        } else {
            $("#dvLicence .num").hide();
        }
    });*/

    /*$(document).on("click", "#dvTrade .ui-radio", function() {
        $("#dvTrade .exp").show();
        $("#txtExpTrade").val("");
        $("#txtQualTrade").val("");
        if ($(this).children("input[name=TradeExpPosition]").val() === "2") {
            $("#dvTrade .num").show();
        } else {
            $("#dvTrade .num").hide();
        }
    });*/
    $("input[name='TradeExpPosition']").on("click", function() {
        $("#dvTrade .exp").show();
        // $("#txtExpTrade").val("");
        // $("#txtQualTrade").val("");
        //console.warn($(this).val());
        if ($(this).val() == "1") {
            $("#dvTrade .num").show();
        } else if ($(this).val() == "2") {
            $("#dvTrade .num").hide();
        }

    });
    $("input[name='CertifiedTypePosition']").on("click", function() {
        $("#dvPosition .exp").show();
        // $("#txtExpPosition").val("");
        // $("#txtQualPosition").val("");
        //console.warn($(this).val());
        if ($(this).val() == "1") {
            $("#dvPosition .num").show();
        } else if ($(this).val() == "2") {
            $("#dvPosition .num").hide();
        }

    });
    /*$(document).on("click", "#dvPosition .ui-radio", function() {
        $("#dvPosition .exp").show();
        $("#txtExpPosition").val("");
        $("#txtQualPosition").val("");
        if ($(this).children("input[name=CertifiedTypePosition]").val() === "2") {
            $("#dvPosition .num").show();
        } else {
            $("#dvPosition .num").hide();
        }
    });*/
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
                if (employeeObj.ProfilePicture != null) {
                    if ((employeeObj.ProfilePicture).indexOf("data:image/jpeg;base64,") == -1)
                        employeeObj.ProfilePicture = "data:image/jpeg;base64," + employeeObj.ProfilePicture;
                }
                $(".profileCircle").css("background-image", "url(" + employeeObj.ProfilePicture + ")");
                $("#ddlTitle").val(titleId);
                $("#ddlTitle").prev().text(employeeObj.Title);
                $("#txtFirstName").val(employeeObj.FirstName);
                $("#lblName").html(employeeObj.Title + " " + employeeObj.FirstName + "  " + employeeObj.LastName);
                $("#lblEnmployeeNumber").html(employeeObj.EmployeeNumber);
                $("#txtMiddleName").val(employeeObj.MiddleName);
                $("#txtLastName").val(employeeObj.LastName);
                // $("#txtDob").val(new Date(employeeObj.DateOfBirth).getFormattedDateInddMMYY());
                // $("#txtDob").val(formatDate(employeeObj.DateOfBirth));
                $("#txtDob").mobiscroll().date({
                    lang: 'en',
                    theme: 'android-holo-light',
                    display: 'bubble',
                    display: 'bottom',
                    dateOrder: 'ddMMyy',
                    dateFormat: 'dd/mm/yyyy',
                    mode: 'scroller',
                    maxDate: new Date(2050, 12, 31)
                });
                $("#txtDob").mobiscroll('setValue', new Date(employeeObj.DateOfBirth), true);
                /*$("#txtDob").mobiscroll().date({
                    lang: 'en',
                    theme: 'android-holo-light',
                    display: 'bubble',
                    display: 'bottom',
                    dateOrder: 'ddMMyy',
                    dateFormat: 'dd/mm/yyyy',
                    mode: 'scroller',
                    maxDate: new Date(2050, 12, 31)
                }).setVal(new Date(employeeObj.DateOfBirth), true);*/
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
                $("#lblAddr").html(employeeObj.StreetAddress + ", " + employeeObj.City + ", " + employeeObj.State + ", " + employeeObj.Postcode);
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
                    $("#chkPaySlipMail").attr("checked", true).checkboxradio().checkboxradio("refresh");
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
    var pin = $("#txtPin").val();
    var isPayslip = $("#chkPaySlipMail").is(":checked") ? true : false;
    var roleId = $("#hdnRoleId").val();

    var trannieProfileObj = {};
    trannieProfileObj.ID = id;
    trannieProfileObj.Title = title;
    trannieProfileObj.FirstName = firstName;
    trannieProfileObj.MiddleName = middleName;
    trannieProfileObj.LastName = lastName;
    trannieProfileObj.DateOfBirth = dob;
    trannieProfileObj.DOB = dob;
    trannieProfileObj.StreetAddress = streetAddress;
    trannieProfileObj.City = city;
    trannieProfileObj.State = state;
    trannieProfileObj.Postcode = postCode;
    trannieProfileObj.ContactNumber = primaryContact;
    trannieProfileObj.SecondaryContact = secondaryContact;
    trannieProfileObj.IsPaySlipSent = isPayslip;
    trannieProfileObj.GenderId = gender;
    trannieProfileObj.roleId = roleId;
    trannieProfileObj.Password = pin;

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
            trannieProfileObj.ProfilePicture = currentUser.ProfilePicture;
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
$(function() {
    var demo = "date";
    var theme = "android-holo-light";
    var mode = "scroller";
    var display = "bubble";
    var lang = "en";
    $('#txtDob,#txtLicenceExpiry').mobiscroll().date({
        lang: 'en',
        theme: 'android-holo-light',
        display: 'bubble',
        display: 'bottom',
        dateOrder: 'ddMMyy',
        dateFormat: 'dd/mm/yyyy',
        mode: 'scroller',
        maxDate: new Date(2050, 12, 31)
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
                var options = '<option value="0">SELECT LICENCE</option>';
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
                $("#licenceTypeh").text(response.LicenceAbbr);
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

function getActiveLTP() {
    // Method to get all the active Licence,Trade,Positions
    showWait();
    var url = serviceUrl + "Account/GetCertifications";
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        success: function(response) {
            hideWait();
            console.warn("response:" + JSON.stringify(response));
            if (response.IsSuccessful) {
                var res = response.Result;
                $("#ddlLicence,#ddlPositionHeld,#ddlTradeExp").html("");
                if (res.LicenceTickets) {
                    var result = res.LicenceTickets;
                    var ticketOptions = '<option value="0" selected>Please Select</option>';
                    for (var i = 0; i < result.length; i++) {
                        ticketOptions += '<option value=' + result[i].ID + '>' + result[i].Name + '</option>';

                    }
                    $("#ddlLicence").append(ticketOptions);
                }
                if (res.PositionHelds) {
                    var result = res.PositionHelds;
                    var positionOptions = '<option value="0" selected>Please Select</option>';
                    for (var i = 0; i < result.length; i++) {
                        positionOptions += '<option value=' + result[i].ID + '>' + result[i].Name + '</option>';

                    }
                    $("#ddlPositionHeld").append(positionOptions);
                }
                if (res.TradeExperiences) {
                    var result = res.TradeExperiences;
                    var tradeOptions = '<option value="0" selected>Please Select</option>';
                    for (var i = 0; i < result.length; i++) {
                        tradeOptions += '<option value=' + result[i].ID + '>' + result[i].Name + '</option>';

                    }
                    $("#ddlTradeExp").append(tradeOptions);
                }
                /*$("#ddlTradeExp").html("");
                var options = '<option value="0">SELECT TRADE</option>';
                var result = response.Result;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].ID === id) {
                        options += '<option value=' + result[i].ID + ' selected="selected">' + result[i].Name + '</option>';
                        $("#ddlTradeExp").prev().text(result[i].Name);
                    } else {
                        options += '<option value=' + result[i].ID + '>' + result[i].Name + '</option>';
                    }
                }
                $("#ddlTradeExp").append(options);*/
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
                var options = '<option value="0">SELECT TRADE</option>';
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
                var options = '<option value="0">SELECT POSITION</option>';
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

function printPositionList(PositionHeldList, tradeExpList, licencelist) {
    var positionsHtml = '';
    if (PositionHeldList != null) {
        for (var i = 0; i < PositionHeldList.length; i++) {
            var showQualifiedDetails = "block";
            var Exp = (PositionHeldList[i].Experience != null && PositionHeldList[i].Experience != "null") ? PositionHeldList[i].Experience : "";
            var qualNo = (PositionHeldList[i].QualificationNumber != null && PositionHeldList[i].QualificationNumber != "null") ? PositionHeldList[i].QualificationNumber : "";
            if (qualNo == "")
                showQualifiedDetails = "display:none";
            positionsHtml += '<li onclick="editPosition(' + PositionHeldList[i].Id + ')">';
            positionsHtml += '<table data-role="table" data-mode="" class="ui-responsive table-stroke"><tbody>';
            positionsHtml += '<tr><td>' + PositionHeldList[i].Name + '</td></tr>';
            positionsHtml += '<tr><td>Certification Type</td><td>' + PositionHeldList[i].UserCertificationType + '</td></tr>';
            positionsHtml += '<tr style="' + showQualifiedDetails + '"><td>Qualification No.</td><td>' + qualNo + '</td></tr>';
            positionsHtml += '<tr><td>Experience</td><td>' + Exp + '</td></tr>';
            positionsHtml += '</tbody>';
            positionsHtml += '</table></li><hr>';
            /*positionHtml += '<tr><td>' + result.PositionHeldList[i].Name + '</td><td>' + Exp + '</td><td>' + qualNo + '</td>' +
                //'<td>' + positionheldslist[i].UserCertificationTypeId + '</td>' +
                '<td><a onclick="editPosition(' + result.PositionHeldList[i].Id + ')">Edit</a></td>' +
                '<td><a onclick="deletePosition(' + result.PositionHeldList[i].Id + ',this)">Delete</a></td>' +
                '</tr>';*/

        }
        $("#positionList").html(positionsHtml).listview().listview("refresh");
        printTradeList(tradeExpList, licencelist);
    } else
        printTradeList(tradeExpList, licencelist);
}

function printTradeList(tradeExpList, licencelist) {

    var tradeHtml = '';
    if (tradeExpList != null) {
        for (var j = 0; j < tradeExpList.length; j++) {
            var showQualifiedDetails = "";
            var exp = (tradeExpList[j].Experience != null && tradeExpList[j].Experience != "null") ? tradeExpList[j].Experience : "";
            var no = (tradeExpList[j].QualificationNumber != null && tradeExpList[j].QualificationNumber != "") ? tradeExpList[j].QualificationNumber : "";
            if (no == "")
                showQualifiedDetails = "display:none";
            tradeHtml += '<li onclick="editTrade(' + tradeExpList[j].Id + ')">';
            tradeHtml += '<table data-role="table" data-mode="" class="ui-responsive table-stroke"><tbody>';
            tradeHtml += '<tr><td>' + tradeExpList[j].Name + '</td></tr>';
            tradeHtml += '<tr><td>Certification Type</td><td>' + tradeExpList[j].UserCertificationType + '</td></tr>';
            tradeHtml += '<tr style="' + showQualifiedDetails + '"><td>Qualification No.</td><td>' + no + '</td></tr>';
            tradeHtml += '<tr><td>Experience</td><td> ' + exp + '</td></tr>';
            tradeHtml += '</tbody></table>';
            tradeHtml += '</li><hr>';
            /*                        tradeHtml += '<tr>' +
                                        '<td>' + tradeExpList[j].Name + '</td>' +
                                        '<td>' + exp + '</td>' +
                                        '<td>' + no + '</td>' +
                                        //'<td>' + tradeExpList[j].UserCertificationTypeId + '</td>' +
                                        '<td><a onclick="editTrade(' + tradeExpList[j].Id + ')">Edit</a></td>' +
                                        '<td><a onclick="deleteTrade(' + tradeExpList[j].Id + ',this)">Delete</a></td>' +
                                        '</tr>';*/

        }
        $("#tradeList").html(tradeHtml).listview().listview("refresh");
        printLicenceList(licencelist);
    } else
        printLicenceList(licencelist);
}

function printLicenceList(licencelist) {
    var licenceHtml = '';

    if (licencelist != null) {
        for (var k = 0; k < licencelist.length; k++) {
            var showQualifiedDetails = "";
            var exp = (licencelist[k].Experience != null && licencelist[k].Experience != "") ? licencelist[k].Experience : "";
            var no = (licencelist[k].LicenceNumber != null && licencelist[k].LicenceNumber != "") ? licencelist[k].LicenceNumber : "";
            var expiryDate = (licencelist[k].LicenceExpiry != null && licencelist[k].LicenceExpiry != "") ? licencelist[k].LicenceExpiry : "";

            if (no == "") {
                // No licence number
                expiryDate = ""; // clear the expiry date
                showQualifiedDetails = "display:none"; // hide the qualification oriented things
            } else {
                /* var ed = new Date(expiryDate);
                 console.warn(ed);
                 var date = ed.getDate() < 10 ? "0" + ed.getDate() : ed.getDate();
                 var month = (parseInt(ed.getMonth()) + 1);
                 var formattedMonth = month < 10 ? "0" + month : month;
                 expiryDate = date + "-" + formattedMonth + "-" + ed.getFullYear();*/

                expiryDate = expiryDate != '' ? formatDate(expiryDate) : '';
                // expiryDate = expiryDate.split("T")[0];
            }
            licenceHtml += '<li onclick="editLicence(' + licencelist[k].Id + ')">';
            licenceHtml += '<table data-role="table" data-mode="" class="ui-responsive table-stroke"><tbody>';
            licenceHtml += '<tr><td>' + licencelist[k].Name + '</td></tr>';
            licenceHtml += '<tr><td>Licence Type </td><td>' + licencelist[k].LicenceType || "" + '</td></tr>';
            licenceHtml += '<tr style="' + showQualifiedDetails + '"><td>Licence No.</td><td>' + no + '</td></tr>';
            licenceHtml += '<tr style="' + showQualifiedDetails + '"><td>Expiry</td><td>' + expiryDate + '</td></tr>';
            licenceHtml += '<tr><td>Experience</td><td>' + exp + '</td></tr>';
            licenceHtml += '</tbody></table>';
            licenceHtml += '</li><hr>';
            /*                        licenceHtml += '<tr>' +
                                        '<td>' + licencelist[k].Name + '</td>' +
                                        '<td>' + exp + '</td>' +
                                        '<td>' + no + '</td>' +
                                        //'<td>' + licencelist[k].LicenceExpiry + '</td>' +
                                        // '<td>' + licencelist[k].UserCertificationTypeId + '</td>' +
                                        '<td><a onclick="editLicence(' + licencelist[k].Id + ')">Edit</a></td>' +
                                        '<td><a onclick="deleteLicence(' + licencelist[k].Id + ',this)">Delete</a></td>' +
                                        '</tr>';*/
        }
        $("#licenceList").html(licenceHtml).listview().listview("refresh");
    }
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

                //console.warn(result.PositionHeldList.length);
                printPositionList(positionheldslist, tradeExpList, licencelist);
            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}


function deletePosition(id) {
    // var r = confirm('Are you sure');
    navigator.notification.confirm(
        'Are you sure you want to delete this Position?', // message
        function(buttonIndex) {
            if (buttonIndex == 1) {
                showWait();

                var id = parseInt(localStorage.selectedPosition);
                var url = serviceUrl + "Account/DeleteUserPositionHeld/";
                $.ajax({
                    type: 'POST',
                    url: url + id,
                    data: {},
                    success: function(response) {
                        hideWait();
                        if (response.IsSuccessful) {

                            toast('Position Deleted Successfully');
                            triggerEmployeedetails();
                        }
                    },
                    error: function() {
                        hideWait();
                        toast('Network Error');
                    }
                });
            }
        }, // callback to invoke with index of button pressed
        'Dowells', // title
        ['Delete', 'Cancel'] // buttonLabels
    );
    /*if (r) {
        showWait();

        var id = parseInt(localStorage.selectedPosition);
        var url = serviceUrl + "Account/DeleteUserPositionHeld/";
        $.ajax({
            type: 'POST',
            url: url + id,
            data: {},
            success: function(response) {
                hideWait();
                if (response.IsSuccessful) {

                    toast('Position Deleted Successfully');
                    triggerEmployeedetails();
                }
            },
            error: function() {
                hideWait();
                toast('Network Error');
            }
        });
    }*/
}

function triggerEmployeedetails() {
    var currentUserObj = localStorage.getItem('userSession');
    if (currentUserObj && currentUserObj != 'undefined') {
        currentUser = JSON.parse(currentUserObj);
        fetchProfileDetail(currentUser.ID);
        GetEmployeeDetails(currentUser.ID);
    }
}


function deleteLicence(id) {
    // var r = confirm('Are you sure');
    navigator.notification.confirm(
        'Are you sure you want to delete this Licence?', // message
        function(buttonIndex) {
            if (buttonIndex == 1) {
                showWait();
                var id = parseInt(localStorage.selectedTicket);
                var url = serviceUrl + "Account/DeleteUserLicenceTicketType/";
                $.ajax({
                    type: 'POST',
                    url: url + id,
                    data: {},
                    success: function(response) {
                        hideWait();
                        if (response.IsSuccessful) {
                            toast('Licence Ticket Type Deleted Successfully');
                            triggerEmployeedetails();
                        }
                    },
                    error: function() {
                        hideWait();
                        toast('Network Error');
                    }
                });
            }
        }, // callback to invoke with index of button pressed
        'Dowells', // title
        ['Delete', 'Cancel'] // buttonLabels
    );
    /*if (r) {
        showWait();
        var id = parseInt(localStorage.selectedTicket);
        var url = serviceUrl + "Account/DeleteUserLicenceTicketType/";
        $.ajax({
            type: 'POST',
            url: url + id,
            data: {},
            success: function(response) {
                hideWait();
                if (response.IsSuccessful) {
                    toast('Licence Ticket Type Deleted Successfully');
                    triggerEmployeedetails();
                }
            },
            error: function() {
                hideWait();
                toast('Network Error');
            }
        });
    }*/

}

function deleteTrade(id) {
    // var r = confirm('Are you sure');
    navigator.notification.confirm(
        'Are you sure you want to delete this Trade?', // message
        function(buttonIndex) {
            if (buttonIndex == 1) {
                showWait();

                var id = parseInt(localStorage.selectedTradeID);
                var url = serviceUrl + "Account/DeleteUserTradeExp/";
                $.ajax({
                    type: "POST",
                    url: url + id,
                    data: {},
                    success: function(response) {
                        hideWait();
                        if (response.IsSuccessful) {

                            toast('Trade Exp Deleted Successfully');
                            triggerEmployeedetails();
                        }
                    },
                    error: function() {
                        hideWait();
                        toast('Network Error');
                    }
                });
            }
        }, // callback to invoke with index of button pressed
        'Dowells', // title
        ['Delete', 'Cancel'] // buttonLabels
    );
    /*if (r) {
        showWait();
        
        var id = parseInt(localStorage.selectedTradeID);
        var url = serviceUrl + "Account/DeleteUserTradeExp/";
        $.ajax({
            type: "POST",
            url: url + id,
            data: {},
            success: function(response) {
                hideWait();
                if (response.IsSuccessful) {

                    toast('Trade Exp Deleted Successfully');
                    triggerEmployeedetails();
                }
            },
            error: function() {
                hideWait();
                toast('Network Error');
            }
        });
    }*/
}

$("input[name='LicencePosition']").on("click", function() {
    $("#dvLicence .exp").show();
    // $("#txtExperience").val("");
    // $("#txtNumberlLicence").val("");
    console.warn($(this).val());
    if ($(this).val() == "1") {
        $("#dvLicence .num").show();
        $("#dvLicence .exp").show();
    } else if ($(this).val() == "2") {
        $("#dvLicence .exp").show();
        $("#dvLicence .num").hide();
    }

});

function SaveLicence() {
    /* var obj = {};
     obj.Id = $("#hdnLicenceTypeId").val();
     obj.LicenceTicketTypeId = $("#ddlLicence").val();
     obj.UserId = currentUser.ID;
     obj.Experience = $("#txtExperience").val();
     obj.LicenceNumber = $("#txtNumberlLicence").val();
     obj.LicenceExpiry = "";
     obj.UserCertificationTypeId = $("input[name=LicencePosition]:checked").val(); //radio button value;
     //obj = JSON.stringify(obj);
     AddUserLicenceTicketType(obj);*/
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
        obj.UserId = currentUser.ID;
        obj.Name = $("#ddlLicenceText").val();
        obj.Experience = $("#txtExperience").val();
        obj.LicenceNumber = $("#txtNumberlLicence").val();
        obj.LicenceExpiry = convertUIDateToDb(($("#txtLicenceExpiry").mobiscroll('getVal')));
        obj.ExpiryDate = formatDate($("#txtLicenceExpiry").mobiscroll('getVal'), '/');
        obj.LicenceType = $("#licenceTypeh").text(); // Licence type
        obj.UserCertificationTypeId = $("input[name=LicencePosition]:checked").val(); //radio button value;
        //obj = JSON.stringify(obj);
        if (obj.UserCertificationTypeId == "2")
            obj.UserCertificationTypeName = "Experienced"; // Experienced
        else if (obj.UserCertificationTypeId == "1")
            obj.UserCertificationTypeName = "Qualified"; // Qualified
        else {
            obj.UserCertificationTypeName = "Qualified";
            obj.UserCertificationTypeId = 2;
        }
        AddUserLicenceTicketType(obj);

    } else {
        return false;
    }

}

function SaveTrade() {
    /*    var obj = {};
        obj.Id = $("#hdnTradeId").val();
        obj.TradeExperienceId = $("#ddlTradeExp").val();
        obj.UserId = currentUser.ID;
        obj.Experience = $("#txtExpTrade").val();
        obj.QualificationNumber = $("#txtQualTrade").val();
        obj.UserCertificationTypeId = $("input[name=TradeExpPosition]:checked").val(); //radio button value;
        //obj = JSON.stringify(obj);
        AddUserTradeExp(obj);*/
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
        obj.UserId = currentUser.ID;
        obj.Name = $("#ddlTradeExpText").val();
        obj.Experience = $("#txtExpTrade").val();
        obj.QualificationNumber = $("#txtQualTrade").val();
        obj.UserCertificationTypeId = $("input[name=TradeExpPosition]:checked").val() || ""; //radio button value;
        if (obj.UserCertificationTypeId == "2")
            obj.UserCertificationTypeName = "Experienced"; // Experienced
        else if (obj.UserCertificationTypeId == "1")
            obj.UserCertificationTypeName = "Qualified"; // Qualified
        else {
            obj.UserCertificationTypeName = "Qualified";
            obj.UserCertificationTypeId = 2;
        } // not experienced or qualified
        //obj = JSON.stringify(obj);

        AddUserTradeExp(obj);
    } else {
        return false;
    }
}

function SavePosition() {
    /*    var obj = {};
        obj.Id = $("#hdnPositionId").val();
        obj.PositionHeldId = $("#ddlPositionHeld").val();
        obj.UserId = currentUser.ID;
        obj.Experience = $("#txtExpPosition").val();
        obj.QualificationNumber = $("#txtQualPosition").val();
        obj.UserCertificationTypeId = $("input[name=CertifiedTypePosition]:checked").val(); //radio button value;
        //obj = JSON.stringify(obj);
        AddUserPositionHeld(obj);*/
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
        obj.UserId = currentUser.ID;
        obj.Name = $("#ddlPositionHeldText").val();
        obj.Experience = $("#txtExpPosition").val();
        obj.QualificationNumber = $("#txtQualPosition").val();
        obj.UserCertificationTypeId = $("input[name=CertifiedTypePosition]:checked").val(); //radio button value;
        if (obj.UserCertificationTypeId == "2")
            obj.UserCertificationTypeName = "Experienced"; // Experienced
        else if (obj.UserCertificationTypeId == "1")
            obj.UserCertificationTypeName = "Qualified"; // Qualified
        else {
            obj.UserCertificationTypeName = "Qualified";
            obj.UserCertificationTypeId = 2;
        } // not experienced or qualified
        //obj = JSON.stringify(obj);\

        AddUserPositionHeld(obj);
    } else {
        return false;
    }
}

function getEmpDetails() {
    // To group the list of Ticket etc
    triggerEmployeedetails();
    navigatePage("#listOfDetailsPage")
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

                toast('Position Updated Successfully');
                // Reset the fields
                $("#ddlPositionHeld").val("0").change(); // make the select value 0
                $("#txtQualPosition,#txtExpPosition").val("");
                $(".num,.exp").hide();
                $("input[name='CertifiedTypePosition']").removeAttr("checked").checkboxradio().checkboxradio("refresh");
                getEmpDetails();
                //redirectWithTimeout("UpdateProfile.html");
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
                if (localStorage.ueditTradeFlag == "true") {
                    $("#hdnTradeId").val(parseInt(localStorage.utradeIDSaved) + 1);
                } else
                    $("#hdnTradeId").val(parseInt($("#hdnTradeId").val()) + 1);
                toast('Trade Updated Successfully');
                // Reset the fields
                $("#ddlTradeExp").val("0").change(); // make the select value 0
                $("#txtQualTrade,#txtExpTrade").val("");
                $(".num,.exp").hide();
                $("input[name='TradeExpPosition']").removeAttr("checked").checkboxradio().checkboxradio("refresh");
                getEmpDetails();
                //redirectWithTimeout("UpdateProfile.html");
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
                if (localStorage.ueditLicenceFlag == "true") {
                    $("#hdnLicenceTypeId").val(parseInt(localStorage.ulicenceIDSaved) + 1);
                } else
                    $("#hdnLicenceTypeId").val(parseInt($("#hdnLicenceTypeId").val()) + 1);
                toast('Licence Updated Successfully');
                // Reset the fields
                $("#ddlLicence").val("0").change(); // make the select value 0
                $("#txtNumberlLicence,#txtLicenceExpiry,#txtExperience").val("");
                $(".num,.exp").hide();
                $("input[name='LicencePosition']").removeAttr("checked").checkboxradio().checkboxradio("refresh");
                getEmpDetails();
                // redirectWithTimeout("UpdateProfile.html");

            }
        },
        error: function() {
            hideWait();
            toast('Network Error');
        }
    });
}



function editLicence(id) {
    localStorage.ueditLicenceFlag = "true"; // make the edit licence true
    showWait();
    var url = serviceUrl + "Account/GetUserLicenceTicketType/";
    localStorage.selectedTicket = id;
    $.ajax({
        type: 'GET',
        url: url + id,
        data: {},
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                /*$.mobile.pageContainer.pagecontainer("change", "#addeditLicence", { transition: "slide" });
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
                }*/
                $.mobile.pageContainer.pagecontainer("change", "#addeditLicence", { transition: "slide" });
                $("#addLicenceBtn").text("Update");
                $("#delLicBtn").show(); // show delete licence button
                getActiveLicenceType(response.Result.LicenceTicketTypeId);
                //getLicenceTypDetail(licenceTicketList[count].LicenceTicketTypeId);
                localStorage.ulicenceIDSaved = $("#hdnLicenceTypeId").val();
                $("#hdnLicenceTypeId").val(response.Result.Id);
                $("#ddlLicence").val(response.Result.LicenceTicketTypeId).selectmenu("refresh").change();
                $("#txtExperience").val(response.Result.Experience);
                $("#txtNumberlLicence").val(response.Result.LicenceNumber);
                $("#txtLicenceExpiry").val(formatDate(response.Result.LicenceExpiry)); // show licence expiry date
                $("#dvLicence").show();
                $("#dvLicence .container").show();
                $("#dvLicence .exp").show();
                $("#expLicence,#qualLicence").attr("checked", false).checkboxradio().checkboxradio("refresh"); // uncheck the previously selected values
                if (response.Result.UserCertificationTypeId == "2") {
                    $("#expLicence").attr("checked", true).checkboxradio().checkboxradio("refresh");
                    $("#expLicence").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                    $("#dvLicence .num").hide();
                } else {
                    if (response.Result.UserCertificationTypeId == "1") {
                        $("#qualLicence").attr("checked", true).checkboxradio().checkboxradio("refresh");
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
    localStorage.selectedPosition = id;
    $.ajax({
        type: 'GET',
        url: url + id,
        data: {},
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                $.mobile.pageContainer.pagecontainer("change", "#addeditPosition", { transition: "slide" });
                /*                $("#hdnPositionId").val(response.Result.Id);
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
                                }*/
                $("#addPosBtn").text("Update"); // change the button text to edit
                $("#delPosBtn").show(); // show the delete button
                localStorage.upositionIDSaved = $("#hdnPositionId").val();
                $("#hdnPositionId").val(response.Result.Id);
                getActivePositionHeld(response.Result.PositionHeldId);
                //getPositionHeldDetail(positionHoldList[count].PositionHeldId);
                $("#ddlPositionHeld").val(response.Result.PositionHeldId);
                $("#txtExpPosition").val(response.Result.Experience);
                $("#txtQualPosition").val(response.Result.QualificationNumber);
                $("#dvPosition").show();
                $("#dvPosition .container").show();
                $("#dvPosition .exp").show();
                $("#expPosition,#qualPosition").attr("checked", false).checkboxradio().checkboxradio("refresh");
                if (response.Result.UserCertificationTypeId == "2") {
                    $("#expPosition").attr("checked", true).checkboxradio().checkboxradio("refresh");
                    $("#expPosition").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                    $("#dvPosition .num").hide();
                } else {
                    if (response.Result.UserCertificationTypeId == "1") {
                        $("#qualPosition").attr("checked", true).checkboxradio().checkboxradio("refresh");
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
    localStorage.selectedTradeID = id;
    var url = serviceUrl + "Account/GetUserTradeExp/";
    $.ajax({
        type: 'GET',
        url: url + id,
        data: {},
        success: function(response) {
            hideWait();
            if (response.IsSuccessful) {
                $.mobile.pageContainer.pagecontainer("change", "#addeditTrade", { transition: "slide" });
                /*$("#hdnTradeId").val(response.Result.Id);
                getActiveTradeExp(response.Result.TradeExperienceId);
                getTradeExpDetail(response.Result.TradeExperienceId);
                $("#ddlTradeExp").val(response.Result.TradeExperienceId);
                $("#txtExpTrade").val(response.Result.Experience);
                $("#txtQualTrade").val(response.Result.QualificationNumber);
                $("#dvTrade").show();
                $("#dvTrade .container").show();
                $("#dvTrade .exp").show();
                if (response.Result.UserCertificationTypeId == "1") {
                    $("#expTrade").attr("checked", true);
                    $("#expTrade").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                    $("#dvTrade .num").hide();

                } else {
                    if (response.Result.UserCertificationTypeId == "2") {
                        $("#qualTrade").attr("checked", true);
                        $("#qualTrade").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                        $("#dvTrade .num").show();
                    } else {
                        $("#dvTrade .container").hide();
                        $("#dvTrade .num").show();
                    }
                }*/
                $("#addTradeBtn").text("Update"); // change the button text to Edit
                $("#delTradeBtn").show(); // show the delete trade button    
                localStorage.utradeIDSaved = $("#hdnTradeId").val();
                $("#hdnTradeId").val(response.Result.Id);
                getActiveTradeExp(response.Result.TradeExperienceId);
                getTradeExpDetail(response.Result.TradeExperienceId);
                $("#ddlTradeExp").val(response.Result.TradeExperienceId);
                $("#txtExpTrade").val(response.Result.Experience);
                $("#txtQualTrade").val(response.Result.QualificationNumber);
                $("#dvTrade").show();
                $("#dvTrade .container").show();
                $("#dvTrade .exp").show();
                $("#expTrade,#qualTrade").attr("checked", false).checkboxradio().checkboxradio("refresh");
                if (response.Result.UserCertificationTypeId == "1") {
                    //console.warn("Experienced profile");
                    $("#expTrade").attr("checked", true).checkboxradio().checkboxradio("refresh");
                    $("#expTrade").prev().removeClass("ui-radio-off").addClass("ui-radio-on");
                    $("#dvTrade .num").hide();
                } else {

                    if (response.Result.UserCertificationTypeId == "2") {
                        //console.warn("Qualified profile");
                        $("#qualTrade").attr("checked", true).checkboxradio().checkboxradio("refresh");
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


function makeEditFalse(flagname) {
    // To intimate the code that it's an add not edit
    var manipulatedExpiryDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + (new Date().getFullYear() + 1);

    if (flagname == "editLicenceFlag") {
        localStorage.ueditLicenceFlag = "false";
        $("#txtNumberlLicence,#txtLicenceExpiry,#txtExperience").val(""); // clear input fields
        // $("#txtLicenceExpiry").val(manipulatedExpiryDate); // fill the manipulated date
        $("#delLicBtn").hide(); // hide the delete button
        $("#addLicenceBtn").text("Add"); // change the button text to add
        $("#ddlLicence").val("0").change(); // make the select value 0
        $("#expLicence,#qualLicence").attr("checked", false).checkboxradio().checkboxradio("refresh"); // uncheck the previously selected values
        $("#dvLicence").hide();
        $("#dvLicence .num").hide();
        $("#dvLicence .exp").hide();
        navigatePage("#addeditLicence");
    } else if (flagname == "editTradeFlag") {
        localStorage.ueditTradeFlag = "false";
        $("#txtQualTrade,#txtExpTrade").val("");
        $("#addTradeBtn").text("Add"); // change the button text to add
        $("#delTradeBtn").hide(); // hide the delete button
        $("#ddlTradeExp").val("0").change(); // make the select value 0
        $("#expTrade,#qualTrade").attr("checked", false).checkboxradio().checkboxradio("refresh"); // uncheck the previously selected values
        $("#dvTrade").hide();
        $("#dvTrade .num").hide();
        $("#dvTrade .exp").hide();
        navigatePage("#addeditTrade");
    } else if (flagname == "editPositionFlag") {
        localStorage.ueditPositionFlag = "false";
        $("#txtQualPosition,#txtExpPosition").val("");
        $("#addPosBtn").text("Add"); // change the button text to add
        $("#delPosBtn").hide(); // hide the delete button
        $("#ddlPositionHeld").val("0").change(); // make the select value 0
        $("#expPosition,#qualPosition").attr("checked", false).checkboxradio().checkboxradio("refresh"); // uncheck the previously selected values
        $("#dvPosition").hide();
        $("#dvPosition .num").hide();
        $("#dvPosition .exp").hide();
        navigatePage("#addeditPosition");
    }
}


function resetTheHiddenID(moduleName) {
    // To reset the hidden value to avoid confusion
    if (moduleName == "licencePage") {
        if (localStorage.ueditLicenceFlag == "true") {
            $("#hdnLicenceTypeId").val(parseInt(localStorage.ulicenceIDSaved));
            localStorage.ueditLicenceFlag = false;
        }

    } else if (moduleName == "positionsPage") {
        if (localStorage.ueditPositionFlag == "true") {
            $("#hdnPositionId").val(parseInt(localStorage.upositionIDSaved));
            localStorage.ueditPositionFlag = "false";
        }
    } else if (moduleName == "tradePage") {
        if (localStorage.ueditTradeFlag == "true") {
            $("#hdnTradeId").val(parseInt(localStorage.utradeIDSaved));
            localStorage.ueditPositionFlag = "false";
        }

    }
}
