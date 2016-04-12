'use strict'

angular.module('digitalsignageApp')
.controller('DashboardDetailCtrl', function($scope, $stateParams, $mdDialog, $mdToast, $timeout) {

  $scope.helpers({
    dashboard: () => {
      return Dashboards.findOne({ _id: $stateParams.dashboardId });
    },
    parameters: () => {
      var res = Parameters.find({}).fetch();
      var obj = {};
      res.forEach(function ( val ) {
        val.chartdata = {labels:val.values, series:[val.values]};
        obj[ val._id ] = val;
      });
      return obj;
    }
  });
  $scope.chartOptions = {
    axisX: {
      showLabel: false,
      showGrid: false
    },
    axisY: {
      offset: 40,
      position: 'end'
    },
    showArea: true,
    fullWidth: true,
    showPoint: false,
    lineSmooth: false,
    width: '100%',
    height: '100%',
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 25,
      left: 0
    }
  };

  $scope.gridReady = function($event){
    if($event.performance.tileCount > 0){
      $scope.parametersReady = false;
      $timeout(function(){$scope.parametersReady = true;}, 1000);
    }
  };

  $scope.parametersReady = false;

  $scope.subscribe('parameters', () => {
    return [$stateParams.dashboardId];
  },{
    onReady: function () {
      $scope.parametersReady = true;
    }
  });

  $scope.subscribe('dashboards');

  $scope.tempData = {init:true, tile:{}};
  $scope.$watch("tempData.tile", function() {
    if($scope.tempData.tile._id){
      var toast = $mdToast.simple().textContent('Tile removed!').action('UNDO').highlightAction(true).hideDelay(10000);
      $mdToast.show(toast)
      .then(function(response) {
        if ( response == 'ok' ) {
          $scope.tempData.tile.order = Object.keys($scope.dashboard.tiles).length;
          $scope.dashboard.tiles.push($scope.tempData.tile);
          $scope.tempData.tile = {};
        }
      })
      .finally(function(){
        $scope.tempData.tile = {}
      });
    }
  });

  $scope.addWidget = function(){
    $scope.dashboard.tiles ? $scope.dashboard.tiles.push({_id:new Mongo.ObjectID()._str , title: "New Tile", width: 1, height: 1, order:Object.keys($scope.dashboard.tiles).length}) : $scope.dashboard.tiles = [{_id:new Mongo.ObjectID()._str, title: "New Tile", width: 1, height: 1, order: 0}];
  };

  $scope.generalSettings = function(){
    $mdDialog.show({
      locals:{
        dashboard: $scope.dashboard,
      },
      controller: 'DashboardSettingsController',
      templateUrl: 'client/dashboards/dashboard-settings.ng.html',
      fullscreen: true
    })
    .then(function() {
      //After dialog completes
    }, function() {
      //When dialog closes
    });
  };

  $scope.tileSettings = function(tile){
    $mdDialog.show({
      locals:{
        tempData: $scope.tempData,
        tile: tile,
        tiles: $scope.dashboard.tiles,
        parameters: $scope.parameters
      },
      controller: 'TileSettingsController',
      templateUrl: 'client/dashboards/dashboard-tile-settings.ng.html',
      fullscreen: true
    })
    .then(function() {
      //After dialog completes
    }, function() {
      //When dialog closes
    });
  };

  $scope.save = function() {
    var clone = angular.copy($scope.dashboard);
    delete clone._id;
    clone.lastUpdated = new Date();
    Dashboards.update({
      _id: $stateParams.dashboardId
    }, {
      $set: clone
    }, function(error) {
      if(error) {
        console.error(error);
      } else {
        console.info("Dashboard updated!");
      }
    });
  };

});
