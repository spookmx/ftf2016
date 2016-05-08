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

  $scope.tweetProcessStarted = false;
  $scope.tweetCountReady = false;

  $scope.$watch('tweetsCount', function() {
    if($scope.tweetsCount){
      $scope.tweetCountReady = true;
      !$scope.tweetProcessStarted ? startTweetRotation() : null;
    }
  });

  $scope.tweetDeletedID = 0;
  $scope.$watchCollection('tweets', function(current, previous) {
    if(previous.length > current.length){
      //Tweet removed
      var found = false;
      angular.forEach(previous, function(value, key) {
        if(!found){
          if(previous[key].tweet.id != current[key].tweet.id){
            found = true;
            $scope.tweetDeletedID = previous[key].tweet.id;
            console.log("Removed tweet from: "+previous[key].tweet.user.screen_name);
          }
          if(key+1 == current.length){
            found = true;
            $scope.tweetDeletedID = previous[key].tweet.id;
            console.log("Removed tweet from: "+previous[key+1].tweet.user.screen_name);
          }
        }
      }, current);
      angular.forEach($scope.tweetlist, function(value, key) {
        if($scope.tweetlist[key].tweet.id == $scope.tweetDeletedID){
          cancelTimers();
          $scope.tweetlist[$scope.targetCard].changing = false;
          $scope.changingCard = false;
          $scope.targetCard = key;
          changeCard();
        }
      });
    }
    if(previous.length < current.length && $scope.tweetProcessStarted){
      //Tweet Added
      cancelTimers();
      $scope.tweetlist[$scope.targetCard].changing = false;
      $scope.changingCard = false;
      $scope.targetCard = getRandomInt(0, 8);
      $scope.targetTweetBefore = $scope.targetTweet;
      $scope.targetTweet = $scope.tweets.length-1;
      changeCard();
    }
    startTweetRotation();
  });
  $scope.targetTweetBefore = 0;

  function startTweetRotation(){
    if($scope.tweetCountReady && $scope.tweets.length == $scope.tweetsCount && !$scope.tweetProcessStarted){
      $scope.tweetProcessStarted = true;
      Object.keys($scope.tweetlist).forEach(function(value, key, map){
        $scope.tweetlist[key].tweet = $scope.tweets[key].tweet;
      });
      if($scope.tweetsCount > $scope.targetTweet){
        cancelTimers();
        $scope.changeCardTimer = $timeout(changeCard, getRandomInt(10000, 7000));
      }
    }
  }

  function cancelTimers(){
    $timeout.cancel($scope.changeCardTimer);
    $timeout.cancel($scope.showCardTimer);
    $timeout.cancel($scope.hideCardTimer);
  }

  $scope.targetCard = 0;
  $scope.changingCard = false;
  $scope.targetTweet = 9;
  function changeCard() {
    if($scope.changingCard){
      $scope.tweetlist[$scope.targetCard].tweet = $scope.tweets[$scope.targetTweet].tweet;
      $scope.tweetlist[$scope.targetCard].changing = false;
      $scope.changingCard = false;
      if($scope.targetTweetBefore){
        $scope.targetTweet = $scope.targetTweetBefore-1;
        $scope.targetTweetBefore = 0;
      }
      $scope.tweetsCount-1 > $scope.targetTweet ? $scope.targetTweet++ : $scope.targetTweet=0;
      $scope.targetCard < 8 ? $scope.targetCard++ : $scope.targetCard=0;
      $scope.hideCardTimer = $timeout(changeCard, getRandomInt(10000,7000));
    }else{
      $scope.tweetlist[$scope.targetCard].changing = true;
      $scope.changingCard = true;
      $scope.showCardTimer = $timeout(changeCard, 500);
    }
  }

  $timeout(changeLayout, getRandomInt(15000,10000));

  function changeLayout(){
    var targets = $scope.getSwappingTweets();
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
    targets[0] = tweetsWith2[t2n];
    var tweetsWith1 = [];
    angular.forEach($scope.tweetlist, function(value, key) {
      if (value.row == 1) {
          tweetsWith1.push(value);
      }
    });
    var t3n = getRandomInt(4,0);
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
