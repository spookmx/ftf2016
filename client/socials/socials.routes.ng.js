'use strict'

angular.module('digitalsignageApp')
.config(function($stateProvider) {
  $stateProvider
  .state('socials', {
    url: '/socials',
    templateUrl: 'client/socials/socials.view.ng.html',
    controller: 'SocialsCtrl',
    resolve: {
      currentUser: ['$meteor', function($meteor) {
        return $meteor.requireUser();
      }]
    }
  }).state('socials-detail', {
      url: '/socials/detail',
      templateUrl: 'client/socials/socials-detail.view.ng.html',
      controller: 'SocialsDetailCtrl',
    });
});
