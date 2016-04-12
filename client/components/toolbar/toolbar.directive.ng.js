'use strict'

angular.module('digitalsignageApp')
.directive('toolbar', function() {
  return {
    restrict: 'AE',
    templateUrl: 'client/components/toolbar/toolbar.view.ng.html',
    controller: 'ToolbarCtrl',
    replace: true
  };
});
