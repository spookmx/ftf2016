'use strict'

angular.module('digitalsignageApp')
.controller('TileSettingsController', function($scope, $mdDialog, tile, tiles, parameters, tempData) {
  $scope.tilesMax = Object.keys(tiles).length-1;
  $scope.tiles = tiles;
  $scope.tile = tile;
  $scope.tileProto = $scope.tile.order;
  $scope.parameters = parameters;
  $scope.tempData = tempData;


  $scope.close = function(){
    $mdDialog.hide();
  };
  $scope.delete = function(){
    $scope.tempData.tile = angular.copy($scope.tile);
    var order = 0;
    for (var i = 0; i <= $scope.tilesMax; i++){
      if($scope.tiles[i]._id === $scope.tile._id){
        order = $scope.tile.order;
        $scope.tiles.splice(i, 1);
        break;
      }
    }
    for (var i = 0; i <= $scope.tilesMax-1; i++){
      $scope.tiles[i].order > order ? $scope.tiles[i].order -= 1 : null;
    }
    $mdDialog.hide();
  };

  $scope.$watch("tile.visualization.type", function(current, previous) {
    switch (current) {
      case "line-chart":
        $scope.displayMin = false;
        $scope.displayMax = false;
        $scope.displayValue = true;
        break;
      case "bar-chart":
        $scope.displayMin = false;
        $scope.displayMax = false;
        $scope.displayValue = true;
        break;
      case "gauge-chart":
        $scope.displayMin = true;
        $scope.displayMax = true;
        $scope.displayValue = true;
        break;
      case "text-value":
        $scope.displayMin = false;
        $scope.displayMax = false;
        $scope.displayValue = true;
        $scope.displayIcon = true;
        break;
      case "color-indicator":
        $scope.displayMin = false;
        $scope.displayMax = false;
        $scope.displayValue = true;
        $scope.displayIcon = false;
        $scope.displayUnits = false;
        break;
      default:
        $scope.displayMin = true;
        $scope.displayMax = true;
        $scope.displayValue = true;
        $scope.displayIcon = false;
    }
  });
  $scope.$watch("tile.visualization.showValue", function(current, previous) {
    current ? $scope.displayUnits = true : $scope.displayUnits = false;
  });

  $scope.$watch("tileProto", function(current, previous) {
    if(current != previous){
      for (var i = 0; i <= $scope.tilesMax; i++){
        if($scope.tiles[i].order == current){
          $scope.tiles[i].order = previous;
        }else if ($scope.tiles[i].order == previous) {
          $scope.tiles[i].order = current;
        }
      }
    }
  });
});
