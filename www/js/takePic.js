document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
function capturePhoto() {
    window.navigator.camera.getPicture(onPhotoDataSuccessCapture, onFail, { quality: 4, destinationType: Camera.DestinationType.FILE_URI, correctOrientation: true });
}

function onPhotoDataSuccessCapture(imageURI) {
    $("#imgProfile").attr("src", imageURI);
}

// Called if something bad happens.

function onFail(message) {
    //jAlert('Failed because: ' + message);
}

//function movePic(file) {
//    // jAlert('move pic');
//    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError);
//}

//// Callback function when the file system uri has been resolved

//function resolveOnSuccess(entry) {
//    var imgname = guid();
//    var d = new Date();
//    var n = d.getTime();
//    // jAlert('resolve');

//    var newFileName = imgname + ".jpg";
//    var dailyReportId = window.localStorage.getItem("CreateNewDailyReportId");
//    var myFolderApp = "DMS/DailyReport/" + dailyReportId;

//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
//        //The folder is created if doesn't exist
//        fileSys.root.getDirectory(myFolderApp,
//                    { create: true, exclusive: false },
//                    function (directory) {
//                        entry.moveTo(directory, newFileName, successMove, resOnError);
//                    },
//                    resOnError);
//    },
//                             resOnError);
//}

//// Callback function when the file has been moved successfully - inserting the complete path
//function successMove(entry) {
//    //Store imagepath in session for future use
//    // like to store it in database
//    //jAlert("Successfully Saved to phone");
//    sessionStorage.setItem('imagepath', entry.fullPath);
//    fetchFotos();
//}

//function resOnError(error) {
//    jAlert(error.code);
//}


//----------------------------------------------From Library------------------------------------------


function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 80,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: false,
        sourceType: source,
        allowEdit: true
    });
}

// Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {
    //jAlert("Photo URI Success");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, FileIO.gotFS, FileIO.errorHandler);
    FileIO.updateCameraImages(imageURI);
}

// Called if something bad happens.
function onFail(message) {
    console.log('Failed because: ' + message);
}
// set some globals
var gImageURI = '';
var gFileSystem = {};

var FileIO = {

    // sets the filesystem to the global var gFileSystem
    gotFS: function (fileSystem) {
        // jAlert("Got FS Success");
        gFileSystem = fileSystem;
    },

    // pickup the URI from the Camera edit and assign it to the global var gImageURI
    // create a filesystem object called a 'file entry' based on the image URI
    // pass that file entry over to gotImageURI()
    updateCameraImages: function (imageURI) {

        gImageURI = imageURI;
        $("#imgProfile").attr("src", imageURI);

        //var imgProfile = '<div class="smallImage" style="margin-left:45px;width:120px;height:100px;float:left;margin-top:10px;"><img id="smallImage"  src="' + imageURI + '" style="width:100px;height:100px;float:left" /></div>';


        //$('#ImagesDiv').append(imgProfile);
        $('.ul').css("display", "none");
        window.resolveLocalFileSystemURI(imageURI, FileIO.gotImageURI, FileIO.errorHandler);
    },

    // pickup the file entry, rename it, and move the file to the app's root directory.
    // on success run the movedImageSuccess() method
    gotImageURI: function (fileEntry) {
        // jAlert("got URI Success");
        // jAlert(fileEntry);

        //var newName = "thumbnail_Test.jpg";
        //jAlert(newFileName);
        var imgname = guid();
        var d = new Date();
        var n = d.getTime();
        //new file name
        //   jAlert('resolve upload');
        var newFileName = imgname + ".jpg";
        var dailyReportId = window.localStorage.getItem("CreateNewDailyReportId");
        var myFolderApp = "EMS/" + dailyReportId;

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
            //The folder is created if doesn't exist
            fileSys.root.getDirectory(myFolderApp,
                                                           { create: true, exclusive: false },
                                                           function (directory) {
                                                               fileEntry.moveTo(directory, newFileName, successMove, FileIO.errorHandler);
                                                           },
                                                        resOnError);
        },
                                 resOnError);


        //fileEntry.moveTo(gFileSystem.root, newName, FileIO.movedImageSuccess, FileIO.errorHandler);
    },

    // send the full URI of the moved image to the updateImageSrc() method which does some DOM manipulation
    //movedImageSuccess : function(fileEntry) {
    //fetchFotos();
    //   jAlert("fileEntry Success");
    //   updateImageSrc(fileEntry.fullPath);



    // },

    // get a new file entry for the moved image when the user hits the delete button
    // pass the file entry to removeFile()
    removeDeletedImage: function (imageURI) {
        window.resolveLocalFileSystemURI(imageURI, FileIO.removeFile, FileIO.errorHandler);
    },

    // delete the file
    removeFile: function (fileEntry) {
        fileEntry.remove();
    },

    // simple error handler
    errorHandler: function (e) {
        var msg = '';
        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = e.code;
                break;
        };
        console.log('Error: ' + msg);
    }
}

function successMove(fileEntry) {
    updateImageSrc(fileEntry.fullPath);
    fetchFotos();
}