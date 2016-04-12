'use strict';

angular.module('digitalsignageApp')
.directive('gaugeChart', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/gaugeChart/gauge-chart.view.ng.html',
    scope: {
      tile: '=',
      chartOptions: '=',
      data: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.gaugeOptions = {};
      $scope.gaugeData = {};
      $scope.gaugeData.series = [0,0];
      $scope.$watch('chartOptions', function() {
        $scope.gaugeOptions = $scope.chartOptions;
        $scope.gaugeOptions.total = $scope.tile.max*2;
        console.log($scope.gaugeOptions);
      });
      $scope.$watch('data', function() {
        $scope.gaugeData.series[0] = $scope.data.labels[$scope.data.labels.length-1];
        $scope.gaugeData.series[1] = $scope.tile.max - $scope.data.labels[$scope.data.labels.length-1];

      });
    }
  };
});
