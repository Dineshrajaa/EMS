var serviceUrl = 'http://202.60.69.12/emsapi/api/';

$(document).ajaxStart(function () {
    showWait();
});

$(document).ajaxComplete(function () {
    hideWait();
});

$(document).ajaxError(function () {
    hideWait();
});

//function Show and Hide Busy Indicator
function showWait() {
    $.mobile.loading("show", {
        text: "Please wait",
        textVisible: true,
        theme: "b",
        textonly: false,
        html: ""
    });
}

    $(".panelBtn").on("click",function(){
        $('#profileDetailsPage').unblock();
    });

$(document).bind("mobileinit", function () {
    $.extend($.mobile, {
        defaultPageTransition: 'none'
    });

    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
});


function hideWait() {
    $.mobile.loading("hide");
}

//Call Busy Indicator default when call ajax , and hide when ajax complerte
$(document).ajaxStart(function () { showWait(); }).ajaxStop(function () { hideWait(); });

function routing(pageName, jsArray, cssArray, fileclass, removeId, removeBodyId) {
    window.location.href = pageName;
}

function deleteLocalStorage(storageIdArray) {
    for (var i = 0; i < storageIdArray.length; i++) {
        localStorage.removeItem(storageIdArray[i]);
    }
}
function toast(message) {
    new $.nd2Toast({
        message: message,
        action: {},
        ttl: 3000
    });
}
//(string username, string password, string isWebApp)
function logIn(userName, password) {
    if (userName.length > 0 && password.length > 0) {
        showWait();
        var url = serviceUrl + "Account/AuthenticateUser";
        var jsonObj = new Object();
        jsonObj.username = userName;
        jsonObj.password = password;
        jsonObj.isWebApp = true;
        $.ajax({
            type: "GET",
            url: url,
            data: jsonObj,
            async: false,
            success: function (result) {
                hideWait();
                if (result.IsSuccessful) {
                    var data = JSON.stringify(result.Result);
                    localStorage.setItem('userSession', data);
                    toast('Sign In Successful');
                } else {
                    toast('Incorrect username or pin');
                }
            },
            error: function (result) {
                hideWait();
                toast("Some Error Occoured.");
                // alert(JSON.parse(result.responseText).message);
            }
        });
    }
    else {
        if (userName.length === 0) {
            toast("Please enter Username");
            $("#txtUserName").focus();
        }
        else if (password.length === 0) {
            toast("Please enter PIN");
            $("#txtPassword").focus();
        }
    }
}

Date.prototype.getFormattedTime = function () {
    var hours = this.getHours() == 0 ? "12" : this.getHours() > 12 ? this.getHours() - 12 : this.getHours();
    var minutes = (this.getMinutes() < 10 ? "0" : "") + this.getMinutes();
    var ampm = this.getHours() < 12 ? "AM" : "PM";
    var formattedTime = hours + ":" + minutes + " " + ampm;
    return formattedTime;
};

Date.prototype.getFormattedDateInddMMYY = function () {

    var mon = parseInt(parseInt(this.getMonth()) + 1) < 10 ? "0" + parseInt(parseInt(this.getMonth()) + 1) : parseInt(parseInt(this.getMonth()) + 1);
    var day = parseInt(this.getDate()) < 10 ? "0" + this.getDate() : this.getDate();
    var year = this.getFullYear();

    return day + "/" + mon + "/" + year;
};

function doLogout() {
    localStorage.removeItem('userSession');
    window.location.href = "index.html";
}

function redirect(url) {
    showWait();
    //$(":mobile-pagecontainer").pagecontainer("change", url);
    window.location.href = url;
    //setTimeout(function () { $.mobile.changePage(url, { transition: "slide" }); }, 1);
}

function navigatePage(url){
    // To navigate to the page
    $(":mobile-pagecontainer").pagecontainer("change", url);
}

//Job
function GetAssignJob() {
    showWait();

    var currentUserObj = localStorage.getItem('userSession');
    var currentUser = JSON.parse(currentUserObj);

    var url = serviceUrl + "Account/GetJobAssignedByUserId";
    var jsonObj = new Object();
    jsonObj.userId = currentUser.ID;
    $.ajax({
        type: "GET",
        url: url,
        data: jsonObj,
        async: false,
        success: function (result) {
            if (result.IsSuccessful) {
                if (result.Result) {
                    var resultObj = result.Result;
                    $("#spnCompany").html(resultObj.BusinessName);
                    $("#spnJobNumber").html(resultObj.Number);
                    $("#spnClient").html(resultObj.Client);
                    $("#spnProject").html(resultObj.Location);
                    $("#spnProjAddress").html(resultObj.LocationAdress);
                    $("#spnTrade").html(resultObj.TradeClassification);
                    $("#spnStartDate").html(resultObj.StartDate);
                    $("#spnMessage").html(resultObj.Message);
                    $("#spnDesc").html(resultObj.Name);
                    $("#spnContract").html(resultObj.ContractType);
                }
            }

        }, error: function (err) {
            hideWait();
            toast("Network Error");
        }
    });
}

// Post
function GetAllAssignedPost() {
    showWait();
    var currentUserObj = localStorage.getItem('userSession');
    var currentUser = JSON.parse(currentUserObj);
    var url = serviceUrl + "Account/GetAssignedPostsByUserId";
    var jsonObj = new Object();
    jsonObj.userId = currentUser.ID;

    $.ajax({
        type: "GET",
        url: url,
        data: jsonObj,
        async: false,
        success: function (result) {
            hideWait();

        }, error: function (err) {
            hideWait();
            toast("Network Error");
        }
    });
}

function GetPostDetailBy(postId) {
    showWait();
    var url = serviceUrl + "Account/GetPostById";
    var jsonObj = new Object();
    jsonObj.postId = postId;

    $.ajax({
        type: "GET",
        url: url,
        data: jsonObj,
        async: false,
        success: function (result) {
            hideWait();
        }, error: function (err) {
            hideWait();
            toast("Network Error");
        }
    });
}