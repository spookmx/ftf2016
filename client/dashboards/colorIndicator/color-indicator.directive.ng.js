'use strict';

angular.module('digitalsignageApp')
.directive('colorIndicator', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/colorIndicator/color-indicator.view.ng.html',
    scope: {
      data: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.setColor = function(){
        return {"background": "rgb("+$scope.data.labels[$scope.data.labels.length-1]+")"};
      };
      $scope.setFont = function(){
        return {"font-size":(elem.height()*0.2)};
      };
      $scope.setWidth = function(){
        return {"width":elem.height()};
      };
    }
  };
});
