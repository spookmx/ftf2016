'use strict'

angular.module('digitalsignageApp')
.directive('ngSetfocus', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ngSetfocus);
      scope.$watch(model, function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
});
