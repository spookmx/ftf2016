'use strict';

angular.module('digitalsignageApp')
.controller('attendeeAgendaController', ['$scope','$http','$filter', '$rootScope', function($scope, $http, $filter, $rootScope) {

  $scope.$watch('attendee', function() {
    //Assuming cn is the field where the confirmation number is stored on the VCard
    if($scope.attendee.uid){
      //The event identifier supplied by SpotMe
      var eid = "9a2b57983d9149b1ff9cedc66d5dde29";
      //The endpoint for the schedule per attendee on SpotMe API
      $scope.loadingData = true;

      $rootScope.audioSuccess.play();

      //var requestURL = "http://97.79.186.153/api/v1/eid/"+eid+"/nodehandlers/nxpnfc/schedule?key=Xj6Za32pCb&participant_id="+$scope.attendee.uid;
      var requestURL = "http://www.mocky.io/v2/57cef555260000a80564fef9";
      $http.get(requestURL)
      .then(function(response){
        $scope.loadingData = false;
        console.log(response);
        if(response.data.agenda){
          $scope.message = "";
          $scope.sessions = response.data.agenda;
          angular.forEach($scope.sessions, function(value, key) {
            $scope.sessions[key].start = new Date($scope.sessions[key].start*1000);
            $scope.sessions[key].end = new Date($scope.sessions[key].end*1000);
            if($scope.sessions[key].start < new Date()){
              delete $scope.sessions[key];
            }
            if($scope.sessions[key] && $scope.sessions[key].name.length > 110 ){
              $scope.sessions[key].name = $filter('limitTo')($scope.sessions[key].name, 110, 0);
              $scope.sessions[key].name += "...";
            }
          });
          $scope.sessions = $filter('orderBy')($scope.sessions, "start");
          $scope.sessions = $filter('limitTo')($scope.sessions, 5, 0);
        }else{
          $scope.message = "Sorry, we could not find any sessions on your agenda.";
          $scope.sessions = [];
        }
      }, function(error) {
        $scope.loadingData = false;
        $scope.message = "Sorry, we could not find any sessions on your agenda.";
        $scope.sessions = [];
        console.log(error);
      });
    }else{
      console.error("No confirmation number identified on the Vcard");
    }
  });

}])
.directive('attendeeAgenda', function() {
  return {
    controller: 'attendeeAgendaController',
    restrict: 'E',
    templateUrl: 'client/signages/attendeeAgenda/attendee-agenda.view.ng.html',
    scope: {
      attendee: '=',
    },
    replace: true
  };
});
