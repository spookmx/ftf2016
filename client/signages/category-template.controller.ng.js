'use strict'

angular.module('digitalsignageApp')
.controller('CategoryTemplateController', function($scope, $mdDialog, category) {
  category._id ? $scope.categoryId = category._id : $scope.categoryId ="";

  $scope.subscribe('categories');
  $scope.helpers({
    category: function()  {
      return Categories.findOne({ _id: $scope.getReactively('categoryId') });
    }
  });
  $scope.category = category;

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.save = function() {
    if ($scope.categoryId != ""){
      //If this is a previously saved card
      var target = $scope.category._id;
      delete $scope.category._id;
      Categories.update({
        _id: target
      }, {
        $set: $scope.category
      }, function(error) {
        if(error) {
          console.error('Unable to update the category'+error);
        } else {
          console.info('Category updated');
        }
      });
    }else{
      //If this is a new card
      Categories.insert($scope.category);
      $mdDialog.hide();
    }
  };


});
