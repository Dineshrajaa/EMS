localStorage.serviceUrl=localStorage.serviceUrl||'http://52.62.179.135/EMSAPI/api/'; // Production
localStorage.serviceUrl=localStorage.serviceUrl||'http://52.62.179.135/EMSAPI/api/'; //dev 
var serviceUrl=localStorage.serviceUrl; 
$(document).ajaxStart(function() {
    showWait();
});
$(document).ajaxComplete(function() {
    hideWait();
});
$(document).ajaxError(function() {
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
$(".panelBtn").on("click", function() {
    $('#profileDetailsPage,#avatarPage').unblock();
});
$(document).bind("mobileinit", function() {
    $.extend($.mobile, {
        defaultPageTransition: 'none'
    });
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
});

document.addEventListener("resume", onResume, false);

function onResume() {
    // Handle the resume event
for(var i = 0; i  < 100 ; i++){
console.log('Wait');    
}   

if(localStorage.getItem('userSession')){
    redirect('Dashboard.html');    
} else {
    window.location.href = "index.html";
}
    

}

function hideWait() {
    $.mobile.loading("hide");
}
//Call Busy Indicator default when call ajax , and hide when ajax complerte
$(document).ajaxStart(function() {
    showWait();
}).ajaxStop(function() {
    hideWait();
});

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
    // registerPush();
    if (userName.length > 0 && password.length > 0) {
        showWait();
        var url = serviceUrl + "Account/AuthenticateUser";
        var jsonObj = new Object();
        jsonObj.username = userName;
        jsonObj.password = password;
        jsonObj.isWebApp = false;
        jsonObj.deviceId = localStorage.pushRegID || "";
        jsonObj.deviceTypeId = device.platform == "Android" ? 2 : 1;
        $.ajax({
            type: "GET",
            url: url,
            data: jsonObj,
            async: false,
            success: function(result) {
                hideWait();
                if (result.IsSuccessful) {
                    var data = JSON.stringify(result.Result);
                    localStorage.setItem('userSession', data);
                    toast('Sign In Successful');
                } else {
                    switch (result.MessageType) {
                        case 10:
                            $("#statusMsg").addClass("(pending)");
                            $("#statusMsg").text("(Applicant login pending)");
                            break;
                        case 5:
                            $("#statusMsg").addClass("(declined)");
                            $("#statusMsg").text("(Applicant login declined)");
                            break;
                        default:
                            $("#statusMsg").text("");
                            toast('Incorrect username or pin');
                    }
                }
            },
            error: function(result) {
                hideWait();
                toast("Some Error Occoured.");
                // alert(JSON.parse(result.responseText).message);
            }
        });
    } else {
        if (userName.length === 0) {
            toast("Please enter Username");
            $("#txtUserName").focus();
        } else if (password.length === 0) {
            toast("Please enter PIN");
            $("#txtPassword").focus();
        }
    }
}
Date.prototype.getFormattedTime = function() {
    var hours = this.getHours() == 0 ? "12" : this.getHours() > 12 ? this.getHours() - 12 : this.getHours();
    var minutes = (this.getMinutes() < 10 ? "0" : "") + this.getMinutes();
    var ampm = this.getHours() < 12 ? "AM" : "PM";
    var formattedTime = hours + ":" + minutes + " " + ampm;
    return formattedTime;
};
Date.prototype.getFormattedDateInddMMYY = function() {
    var mon = parseInt(parseInt(this.getMonth()) + 1) < 10 ? "0" + parseInt(parseInt(this.getMonth()) + 1) : parseInt(parseInt(this.getMonth()) + 1);
    var day = parseInt(this.getDate()) < 10 ? "0" + this.getDate() : this.getDate();
    var year = this.getFullYear();
    return day + "/" + mon + "/" + year;
};

function doLogout() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('serviceUrl');
    window.location.href = "index.html";
    unsubscribePush();
}

function redirect(url) {
    showWait();
    //$(":mobile-pagecontainer").pagecontainer("change", url);
    window.location.href = url;
    //setTimeout(function () { $.mobile.changePage(url, { transition: "slide" }); }, 1);
}

function navigatePage(url) {
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
        success: function(result) {
            if (result.IsSuccessful) {
                if (result.Result) {
                    var resultObj = result.Result;
                    $("#spnCompany").html(resultObj.BusinessName);
                    $("#spnJobNumber").html(resultObj.Number);
                    $("#spnClient").html(resultObj.Client);
                    $("#spnProject").html(resultObj.Location);
                    $("#spnProjAddress").html(resultObj.LocationAdress);
                    $("#spnTrade").html(resultObj.TradeClassification);
                    $("#spnStartDate").html(resultObj.StartDateStr);
                    $("#spnMessage").html(resultObj.Message);
                    $("#spnDesc").html(resultObj.Name);
                    $("#spnContract").html(resultObj.ContractType);
                }
            } else {
                $("#currentJob").html("");
                $("#currentJob").append("<h4>There are no current jobs</h4>");
            }
        },
        error: function(err) {
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
        success: function(result) {
            hideWait();
        },
        error: function(err) {
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
        success: function(result) {
            hideWait();
        },
        error: function(err) {
            hideWait();
            toast("Network Error");
        }
    });
}

