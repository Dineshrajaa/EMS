/* File Created: October 26, 2015 */

function fetchBookingHistory(tranieeId) {
    var jsonObj = {};
    jsonObj.trne = tranieeId;
    showWait();
    $.ajax({
        type: "GET",
        url: serviceUrl + "pre-bookings",
        data: jsonObj,
        async: false,
        success: function (result) {
            var orderListContent = '';
           
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var img = (result[i].trnr && result[i].trnr.pp) ? serviceUrl + "image/" + result[i].trnr.pp.guid : "img/avtar.png";
                    var name = (result[i].trnr) ? 'by ' + result[i].trnr.firstName + " " + result[i].trnr.lastName : "";
                    orderListContent += '<div class="nd2-card card-media-right card-media-medium">' +
                                       '<div class="card-media"><img src=' + img + ' class="img_circle"></div>' +
                                       '<div class="card-title">' +
                                       '<h3 class="card-primary-title cstmcardprimarytitle">' + result[i].stt + '</h3>' +
                                       '<label > ' + name + '</label>' +
                                       '<label ><span>' + userCurrency + ' </span> <span class="spnSessionAmount">' + result[i].amount.toString() + '</span></label>' +
                                       '<label>Order Id:' + result[i].orderId + '</label>' +
                                       '</div>' +
                                       '<div class="card-action cstmAction">' +
                            '<div class="row between-xs">' +
                            '<div class="col-xs-12">' +
                            '<div class="box">' +
                            //'<span class="actionInfo cstmactionInfo"><i class="zmdi zmdi-calendar-check zmd-fw"></i> ' + new Date(result[i].st.frm).getFormattedDate() + '</span>' +
                         '<span class="actionInfo cstmactionInfo">' + "    " + new Date(result[i].dt).getFormattedDate() + "    " + new Date(result[i].slotFrom).getFormattedTime() + '</span>' +
                            //'<span class="actionInfo floatright cstmactionInfo" ><i class="zmdi zmdi-time zmd-fw"></i> ' + getSessionTime(result[i].st.frm, data[i].st.to) + '</span>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

//                    orderListContent += '<div class="nd2-card card-media-right card-media-medium">' +
//                                       '<div class="card-media"><img src=' + img + '></div>' +
//                                       '<div class="card-title">' +
//                                       '<span class="card-primary-title">' + result[i].stt + '</span>' +
//                                       '<label>Trainer: ' + result[i].trnr.firstName + " " + result[i].trnr.lastName + '</label>' +
//                                       '<label class="">' + new Date(result[i].dt).getFormattedDate() + "    " + new Date(result[i].slotFrom).getFormattedTime() + '</label>' +
//                                       '<label>Order Id:' + result[i].orderId + '</label>' +
//                                       '<label>Amount: ' + userCurrency + " " + result[i].amount.toString() + '</label>' +
//                                       '</div></div>';

                }

            }
            else {
                orderListContent += '<i class="zmdi zmdi-face"></i> No Record Found !!';
            }
            $("#dvOrderList").append(orderListContent);
            hideWait();
        },
        error: function () {
            alert("Error");
            hideWait();
        }
    });
}
$(document).on("ready", function () {
  var currentUserObj = localStorage.getItem('userSession');
    if (currentUserObj && currentUserObj != 'undefined') {
     var currentUser = JSON.parse(currentUserObj);
        fetchBookingHistory(currentUser._id);
    }
});
       