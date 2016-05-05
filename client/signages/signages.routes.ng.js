'use strict'

angular.module('digitalsignageApp')
.config(function($stateProvider) {
  $stateProvider
  .state('signages-list', {
    url: '/signages',
    templateUrl: 'client/signages/signages-list.view.ng.html',
    controller: 'SignagesListCtrl',
    resolve: {
      currentUser: ['$meteor', function($meteor) {
        return $meteor.requireUser();
      }]
    }
  })
  .state('signage-detail', {
    url: '/signages/:signageId?signageLocation',
    templateUrl: 'client/signages/signage-detail.view.ng.html',
    controller: 'SignageDetailCtrl',
  })
  .state('signage-detail-gstreamer', {
    url: '/signages/gstreamer/:signageId',
    templateUrl: 'client/signages/signage-gstreamer-detail.view.ng.html',
    controller: 'SignageGstreamerDetailCtrl',
  });
});
