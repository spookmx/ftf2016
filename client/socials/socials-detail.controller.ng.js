'use strict'

angular.module('digitalsignageApp')
.controller('SocialsDetailCtrl', function($scope, $timeout) {
  $scope.viewName = 'Socials';

  $scope.subscribe('selectedtweets', () => {return []}, {
    onReady: function () {
      $scope.tweetsReady();
    }
  });

  $scope.helpers({
    tweets: () => {
      return Selectedtweets.find({});
    },
    tweetsCount: () => {
      return Counts.get('numberOfSelectedtweets');
    }
  });

  $scope.tweetsReady = function(){
    Object.keys($scope.tweetlist).forEach(function(value, key, map){
      $scope.tweetlist[key].tweet = $scope.tweets[key].tweet;
    });
    $scope.tweetsCount > $scope.targetTweet ? $timeout(changeCard, $scope.getRandomInt()) : null;
  };
  $scope.targetCard = 0;
  $scope.changingCard = false;
  $scope.targetTweet = 9;
  function changeCard() {
    if($scope.changingCard){
      $scope.tweetlist[$scope.targetCard].tweet = $scope.tweets[$scope.targetTweet].tweet;
      $scope.tweetlist[$scope.targetCard].changing = false;
      $scope.changingCard = false;
      $scope.tweetsCount-1 > $scope.targetTweet ? $scope.targetTweet++ : $scope.targetTweet=0;
      $scope.targetCard < 8 ? $scope.targetCard++ : $scope.targetCard=0;
      $timeout(changeCard,  $scope.getRandomInt());
    }else{
      $scope.tweetlist[$scope.targetCard].changing = true;
      $scope.changingCard = true;
      $timeout(changeCard, 500);
    }
  }

  $scope.getRandomInt = function() {
    return Math.floor(Math.random() * (10000 - 7000 + 1)) + 7000;
  };

  $scope.tweetlist =[
    {
      name:"Uno",
      row: 2,
      changing: false
    },{
      name:"Dos",
      row: 1,
      changing: false
    },{
      name:"Tres",
      row: 1,
      changing: false
    },{
      name:"Cuatro",
      row: 2,
      changing: false
    },{
      name:"Cinco",
      row: 1,
      changing: false
    },{
      name:"Seis",
      row: 1,
      changing: false
    },{
      name:"Siete",
      row: 2,
      changing: false
    },{
      name:"Ocho",
      row: 1,
      changing: false
    },{
      name:"Nueve",
      row: 1,
      changing: false
    }
  ];
});
