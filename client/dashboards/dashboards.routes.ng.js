'use strict'

angular.module('digitalsignageApp')
.config(function($stateProvider) {
  $stateProvider
  .state('dashboards-list', {
    url: '/dashboards',
    templateUrl: 'client/dashboards/dashboards-list.view.ng.html',
    controller: 'DashboardsListCtrl',
    resolve: {
      currentUser: ['$meteor', function($meteor) {
        return $meteor.requireUser();
      }]
    }
  })
  .state('dashboards-about', {
    url: '/dashboards/about',
    templateUrl: 'client/dashboards/dashboards-about.view.ng.html',
    controller: 'DashboardsListCtrl'
  })
  .state('dashboards-detail', {
    url: '/dashboards/:dashboardId',
    templateUrl: 'client/dashboards/dashboard-detail.view.ng.html',
    controller: 'DashboardDetailCtrl'
  });
});
