'use strict'

angular.module('digitalsignageApp')
.controller('ContentTemplateController', function($scope, $mdDialog, content) {
  switch (content.type) {
    case "image":
      $scope.imageId = content.reference;
      break;
    case "video":
      $scope.videoId = content.reference;
      break;
    default:
      $scope.imageId = $scope.imageId ="";
  }
  $scope.subscribe('images');
  $scope.subscribe('videos');
  $scope.helpers({
    video: function()  {
      return Videos.findOne({ _id: $scope.getReactively('videoId') });
    },
    image: function()  {
      return Images.findOne({ _id: $scope.getReactively('imageId') });
    }
  });
  $scope.content = content;

  $scope.cancel = function() {
    if($scope.tempImage && !content.reference){
      //Remove TEMP image from image or viodeo from collection
      // TO DO
    }
    $mdDialog.cancel();
  };

  $scope.save = function(content) {
    switch (content.type) {
      case "image":
        $scope.image ? content.reference = $scope.image._id : content.reference = null;
        break;
      case "video":
        $scope.video ? content.reference = $scope.video._id : content.reference = null;
        break;
    }

    if (content._id){
      //If this is a previously saved card
      var target = content._id;
      delete content._id;
      Contents.update({
        _id: target
      }, {
        $set: content
      }, function(error) {
        if(error) {
          console.error('Unable to update the content card');
        } else {
          console.info('Content card updated');
        }
      });
      if(!content.reference){
        Contents.update({
          _id: target
        }, {
          $unset: { reference: "" }
        }, function(error) {
          if(error) {
            console.error('Unable to remove the content reference');
          } else {
            console.info('Content card reference removed');
          }
        });
      }
    }else{
      //If this is a new card
      Contents.insert(content);
      $mdDialog.hide();
    }
  };

  $scope.removeImage = function() {
    //Remove image from image collection
    Images.remove({_id:$scope.imageId});
    if($scope.tempImage){
      delete $scope.tempImage;
      $scope.imageId = '';
    }else{
      delete $scope.content.reference;
      $scope.imageId = '';
    }
  };
  $scope.addImages = (files) => {
    if (files.length > 0) {
      Images.insert(files[0], function (err, fileObj) {
        if(err){
          console.error("CFS Insert Method Error");
        }else{
          $scope.uploading = true;
          $scope.imageId = fileObj._id;
          $scope.tempImage = fileObj;
          $scope.$apply();
        }
      });
    }
  };
  //Video Process Functions START #########################
  $scope.addVideos = (files) => {
    if (files.length > 0) {
      Videos.insert(files[0], function (err, fileObj) {
        if(err){
          console.error("CFS Insert Method Error");
        }else{
          $scope.uploading = true;
          $scope.videoId = fileObj._id;
          $scope.tempVideo = fileObj;
          $scope.$apply();
        }
      });
    }
  };
  $scope.removeVideo = function() {
    Videos.remove({_id:$scope.videoId});
    if($scope.tempVideo){
      delete $scope.tempVideo;
      $scope.videoId = '';
    }else{
      delete $scope.content.reference;
      $scope.videoId = '';
    }
  };
  //Video Process Functions END #########################

});