function fillProfilePicture() {
    // To fill the profile picture in the menu
    var currentUserObj = localStorage.getItem('userSession');
    if (currentUserObj && currentUserObj != 'undefined' && currentUserObj != null) {
        currentUserObj = JSON.parse(currentUserObj);
        if (currentUserObj.ProfilePicture != ""&&currentUserObj.ProfilePicture !=null) {
            if ((currentUserObj.ProfilePicture).indexOf("data:image/jpeg;base64,") == -1) currentUserObj.ProfilePicture = "data:image/jpeg;base64," + currentUserObj.ProfilePicture;
        }
        var profileImage = currentUserObj.ProfilePicture == "" ? "img/avtar.png" : currentUserObj.ProfilePicture;
        //document.getElementById("imgUserImage").src=profileImage;
        $("#imgUserImage").attr("src", profileImage);
    }
}
$(document).on("pageinit", "#profileDetailsPage,#avatarPage", function() {
    $("#cameraTypeList").on("panelclose", function(event, ui) {
        //remove the overlay
        $("#profileDetailsPage,#avatarPage").unblock();
    });
});

function unsubscribePush() {
    var push = PushNotification.init({
        android: {
            senderID: "739681536553"
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });
    push.unregister(function() {
        console.log('successfully unsubscribed');
    }, function() {
        console.log('error');
    });
}

function convertUIDateToDb(inputDate) {
    // Method to convert ui date to db format
    var ret = Date.parse(inputDate);
    return "\\/Date(" + ret + ")\\/";
}

function formatDate(dateToManipulate,lineSplitter) {
    // To format the date for showing licence expiry
    var lineSplitter=lineSplitter||'-';
    var ed = new Date(dateToManipulate);
    var date = ed.getDate() < 10 ? "0" + ed.getDate() : ed.getDate();
    var month = (parseInt(ed.getMonth()) + 1);
    var formattedMonth = month < 10 ? "0" + month : month;
    var expiryDate = date + lineSplitter + formattedMonth + lineSplitter + ed.getFullYear();
    return expiryDate;
}

function formatDateAndTime(dateToManipulate){
    // To format the date and time for showing in job
    var ed = new Date(dateToManipulate);
    var date = ed.getDate() < 10 ? "0" + ed.getDate() : ed.getDate();
    var month = (parseInt(ed.getMonth()) + 1);
    var formattedMonth = month < 10 ? "0" + month : month;
    var time=parseInt(ed.getHours());
    var minutes=parseInt(ed.getMinutes());
    var formatedDate=date+'/'+formattedMonth+'/'+ed.getFullYear()+' '+time+':'+minutes;
    return formatedDate;
}

function registerPush() {
    // To register the device for push notification
    try {
		
        window.push = PushNotification.init({
            android: {
                senderID: "739681536553",
                forceShow: true
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true",
                clearBadge: "true"
            },
            windows: {}
        });
    } catch (error) {
        jAlert(error)
    }
    window.push.on('registration', function(data) {
        //I can get registration id here        
        localStorage.pushRegID = data.registrationId;
    });
    window.push.on('notification', function(data) {
               
        // if(data.additionalData.payload){        
          
        //   if(data.additionalData.payload === "message"){
        //     navigatePage('message.html');           
           
        //   } else {           
        //     navigatePage('dashboard.html');  
        //   }         

        // } else {
        //     jAlert('Inconvience Regreted');
        // }
       
		
        // if (typeof data.additionalData.payload != undefined) {
        //     //console.warn("additionalData:" + data.additionalData.payload);
        //     if (data.additionalData.payload == "message") {
        //         // window.location.href = "messages.html";
        //         navigatePage('message.html');
        //     } else {
        //         // window.location.href = "dashboard.html";
        //         navigatePage('dashboard.html');
        //     }
        // }
       
    });
    window.push.on('error', function(e) {
        console.log("push error:" + e.message);
    });
}
document.addEventListener("deviceready", function() {
    if (device.platform == "iOS") {
        StatusBar.overlaysWebView(false); // to avoid overlay of splashscreen over the app 
    }
    StatusBar.backgroundColorByHexString("#0CACEB"); // to change the header color of the app
    registerPush();
}, true);

function jAlert(message) {
    var iframe = document.createElement("IFRAME");
    iframe.setAttribute("src", '');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(message);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
}


function getStatus() {
        //alert('in Get Status');
           //alert('In Get Status');
            var currentUserObj = localStorage.getItem('userSession');
            var currentUser = JSON.parse(currentUserObj);
            var url = serviceUrl + "Account/GetUserStatus";
            var obj = {};
            obj.id = parseInt(currentUser.ID);
            showWait();

            $.ajax({
                type: "GET"
                , url: url
                , data: obj
                , async: false
                , success: function (result) {

                    if (result.IsSuccessful) {
                        if (result.Result == "1") {
                            $(".statusButton,#divStatusChange").hide();
                            $("#curStatus").html('WORKING'); $("#curStatus").parent().removeClass('notAvailable').removeClass('available').removeClass('pending').addClass('working');
                            $("#currentJob,.finishJob").show();
                        }
                        if (result.Result == "3") {
                            $("#curStatus").html('NOT AVAILABLE'); $("#curStatus").parent().removeClass('working').removeClass('available').removeClass('pending').addClass('notAvailable');
                            $(".checkToNA").hide();
                            $(".checkAvailable").show();
                            $("#divStatusChange").show();
                            $("#currentJob,.finishJob").hide();
                        }
                        else {
                            $("#curStatus").html('AVAILABLE');
                            $("#curStatus").parent().removeClass('working').removeClass('notAvailable').removeClass('pending').addClass('available');
                            $(".checkToNA").show();
                            $(".checkAvailable").hide();
                            $("#divStatusChange").show();
                            $("#currentJob,.finishJob").hide();
                        }
                    }
                    hideWait();
                }
                , error: function (err) {
                    hideWait();
                    toast("Network Error");
                }
            });
        }