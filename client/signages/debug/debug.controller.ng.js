'use strict'

angular.module('digitalsignageApp')
.controller('DebugCtrl', function($scope, $rootScope, currentTime, overrideTimeValid) {
  $scope.helpers({
    status: () => {
      return Meteor.status();
    }
  });
  $scope.currentTime = currentTime;
  $scope.overrideTimeValid = overrideTimeValid;
});
