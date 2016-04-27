'use strict';

angular.module('digitalsignageApp')
.directive('rotationalLogo', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/rotationalLogo/rotational-logo.view.ng.html',
    scope: {
      data: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.rArray = [];
      $scope.$watch('data', function() {
        if($scope.data){
          var cadena = $scope.data.labels[$scope.data.labels.length-1]+"";
          $scope.rArray = cadena.split(",");
          $scope.rX = $scope.rArray[0];
          $scope.rY = $scope.rArray[0];
          $scope.rZ = $scope.rArray[0];
        }
      });
      $scope.setFont = function(){
        return {"font-size":(elem.height()*0.03)};
      };
      $scope.setWidth = function(){
        return {"width":elem.height()};
      };
      $scope.setWidthMargin = function(){
        return {"width":elem.height(), "margin-top":elem.height()*0.5};
      };
    }
  };
});
