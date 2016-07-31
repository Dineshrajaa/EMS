/* File Created: October 15, 2015 */
$(document).on("ready", function () {
    GetAssignPost();
});
function GetAssignPost() {
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
            if (result.IsSuccessful) {
                if (result.Result) {
                    for (var i = 0; i < result.Result.length; i++) {
                        var url = (result.Result[i].FileUrl && result.Result[i].FileUrl != "") ? result.Result[i].FileUrl : "--";
                        var row = "<tr class='grid-row'>" +
                                //"<td rowName='JobFrequencyDate'>" + result.Result[i].FrequencyDate + "</td>" +
                                "<td rowName='JobMessage'>" + result.Result[i].Message + "</td>" +
                                "<td rowName='JobFrequencyType'>"+url+"</td>" +
                                "</tr>";
                        $("#tblJobsList tbody").append(row);
                    }
                }
            }
          }, error: function (err) {
            hideWait();
            toast("Network Error");
        }
    });
}