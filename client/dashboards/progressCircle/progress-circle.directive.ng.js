'use strict';

angular.module('digitalsignageApp')
.directive('progressCircle', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/progressCircle/progress-circle.view.ng.html',
    scope: {
      data: '=',
      tile: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.$watch('data', function() {
        if($scope.data){
          $scope.progress = ($scope.data.labels[$scope.data.labels.length-1]/$scope.tile.max)*100;
        }
      });
      $scope.$watch('elem', function() {
        if(elem.height()){
          $scope.diameter = angular.element(document.querySelector('#pc-main-circle')).height();
        }
      });
      $scope.setFont = function(){
        return {"font-size":(elem.height()*0.25)};
      };
      $scope.setWidth = function(){
        return {"width":elem.height()};
      };

    }
  };
});
