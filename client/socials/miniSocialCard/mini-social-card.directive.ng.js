'use strict';

angular.module('digitalsignageApp')
.directive('miniSocialCard', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/socials/miniSocialCard/mini-social-card.view.ng.html',
    scope: {
      tweet: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
    }
  };
});
