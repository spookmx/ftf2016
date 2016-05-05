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
    link: function($scope, elem, attrs) {
      $scope.$watch('attendee', function() {
        //Assuming cn is the field where the confirmation number is stored on the VCard
        if($scope.attendee.uid){
          //The event identifier supplied by SpotMe
          var eid = "9a2b57983d9149b1ff9cedc66d5dde29";
          //The endpoint for the schedule per attendee on SpotMe API
          $scope.loadingData = true;
          var requestURL = "https://usadmin.4pax.com/api/v1/eid/"+eid+"/nodehandlers/nxpnfc/schedule";
          HTTP.get(requestURL,
          {params: {key: "Xj6Za32pCb", participant_id:$scope.attendee.uid}},
          function(error, result) {
            if(error){
              console.log(error);
            }else{
              $scope.loadingData = false;
              if(result.data.agenda){
                $scope.sessions = response.data.agenda;
              }else{
                console.error("No agenda data available");
              }
            }
          });

        }else{
          console.error("No confirmation number identified on the Vcard");
        }
      });
    }
  };
});
