'use strict'

angular.module('digitalsignageApp')
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('amber')
  .accentPalette('blue');
});
