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
      $scope.setFont = function(){
        return {"font-size":(elem.height()*0.03)};
      };
    }
  };
});
