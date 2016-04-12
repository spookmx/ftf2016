'use strict';

angular.module('digitalsignageApp')
.directive('barChart', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/barChart/bar-chart.view.ng.html',
    scope: {
      tile: '=',
      chartOptions: '=',
      data: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
    }
  };
});
