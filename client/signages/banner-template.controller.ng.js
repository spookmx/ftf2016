'use strict'

angular.module('digitalsignageApp')
.controller('BannerTemplateController', function($scope, $mdDialog, banner) {
  banner.reference ? $scope.imageId = banner.reference : $scope.imageId = $scope.imageId ="";
  $scope.subscribe('images');
  $scope.helpers({
    image: function()  {
      return Images.findOne({ _id: $scope.getReactively('imageId') });
    }
  });
  $scope.banner = banner;

  $scope.cancel = function() {
    if($scope.tempImage && !banner.reference){
      //Remove TEMP image from image or viodeo from collection
      // TO DO
    }
    $mdDialog.cancel();
  };

  $scope.save = function(banner) {
    $scope.image ? banner.reference = $scope.image._id : banner.reference = null;

    if (banner._id){
      //If this is a previously saved card
      var target = banner._id;
      delete banner._id;
      Banners.update({
        _id: target
      }, {
        $set: banner
      }, function(error) {
        if(error) {
          console.error('Unable to update the banner');
        } else {
          console.info('Banner updated');
        }
      });
      if(!banner.reference){
        Banners.update({
          _id: target
        }, {
          $unset: { reference: "" }
        }, function(error) {
          if(error) {
            console.error('Unable to remove the banner reference');
          } else {
            console.info('banner reference removed');
          }
        });
      }
    }else{
      //If this is a new card
      Banners.insert(banner);
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

});
