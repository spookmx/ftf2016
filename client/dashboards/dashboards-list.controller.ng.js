'use strict'

angular.module('digitalsignageApp')
.controller('DashboardsListCtrl', function($scope, $location, $mdDialog) {
  $scope.selectEnabled = false;
  $scope.page = 1;
  $scope.perPage = 10;
  $scope.sort = {name_sort : 1};
  $scope.orderProperty = '1';

  $scope.helpers({
    dashboards: function() {
      return Dashboards.find({}, {
        sort: $scope.getReactively('sort')
      });
    },
    dashboardsCount: function() {
      return Counts.get('numberOfDashboards');
    }
  });

  $scope.subscribe('dashboards', function() {
    return [{
      sort: $scope.getReactively('sort'),
      limit: parseInt($scope.getReactively('perPage')),
      skip: ((parseInt($scope.getReactively('page'))) - 1) * (parseInt($scope.getReactively('perPage')))
    }, $scope.getReactively('search')];
  });

  $scope.selectMode = function(){
    if($scope.selectEnabled){
      $scope.selectEnabled = false;
    }else{
      $scope.selectEnabled = true;
    }
  };

  $scope.editDashboard = function(target){
    $location.url('/dashboards/'+target.dashboard._id);
  };

  $scope.addNew = function(event){
    $mdDialog.show({
      controller: AddNewController,
      templateUrl: 'client/dashboards/dashboard-addnew.ng.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      fullscreen: true
    })
    .then(function(answer) {
      //After dialog completes
    }, function() {
      //When dialog closes
    });
  };

  function AddNewController($scope, $mdDialog) {
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.createDashboard = function(name) {
      var newDashboard = {};
      newDashboard.name = name;
      Dashboards.insert(newDashboard);
      $mdDialog.cancel();
    };
  }

  $scope.edit = function() {
    console.log("Edit Mode");
  };

  $scope.save = function() {
    if ($scope.form.$valid) {
      Dashboards.insert($scope.newDashboard);
      $scope.newDashboard = undefined;
    }
  };

  $scope.edit = function() {
    console.log("Edit");
  };

  $scope.remove = function(dashboard) {
    Dashboards.remove({_id:dashboard.id});
  };

  $scope.pageChanged = function(newPage) {
    $scope.page = newPage;
  };

  return $scope.$watch('orderProperty', function() {
    if ($scope.orderProperty) {
      $scope.sort = {
        name_sort: parseInt($scope.orderProperty)
      };
    }
  });
});
