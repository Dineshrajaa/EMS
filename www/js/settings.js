$("#statusCheck").change(function() {
    if ($(this).is(":checked")) {
        $("#statusBlock").show();
    } else {
        $("#statusBlock").hide();
        $("#txtTime").val("");
        $("#frequencySelect").val(0).selectmenu().selectmenu("refresh");
        localStorage.savedLNPref="";
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
    var notiSetObj={};
    notiSetObj.notificationTime=$("#txtTime").val();
    notiSetObj.frequency=$("#frequencySelect").val();
    localStorage.savedLNPref=JSON.stringify(notiSetObj);

    //var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

    cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Dowells',
        text: 'Do you like to update your profile status?',
        at: notificationTime,
        every:$("#frequencySelect").val()
    });
}


function restoreLNPref(){
    // To restore the saved local notification preference
    if(localStorage.savedLNPref!=undefined&&localStorage.savedLNPref!=""){
        var savedLNPref=JSON.parse(localStorage.savedLNPref);
        $("#statusCheck").attr("checked",true).flipswitch().flipswitch("refresh");
        $("#txtTime").val(savedLNPref.notificationTime);
        $("#frequencySelect").val(savedLNPref.frequency).selectmenu().selectmenu("refresh");
    }
}
