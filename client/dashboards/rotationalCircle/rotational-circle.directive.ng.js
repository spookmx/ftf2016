'use strict';

angular.module('digitalsignageApp')
.directive('rotationalCircle', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/rotationalCircle/rotational-circle.view.ng.html',
    scope: {
      data: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.degrees = {
        "-webkit-transform": "rotateZ("+$scope.data.labels[$scope.data.labels.length-1]+"deg)",
        "transform": "rotateZ("+$scope.data.labels[$scope.data.labels.length-1]+"deg)"
      };
      $scope.setFont = function(){
        return {"font-size":(elem.height()*0.3)};
      };
      $scope.setWidth = function(){
        return {"width":elem.height()};
      };
    }
  };
});
