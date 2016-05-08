'use strict'

angular.module('digitalsignageApp')
.controller('DashboardSettingsController', function($scope, $mdDialog, dashboard) {
  $scope.newParameterTitle = "";
  $scope.dashboard = dashboard;
  dashboard.logoReference ? $scope.imageId = dashboard.logoReference : $scope.imageId = "";

  $scope.helpers({
    parameters: () => {
      return Parameters.find({});
    },
    image: () => {
      return Images.findOne({ _id: $scope.getReactively('imageId') });
    }
  });

  $scope.subscribe('images');
  $scope.subscribe('parameters', () => {
    return [$scope.dashboard._id];
  });

  //#######################################Logo upload methods START
  $scope.uploading = false;
  $scope.$watch('image', function(){
    if($scope.image){
      $scope.uploading = false;
      if($scope.tempImage){
        delete $scope.tempImage;
        var dashboard = {logoReference: $scope.imageId};
        Dashboards.update({
          _id: $scope.dashboard._id
        }, {
          $set: dashboard
        }, function(error) {
          if(error) {
            console.error(error);
          } else {
            console.info("Dashboard updated!");
          }
        });
      }
    }
  });

  $scope.removeImage = function() {
    //Remove image from image collection
    Images.remove({_id:$scope.imageId});
    if($scope.tempImage){
      delete $scope.tempImage;
      $scope.imageId = '';
    }else{
      delete $scope.dashboard.logoReference;
      Dashboards.update({
        _id: $scope.dashboard._id
      }, {
        $unset: {logoReference: ""}
      }, function(error) {
        if(error) {
          console.error(error);
        } else {
          console.info("Image removed from Dashboard!");
        }
      });
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
          $scope.dashboard.logoReference = fileObj._id;
          $scope.tempImage = fileObj;
          $scope.$apply();
        }
      });
    }
  };

  //#######################################Logo Upload Methods END

  $scope.close = function(){
    $mdDialog.hide();
  };

  $scope.save = function(parameter) {
    parameter.edit = false;
    var clone = angular.copy(parameter);
    var target = clone._id;
    delete clone._id;
    delete clone.edit;
    clone.lastUpdated = new Date();
    Parameters.update({
      _id: target
    }, {
      $set: clone
    }, function(error) {
      if(error) {
        console.error(error);
      } else {
        console.info("Parameter updated!");
      }
    });
  };

  $scope.remove = function(parameter) {
    Parameters.remove({_id: parameter._id});
  };

  $scope.add = function(){
    var parameter = {
      'name': $scope.newParameterTitle
    };
    parameter.lastUpdated = new Date();
    parameter.dashboard = $scope.dashboard._id;
    Parameters.insert(parameter);
    $scope.newParameterTitle = "";
  };

});
