'use strict'

angular.module('digitalsignageApp')
.controller('SocialsCtrl', function($scope) {
  $scope.viewName = 'Socials';
  $scope.subscribe('tweets');
  $scope.subscribe('selectedtweets');
  $scope.helpers({
    tweetsStream: () => {
      return Tweets.find({type:'stream'});
    },
    tweetsSearch: () => {
      return Tweets.find({type:'search'});
    },
    selectedtweets: () => {
      return Selectedtweets.find({});
    }
  });

  $scope.subscribe('tweetsstreams');
  $scope.helpers({
    tweetsstream: () => {
      return TweetsStreams.findOne({});
    }
  });

  $scope.startStream = function(target) {
    //Calls method to start a new stream
    Meteor.call('TweetStartStream', target,
    function (error, result) {
      if(error){
        console.error(error);
      }else{
        console.info(result);
      }
    });
  };

  $scope.stopStream = function() {
    //Calls method to stop a stream
    Meteor.call('TweetStopStream',
    function (error, result) {
      if(error){
        console.error(error);
      }else{
        console.info(result);
      }
    });
  };

  $scope.clearStream = function() {
    Meteor.call('TweetClearStream',
    function (error, result) {
      if(error){
        console.error(error);
      }else{
        console.info(result);
      }
    });
  };

  $scope.tweetSearch = function(target) {
    //Calls method to search
    Meteor.call('TweetSearch', target,
    function (error, result) {
      if(error){
        console.error(error);
      }else{
        console.info(result);
      }
    });
  };

  $scope.tweetSearchClear = function() {
    Meteor.call('TweetClearSearch',
    function (error, result) {
      if(error){
        console.error(error);
      }else{
        console.info(result);
      }
    });
  };

  $scope.tweetRemove = function(tweet) {
    Tweets.remove({_id:tweet._id});
  };

  $scope.tweetFavorite = function(tweet){
    Selectedtweets.insert({
     user: Meteor.userId(),
     tweet: tweet.tweet,
     createdAt: new Date()
    });
    var clone = angular.copy(tweet);
    var target = clone._id;
    clone.favorited = true;
    delete clone._id;
    Tweets.update({
      _id: target
    }, {
      $set: clone
    }, function(error) {
      if(error) {
        console.error(error);
      } else {
        console.info("Favorited updated!");
      }
    });
  };

  $scope.selectedtweetDelete = function(tweet){
    Selectedtweets.remove({_id:tweet._id});
  };

  $scope.selectedtweetsRemoveAll = function(){
    //TweetClearSelected
    Meteor.call('TweetClearSelected',
    function (error, result) {
      if(error){
        console.error(error);
      }else{
        console.info(result);
      }
    });
  };
});
