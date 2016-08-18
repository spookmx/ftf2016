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
  !$scope.content.temporary ? $scope.content.temporary = false : null;
  !$scope.content.duration ? $scope.content.duration = 10 : null;

  $scope.durationDisabled = false;

  $scope.$watch('video', function(){
    if($scope.video){
      $scope.videoPlayer = document.getElementById("video-player");
      $scope.videoPlayer.ondurationchange=function(){
        if($scope.videoPlayer.duration > 0){
          $scope.durationDisabled = true;
          $scope.content.duration = $scope.videoPlayer.duration;
        }
      };
    }
  });


  $scope.$watch('content.temporary', function(){
    if($scope.content.temporary){
      if(!$scope.content.startDate){
        $scope.content.startDate = new Date();
        $scope.content.startDate.setHours(0,0,0,0);
        $scope.content.endDate = new Date(
          $scope.content.startDate.getFullYear(),
          $scope.content.startDate.getMonth(),
          $scope.content.startDate.getDate()+1
        );
      }
    }else{
      $scope.content.startDate ? delete $scope.content.startDate : null;
      $scope.content.endDate ? delete $scope.content.endDate : null;
    }
  });

  $scope.$watch('content.startDate', function(){
    if($scope.content.startDate){
      $scope.endDateMin = new Date(
        $scope.content.startDate.getFullYear(),
        $scope.content.startDate.getMonth(),
        $scope.content.startDate.getDate()+1
      );
      if($scope.content.startDate >= $scope.content.endDate){
        $scope.content.endDate = new Date(
          $scope.content.startDate.getFullYear(),
          $scope.content.startDate.getMonth(),
          $scope.content.startDate.getDate()+1
        );
      }
    }
  });

  $scope.cancel = function() {
    if($scope.tempImage && !content.reference){
      //Remove TEMP image from image or video from collection
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
      var clone = angular.copy(content);
      var target = content._id;
      delete clone._id;
      Contents.update({
        _id: target
      }, {
        $set: clone
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
      $mdDialog.hide();
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
