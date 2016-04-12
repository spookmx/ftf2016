'use strict'

angular.module('digitalsignageApp')
.controller('DashboardSettingsController', function($scope, $mdDialog, dashboard) {
  $scope.newParameterTitle = "";
  $scope.dashboard = dashboard;
  $scope.helpers({
    parameters: () => {
      return Parameters.find({});
    }
  });
  $scope.subscribe('parameters', () => {
    return [$scope.dashboard._id];
  });

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
