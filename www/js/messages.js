function getUserMessages() {
    // To get the list of messages for the currently logged in user
    showWait();

    var currentUserObj = localStorage.getItem('userSession');
    var currentUser = JSON.parse(currentUserObj);

    var url = serviceUrl + "Account/GetUserMessages";
    var jsonObj = new Object();
    jsonObj.userId = currentUser.ID;
    $.ajax({
        type: "GET",
        url: url,
        data: jsonObj,
        async: false,
        success: function(result) {
        	var messageHtml="";
            if (result.IsSuccessful) {
                if (result.Result.length>0) {
                	
                    for (var i = 0; i < result.Result.length; i++) {
                    	var tempResult=result.Result[i];
                        messageHtml+='<div class="box">';
                        messageHtml+='<center>'+tempResult.SendDate+'</center>';
                        messageHtml+='<div class="nd2-card">';
                        messageHtml+='<p class="messageP">'+tempResult.Message+'</p>';
                        messageHtml+='</div>';
                        messageHtml+='<span class="messageAuthor">'+tempResult.SendBy+'</span>';
                        messageHtml+='</div>';
                    }
                    $("#messageList").html(messageHtml).trigger("create");
                }
            }
        },
        error: function(err) {
            hideWait();
            toast("Network Error");
        }
    });
}
