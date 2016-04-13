'use strict'

angular.module('digitalsignageApp')
.controller('SocialsDetailCtrl', function($scope, $timeout) {
  $scope.viewName = 'Socials';

  $scope.subscribe('selectedtweets', () => {return []}, {
    onReady: function () {
      //$scope.tweetsReady();
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

  $scope.$watch('tweetsCount',function(newValue, oldValue) {
    if (newValue > 0) {
      Object.keys($scope.tweetlist).forEach(function(value, key, map){
        $scope.tweetlist[key].tweet = $scope.tweets[key].tweet;
      });
      $scope.tweetsCount > $scope.targetTweet ? $timeout(changeCard, getRandomInt(10000,7000)) : null;
    }
  }
);

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
      $timeout(changeCard, getRandomInt(10000,7000));
    }else{
      $scope.tweetlist[$scope.targetCard].changing = true;
      $scope.changingCard = true;
      $timeout(changeCard, 500);
    }
  }

  $timeout(changeLayout, getRandomInt(15000,10000));

  function changeLayout(){
    var targets = $scope.getSwappingTweets();
    console.log("targets");
    console.log(targets);
    $scope.tweetlist[targets[0]._id].row = 1;
    $scope.tweetlist[targets[1]._id].row = 2;
    $timeout(changeLayout, getRandomInt(15000,10000));
  }

  $scope.getSwappingTweets = function(){
    var tweetsWith2 = [];
    angular.forEach($scope.tweetlist, function(value, key) {
      if (value.row == 2) {
          tweetsWith2.push(value);
      }
    });
    var targets = [];
    var t2n = getRandomInt(2,0);
    console.log(t2n);
    console.log(tweetsWith2);
    targets[0] = tweetsWith2[t2n];
    var tweetsWith1 = [];
    angular.forEach($scope.tweetlist, function(value, key) {
      if (value.row == 1) {
          tweetsWith1.push(value);
      }
    });
    var t3n = getRandomInt(4,0);
    console.log(t3n);
    console.log(tweetsWith1);
    targets[1] = tweetsWith1[t3n];
    return targets;
  };

   function getRandomInt(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  $scope.tweetlist =[
    {
      _id:0,
      row: 2,
      changing: false
    },{
      _id:1,
      row: 1,
      changing: false
    },{
      _id:2,
      row: 1,
      changing: false
    },{
      _id:3,
      row: 2,
      changing: false
    },{
      _id:4,
      row: 1,
      changing: false
    },{
      _id:5,
      row: 1,
      changing: false
    },{
      _id:6,
      row: 2,
      changing: false
    },{
      _id:7,
      row: 1,
      changing: false
    },{
      _id:8,
      row: 1,
      changing: false
    }
  ];
});
