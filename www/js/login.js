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
    }
    else {
        //delete session object
       // deleteLocalStorage(["userSession"]);
    }

    $('body').on('keypress', 'input', function (args) {
        if (args.keyCode == 13) {
            dologIn($("#txtUserName").val().trim(), $("#txtPassword").val().trim());
        }
    });

});
function dologIn() {
    logIn($("#txtUserName").val().trim(), $("#txtPassword").val().trim());
    var currentUserObj = localStorage.getItem('userSession');
    if (currentUserObj && currentUserObj != 'undefined') {
        routing("Dashboard.html", ["js/trainerList.js"], [], "trainerList", "", "index");
    }
}

 