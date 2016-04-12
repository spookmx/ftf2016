'use strict';

angular.module('digitalsignageApp')
.directive('responsiveCard', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/socials/responsiveCard/responsive-card.view.ng.html',
    scope: {
      tweet: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
    }
  };
});
