$("#statusCheck").change(function() {
    if ($(this).is(":checked")) {
        $("#statusBlock").show();
    } else {
        $("#statusBlock").hide();
    }
});

function saveLNPref() {
    // To save the local notification preference
    if($("#txtTime").val()==""){
    	toast("Please select the time for notification");
    	return;
    }else if($("#frequencySelect").val()=="0"){
    	toast("Please choose the frequency of notification");
    	return;
    }

    var  notificationTime = new Date($("#txtTime").val());

    //var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

    cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Dowells',
        text: 'Do you like to update your profile status?',
        at: notificationTime,
        every:$("#frequencySelect").val(),
        badge: 12
    });
}
