Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/public/uploads/',
    checkCreateDirectories: true, //create the directories for you
    finished: function(file){
      console.log(file);
    }
  })
});