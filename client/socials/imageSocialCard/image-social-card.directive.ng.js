'use strict';

angular.module('digitalsignageApp')
.directive('imageSocialCard', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/socials/imageSocialCard/image-social-card.view.ng.html',
    scope: {
      tweet: '='
    },
    replace: true,
    link: function($scope, elem, attrs) {
    }
  };
});
