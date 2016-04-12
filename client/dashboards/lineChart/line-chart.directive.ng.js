'use strict';

angular.module('digitalsignageApp')
.directive('lineChart', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/dashboards/lineChart/line-chart.view.ng.html',
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
