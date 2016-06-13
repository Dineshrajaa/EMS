/* File Created: October 15, 2015 */
function validatePassword(el) {
    if ($(el).val().length > 0) {
        if ($(el).val().length < 6 || $(el).val().length > 18) {
            $("#spnError").html("pin length should be between 6 and 18 charactor");
            $(el).focus();
            return false;
        } else {
            $("#spnError").html("");
            return true;
        }
    }
    else {
        $("#spnError").html("Please enter pin");
        return false;
    }
}

function validateConfirmPassword(el) {
    if ($(el).val().length > 0) {
        if ($(el).val().trim() != $("#txtNewPassword").val().trim()) {
            $("#spnError").html("pin and confirm pin does not match");
            return false;
        } else {
            $("#spnError").html("");
            return true;
        }
    } else {
        $("#spnError").html("Please enter confirm pin");
        return false;
    }
}

function dochangePwd() {
    var currentPwdvalidate = validatePassword("#txtCurrentPassword");
    var pwdvalidate = validatePassword("#txtNewPassword");
    var cPwdvalidate = validateConfirmPassword("#txtVerifyPassword");
    if (currentPwdvalidate && pwdvalidate && cPwdvalidate) {
        changePassword($("#txtCurrentPassword").val(), $("#txtNewPassword").val(), $("#txtVerifyPassword").val());
    }
}

function changePassword(curPwd,newPwd,verPwd) {
    var url = serviceUrl + "api/mo/customers/password";
    var currentUserObj = localStorage.getItem('userSession');
    var jsonObj = {};
    jsonObj.currentPassword = curPwd;
    jsonObj.newPassword = newPwd;
    jsonObj.verifyPassword = verPwd;
    if (currentUserObj && currentUserObj != 'undefined') {
        var currentUser = JSON.parse(currentUserObj);
        jsonObj.access_token = currentUser._id;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: jsonObj,
        async: false,
        success: function (result) {
            toast(result.message);
            $('input').val("");
        },
        error: function (result) {
            $('input').val("");
            toast(JSON.parse(result.responseText).message);
        }
    });
}