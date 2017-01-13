$("#statusCheck").change(function() {
    if ($(this).is(":checked")) {
        $("#statusBlock").show();
    } else {
        $("#statusBlock").hide();
        $("#txtTime").val("");
        $("#frequencySelect").val(0).selectmenu().selectmenu("refresh");
        localStorage.savedLNPref = "";
        cordova.plugins.notification.local.cancel(0, false);
    }
});

function timeToNowGMT(value) {
    var time = value;
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    if (hours >= 24) hours = hours - 24;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    //console.warn("hours:" + hours + "minutes:" + minutes + "sHours:" + sHours + "sMinutes:" + sMinutes);
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes + ":00");
}

function saveLNPref() {
    // To save the local notification preference
    if ($("#txtTime").val() == "") {
        toast("Please select the time for notification");
        return;
    } else if ($("#frequencySelect").val() == "0") {
        toast("Please choose the frequency of notification");
        return;
    }
    //var n_format_time = timeToNowGMT($("#txtTime").val());
    var now = new Date();
    var time = $("#txtTime").val();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2)
    var dateSplit = now.getFullYear() + '-' + month + '-' + day + " " + time; //'T' + n_format_time;
    var notificationTime = new Date((dateSplit).replace(/-/g, "/")).getTime(); // new Date(dateSplit).toUTCString();
    //console.warn($("#txtTime").val() + "" + notificationTime);
    var notiSetObj = {};
    notiSetObj.notificationTime = $("#txtTime").val();
    notiSetObj.frequency = $("#frequencySelect").val();
    localStorage.savedLNPref = JSON.stringify(notiSetObj);

    //var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
    /* var now = new Date().getTime(),
         _5_sec_from_now = new Date(now + 5 * 1000);
     cordova.plugins.notification.local.schedule({
         id: 1,
         title: 'Dowells',
         text: 'Do you like to update your profile status?',
         at: _5_sec_from_now,
         every: $("#frequencySelect").val()
     });*/
    cordova.plugins.notification.local.on("click", function(notification) {
        if (device.platform == 'iOS') {
            cordova.plugins.notification.badge.clear(); // clear the batch
        }
    });
    cordova.plugins.notification.local.schedule({
        // title: 'Dowells',
        text: "Please check that your work availability status is correct",
        every: $("#frequencySelect").val(),
        at: new Date(notificationTime)

    }, function() { //console.warn("configured local notification") 
    });
    cordova.plugins.notification.local.on("schedule", function(notification) {
        //console.log("scheduled: " + notification.id);
        toast("Saved settings");
    });
}


function restoreLNPref() {
    // To restore the saved local notification preference
    if (localStorage.savedLNPref != undefined && localStorage.savedLNPref != "") {
        var savedLNPref = JSON.parse(localStorage.savedLNPref);
        $("#statusCheck").attr("checked", true).flipswitch().flipswitch("refresh");
        $("#txtTime").val(savedLNPref.notificationTime);
        $("#frequencySelect").val(savedLNPref.frequency).selectmenu().selectmenu("refresh");
    }
    checkTestRole();
}

function checkTestRole() {
    var currentUserObj = JSON.parse(localStorage.getItem('userSession'));
    if (currentUserObj && currentUserObj != 'undefined') {
        if (currentUserObj.RoleId == "5") {
            $("#serviceChangerBlock").show();
            if (serviceUrl == 'http://52.63.234.33/EMSAPI/api/') {
                $("#serviceChanger").attr("checked", true).flipswitch().flipswitch("refresh");
                $("#serviceType").html("<b>Development</b>")
            } else if (serviceUrl == 'http://52.63.234.33/EMSAPI/api/') {
                $("#serviceChanger").attr("checked", false).flipswitch().flipswitch("refresh");
                $("#serviceType").html("<b>Production</b>")
            }
        }
    }
}
$("#serviceChanger").change(function() {
    var message = "Do you want to change to Development server?You will be logged out and settings will be saved."
    if ($(this).is(":checked")) {
        navigator.notification.confirm(message, function(buttonIndex) {
            if (buttonIndex == 1) {
                localStorage.serviceUrl = 'http://52.63.234.33/EMSAPI/api/';
                serviceUrl = 'http://52.63.234.33/EMSAPI/api/';
                localStorage.removeItem('userSession');
                window.location.href = "index.html";
            }
        });

    } else {
        localStorage.serviceUrl = 'http://52.63.234.33/EMSAPI/api/';
        serviceUrl = 'http://52.63.234.33/EMSAPI/api/';
    }
    checkTestRole();
});
