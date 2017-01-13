function getUserMessages() {
    showWait();
    var currentUserObj = localStorage.getItem('userSession');
    var currentUser = JSON.parse(currentUserObj);
    var url = serviceUrl + "Account/GetUserMessages";
    var jsonObj = new Object();
    jsonObj.userId = currentUser.ID;
    $.ajax({
        type: "GET"
        , url: url
        , data: jsonObj
        , async: false
        , success: function (result) {
            var messageHtml = "";
            if (result.IsSuccessful) {
                if (result.Result.length > 0) {
                    for (var i = 0; i < result.Result.length; i++) {
                        var tempResult = result.Result[i];
                        messageHtml += '<div class="box"><br/>';
                        messageHtml += '<center><span style="font-size:14px;">' + tempResult.SendDateStr + '</span></center>';
                        messageHtml += '<div class="nd2-card">';
                        messageHtml += '<p class="messageP">' + tempResult.Message + '</p>';
                        messageHtml += '</div>';
                        messageHtml += '<span class="messageAuthor">' + tempResult.SendBy + '</span>';
                        messageHtml += '</div>';
                    }
                    $("#messageList").html(messageHtml).trigger("create");
                }
                else {
                    toast("No Message Found.");
                }
            }
        }
        , error: function (err) {
            hideWait();
            toast("Network Error");
        }
    });
}

function getFormattedDate(sensDate) {
    var newDate = new Date(sensDate);
    var day = parseInt(newDate.getDate()) < 10 ? "0" + newDate.getDate() : newDate.getDate();
    var cd = newDate.getDay() + ", " + day + newDate.getMonth() + newDate.getTime();
    return cd;
}