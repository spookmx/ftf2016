'use strict'

angular.module('digitalsignageApp')
.controller('SignageGstreamerDetailCtrl', function($scope, $stateParams, $interval, $reactive, $timeout) {
  $scope.selectedContent="";
  $scope.selectedContentPosition= 0;

  $scope.selectedBanner="";
  $scope.selectedBannerPosition= 0;
  $scope.selectedBannerImage="";

  $scope.selectedImage="";
  $scope.selectedVideo="";

  $scope.IsSignagesReady = false;
  $scope.IsContentsReady = false;
  $scope.IsImagesReady = false;
  $scope.IsVideosReady = false;
  $scope.IsBannersReady = false;
  $scope.showing = true;

  $scope.subscribe('signages', () => {return []}, {
    onReady: function () {
      signagesReady();
    }
  });
  $scope.subscribe('banners', () => {return []}, {
    onReady: function () {
      bannersReady();
    }
  });
  $scope.subscribe('contents', () => {return []}, {
    onReady: function () {
      contentsReady();
    }
  });
  $scope.subscribe('images', () => {return []}, {
    onReady: function () {
      imagesReady();
    }
  });
  $scope.subscribe('videos', () => {return []}, {
    onReady: function () {
      videosReady();
    }
  });
  $scope.helpers({
    signage: () => {
      return Signages.findOne({ _id: $stateParams.signageId });
    },
    contents: () => {
      return Contents.find({$or:[
        {temporary: false},
        {
          $and:[
            {
              startDate: {$lte: new Date()}
            },
            {
              endDate: {$gt: new Date()}
            }
          ]
        }
      ]},{
        sort: {name : 1}
      });
    },
    content: () =>{
      return Contents.findOne({ _id: $scope.getReactively('selectedContent') });
    },
    image: () =>{
      return Images.findOne({ _id: $scope.getReactively('selectedImage') });
    },
    video: () =>{
      return Videos.findOne({ _id: $scope.getReactively('selectedVideo') });
    },
    banner: () =>{
      return Banners.findOne({ _id: $scope.getReactively('selectedBanner') });
    },
    banners: () => {
      return Banners.find({});
    },
    bannerImage: () =>{
      return Images.findOne({ _id: $scope.getReactively('selectedBannerImage') });
    }
  });

  $scope.subscribe('selectedtweets', () => {return []}, {
    onReady: function () {
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

  $scope.$watchCollection('tweets', function() {
    startTweetRotation();
  });

  function startTweetRotation(){
    if($scope.tweetCountReady && $scope.tweets.length == $scope.tweetsCount){
      $scope.tweetProcessStarted = true;
      Object.keys($scope.tweetlist).forEach(function(value, key, map){
        $scope.tweetlist[key].tweet = $scope.tweets[key].tweet;
      });
      $scope.tweetsCount > $scope.targetTweet ? $timeout(changeCard, getRandomInt(10000, 7000)) : null;
    }
  }

  $scope.targetCard = 0;
  $scope.changingCard = false;
  $scope.targetTweet = 3;
  function changeCard() {
    if($scope.changingCard){
      $scope.tweetlist[$scope.targetCard].tweet = $scope.tweets[$scope.targetTweet].tweet;
      $scope.tweetlist[$scope.targetCard].changing = false;
      $scope.changingCard = false;
      $scope.tweetsCount-1 > $scope.targetTweet ? $scope.targetTweet++ : $scope.targetTweet=0;
      $scope.targetCard < 2 ? $scope.targetCard++ : $scope.targetCard=0;
      $timeout(changeCard,  getRandomInt(10000, 7000));
    }else{
      $scope.tweetlist[$scope.targetCard].changing = true;
      $scope.changingCard = true;
      $timeout(changeCard, 500);
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
    targets[0] = tweetsWith2[0];
    var tweetsWith1 = [];
    angular.forEach($scope.tweetlist, function(value, key) {
      if (value.row == 1) {
          tweetsWith1.push(value);
      }
    });
    var t3n = getRandomInt(2,0);
    targets[1] = tweetsWith1[t3n];
    return targets;
  };

  function getRandomInt(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  $scope.tweetlist =[
    {
      _id:0,
      changing: false,
      row:1
    },{
      _id:1,
      changing: false,
      row:2
    },{
      _id:2,
      changing: false,
      row:1
    }
  ];


  $scope.bannerInterval = $interval(changeBanner, 10000);

  function changeContent() {
    $scope.selectedContent = $scope.contents[$scope.selectedContentPosition]._id;
    $scope.selectedContentPosition + 1 == $scope.contents.length ? $scope.selectedContentPosition = 0 : $scope.selectedContentPosition++;
  }


  function changeBanner(){
    $scope.selectedBanner = $scope.banners[$scope.selectedBannerPosition]._id;
    $scope.selectedBannerPosition + 1 == $scope.banners.length ? $scope.selectedBannerPosition = 0 : $scope.selectedBannerPosition++;
  }

  $scope.$watch("content", function() {
    if($scope.content){
      $scope.changeInterval = $timeout(changeContent, $scope.content.duration*1000);
      switch ($scope.content.type) {
        case "image":
          $scope.selectedImage = $scope.content.reference;
          $scope.selectedVideo = "";
          break;
        case "video":
          $scope.selectedImage = "";
          $scope.selectedVideo = $scope.content.reference;
          break;
        case "html":
          $scope.selectedHTML = $scope.content.reference;
          break;
        default:
          //To Do
      }
    }
  });

  $scope.$watch("image", function() {
    if($scope.image){
      gs.send(JSON.stringify({"link": $scope.productionURL+$scope.image.url(),"width": "1280","height": "720","x": "83","y": "44"}));
      console.log("New image requested");
    }
  });

  $scope.productionURL = "http://tx11wfm01c.cloudapp.net/";
  $scope.$watch("video", function() {
    if($scope.video){
      console.log("New video requested");
      console.log(JSON.stringify({"link": $scope.productionURL+$scope.video.url(),"width": "1280","height": "720","x": "83","y": "44"}));
      gs.send(JSON.stringify({"link": $scope.productionURL+$scope.video.url(),"width": "1280","height": "720","x": "83","y": "44"}));
    }
  });

  $scope.$watch("banner", function() {
    if($scope.banner){
      $scope.selectedBannerImage = $scope.banner.reference;
    }
  });

  $scope.$watch("bannerImage", function() {
    if($scope.bannerImage){
      $scope.showingBanner = false;
      $timeout(function(){
        $scope.bannerNew = {'background-image': 'url(' + $scope.bannerImage.url() +')'};
        $scope.showingBanner = true;
      }, 500);
    }
  });

  function signagesReady(){
    $scope.IsSignagesReady = true;
    allCollectionsReady() ? changeContent() : null;
  }

  function contentsReady(){
    $scope.IsContentsReady = true;
    allCollectionsReady() ? changeContent() : null;
  }

  function imagesReady(){
    $scope.IsImagesReady = true;
    allCollectionsReady() ? changeContent() : null;
    areBannersImagesReady() ? changeBanner() : null;
  }

  function videosReady(){
    $scope.IsVideosReady = true;
    allCollectionsReady() ? changeContent() : null;
  }

  function bannersReady(){
    $scope.IsBannersReady = true;
    areBannersImagesReady() ? changeBanner() : null;
  }

  function allCollectionsReady(){
    if($scope.IsContentsReady && $scope.IsSignagesReady && $scope.IsImagesReady && $scope.IsVideosReady){
      return true;
    }else{
      return false;
    }
  }

  function areBannersImagesReady(){
    if($scope.IsBannersReady && $scope.IsImagesReady){
      return true;
    }else{
      return false;
    }
  }

  //NFC Integration Functionality
  $scope.attendee = {};
  function showAgenda(attendee){
    //VCard expected to be a string with the standard Vcard 3 format
    $scope.attendee = attendee;
    $scope.showingImage = false;
    $scope.showingVideo = false;
    gs.send(JSON.stringify({"link": "hide"}));
    cancelTimers();
    $scope.showAgendaTimer = $timeout(function(){
      $scope.showingImage = false;
      $scope.showingVideo = false;
      $scope.showingAgenda = true;
      cancelTimers();
      $scope.hideAgendaTimer = $timeout(function(){
        hideAgenda();
      }, 10000);
    }, 500);
  }

  function cancelTimers(){
    $timeout.cancel($scope.showImageTimer);
    $timeout.cancel($scope.showVideoTimer);
    $timeout.cancel($scope.changeInterval);
    $timeout.cancel($scope.showAgendaTimer);
    $timeout.cancel($scope.hideAgendaTimer);
  }

  function hideAgenda(){
    cancelTimers()
    $scope.attendee = {};
    $scope.showingAgenda = false;
    changeContent();
  }

  var ws = new WebSocket('ws://localhost:8765/');
  ws.onmessage = function(event) {
    var message = event.data.substr(0, event.data.lastIndexOf("}")+1);
    var attendee = JSON.parse(message);
    console.log(attendee);
    $scope.attendee.uid == attendee.uid ? hideAgenda() : showAgenda(attendee);
  };

  var gs = new WebSocket('ws://localhost:8788/');


});
