'use strict';

angular.module('digitalsignageApp')
.directive('textValue', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/textValue/text-value.view.ng.html',
    scope: {
      data: '=',
      tile: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.$watch('data', function() {
        if($scope.data){
          switch ($scope.tile.visualization.icon) {
            case "lock":
              if($scope.data.labels[$scope.data.labels.length-1] == "0"){
                $scope.legend = "Locked";
                $scope.iconOption = "zmdi-lock";
              }else{
                $scope.legend = "Unlocked";
                $scope.iconOption = "zmdi-lock-open";
              }
              break;
            case "on-off":
              if($scope.data.labels[$scope.data.labels.length-1] == "0"){
                $scope.legend = "On";
                $scope.iconOption = "zmdi-check-circle";
              }else{
                $scope.legend = "Off";
                $scope.iconOption = "zmdi-circle-o";
              }
              break;
            case "arrow":
              switch ($scope.data.labels[$scope.data.labels.length-1]) {
                case 0:
                  $scope.legend = "Up";
                  $scope.iconOption = "zmdi-caret-up-circle";
                  break;
                case 1:
                  $scope.legend = "Right";
                  $scope.iconOption = "zmdi-caret-right-circle";
                  break;
                case 2:
                  $scope.legend = "Down";
                  $scope.iconOption = "zmdi-caret-down-circle";
                  break;
                default:
                  $scope.legend = "Left";
                  $scope.iconOption = "zmdi-caret-left-circle";
              }
              break;
            default:
              $scope.legend = $scope.data.labels[$scope.data.labels.length-1];
          }
        }
      });
      $scope.$watch('tile.visualization.icon', function() {
        switch ($scope.tile.visualization.icon) {
          case "lock":
            $scope.legend == "Locked" ? $scope.iconOption = "zmdi-lock" : $scope.iconOption = "zmdi-lock-open";
            break;
          case "on-off":
            $scope.legend == "On" ? $scope.iconOption = "zmdi-check-circle" : $scope.iconOption = "zmdi-circle-o";
            break;
          case "arrow":
            switch ($scope.legend) {
              case "Up":
                $scope.iconOption = "zmdi-caret-up-circle";
                break;
              case "Right":
                $scope.iconOption = "zmdi-caret-right-circle";
                break;
              case "Down":
                $scope.iconOption = "zmdi-caret-down-circle";
                break;
              default:
                $scope.iconOption = "zmdi-caret-left-circle";
            }
            break;
          default:
            $scope.iconOption = "";
        }
      });
      $scope.setFont = function(){
        return {"font-size":(elem.height()*0.5)};
      };
      $scope.setWidth = function(){
        return {"width":elem.height()};
      };

    }
  };
});
