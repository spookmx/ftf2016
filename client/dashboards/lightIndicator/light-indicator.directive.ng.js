'use strict';

angular.module('digitalsignageApp')
.directive('lightIndicator', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/lightIndicator/light-indicator.view.ng.html',
    scope: {
      data: '=',
      tile: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.$watch('data', function() {
        if($scope.data){
          $scope.opacity = ($scope.data.labels[$scope.data.labels.length-1]/$scope.tile.max);
        }
      });
      $scope.setFont = function(){
        return {"font-size":(elem.height()*0.3)};
      };
      $scope.setFontUnits = function(){
        return {"font-size":(elem.height()*0.1)};
      };
      $scope.setWidth = function(){
        return {"width":elem.height()};
      };
    }
  };
});
