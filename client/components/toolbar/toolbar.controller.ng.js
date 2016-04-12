'use strict'

angular.module('digitalsignageApp')
.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}])
.controller('ToolbarCtrl', function($scope) {
});
