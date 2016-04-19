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
    }
  };
});
