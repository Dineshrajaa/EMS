function showTrainerList() {
    // routing("TrainerList.html", ["js/trainerList.js"], [], "trainerList", "", "index");
}

function showSignin() {
    $(".signIn").css("display", "block");
    $(".windowBlck h3").html("Sign In");
    // $("body").css({ backgroundImage: "url('img/splash.JPG')" });
    $(".btnSection").css("display", "none");
}

function showforgotPwd() {
    $(".signIn").css("display", "block");
    $(".windowBlck h3").html("Forgot Pin");
}

function hideSignin() {
    $(".signIn").css("display", "none");
    //  $("body").css({ backgroundImage: "url('img/bgsmall1.JPG')" });
    //    $("body").css("background-image", "url('img/bgsmall1.JPG')");
    $(".btnSection").css("display", "inline-block");
}
$(document).on('ready', function () {
    var currentUserObj = localStorage.getItem('userSession');
    if (currentUserObj && currentUserObj != 'undefined') {
        redirect("Dashboard.html");
    } else {
        //delete session object
        // deleteLocalStorage(["userSession"]);
    }

    $('body').on('keypress', 'input', function (args) {
        if (args.keyCode == 13) {
            dologIn($("#txtUserName").val().trim(), $("#txtPassword").val().trim());
        }
    });


});

function registerPush() {
    // To register the device for push notification
	try {
    var push = PushNotification.init({
        android: {senderID: "739681536553"},
        ios: {alert: "true",badge: "true",sound: "true"},
        windows: {}
    });
	}catch(error){
		alert(error)
	}

    push.on('registration', function (data) {
        //I can get registration id here        
        localStorage.pushRegID = data.registrationId;
    });

    push.on('notification', function (data) {
	    //this place doesn't work
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
    });

    push.on('error', function (e) {
         console.log("push error:" + e.message);
    });
}

function dologIn() {
    logIn($("#txtUserName").val().trim(), $("#txtPassword").val().trim());
    var currentUserObj = localStorage.getItem('userSession');
    if (currentUserObj && currentUserObj != 'undefined') {
        routing("Dashboard.html");
    }
}

document.addEventListener("deviceready", function () {
    if (device.platform == "iOS") {
        StatusBar.overlaysWebView(false); // to avoid overlay of splashscreen over the app 
    }
    StatusBar.backgroundColorByHexString("#0CACEB"); // to change the header color of the app
    registerPush();
}, true);
