'use strict';

angular.module('digitalsignageApp')
.directive('attendeeAgenda', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/signages/attendeeAgenda/attendee-agenda.view.ng.html',
    scope: {
      attendee: '=',
    },
    replace: true,
    link: function($scope, elem, attrs, $http) {

      $scope.$watch('attendee', function() {
        //Assuming cn is the field where the confirmation number is stored on the VCard
        if($scope.attendee.cn){
          //The event identifier supplied by SpotMe
          var eid = "da39a3ee5e6b4b0d3255bfef95601890afd80709";
          //The endpoint for the schedule per attendee on SpotMe API
          $scope.loadingData = true;
          var requestURL = "https://usadmin.4pax.com/api/v1/eid/"+eid+"/nodehandlers/nxpnfc/schedule?participant_id="+$scope.attendee.cn;
          $http({
            method: 'GET',
            url: requestURL
          }).then(function successCallback(response) {
            $scope.loadingData = false;
            if(response.data.agenda){
              $scope.sessions = response.data.agenda;
            }else{
              console.error("No agenda data available");
            }
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
        }else{
          console.error("No confirmation number identified on the Vcard");
        }
      });


    }
  };
});
