'use strict'

angular.module('digitalsignageApp')
.controller('SignageDetailCtrl', function($scope, $rootScope, $stateParams, $interval, $reactive, $timeout, $mdToast, $http, $sce) {
  if($stateParams.debug){
    $stateParams.date ? $scope.currentTime = new Date($stateParams.date) : $scope.currentTime = new Date();
    if($scope.currentTime == "Invalid Date"){
      $scope.currentTime = new Date();
      console.error("Invalid date provided in date parameter");
      $scope.overrideTimeValid = false;
    }else{
      $scope.overrideTimeValid = true;
    }
    $mdToast.show({
          hideDelay   : 0,
          position    : 'top left',
          controller  : 'DebugCtrl',
          templateUrl : 'client/signages/debug/debug-template.ng.html',
          locals      : {
            currentTime: $scope.currentTime,
            overrideTimeValid: $scope.overrideTimeValid
          }
        });
  }else{
    $scope.overrideTimeValid = false;
    $scope.currentTime = new Date();
  }

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
              startDate: {$lte: $scope.getReactively('currentTime')}
            },
            {
              endDate: {$gt: $scope.getReactively('currentTime')}
            },
            {
              temporary: true
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

  $scope.changeCurrentTime = $interval(changeTime, 1000);

  function changeTime(){
    $scope.overrideTimeValid ? null : $scope.currentTime = new Date();
  }

  $scope.$watchCollection('contents', function(current, previous) {
    if($scope.contents[0]){
      //console.log($scope.contents);
    }
  });

  function changeContent() {
    if($scope.contents[0]){
      if($scope.selectedContent == $scope.contents[$scope.selectedContentPosition]._id){
        $scope.selectedContentPosition + 1 == $scope.contents.length ? $scope.selectedContentPosition = 0 : $scope.selectedContentPosition++;
        $timeout(changeContent, 1);
      }else{
        $scope.selectedContent = $scope.contents[$scope.selectedContentPosition]._id;
        $scope.selectedContentPosition + 1 == $scope.contents.length ? $scope.selectedContentPosition = 0 : $scope.selectedContentPosition++;
      }
    }else{
      $timeout(changeContent, 1);
    }
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
      $scope.showingImage = false;
      $scope.showingVideo = false;
      $timeout.cancel($scope.showImageTimer);
      $scope.showImageTimer = $timeout(function(){
        $scope.imageNew = $scope.image.url({auth:false});
        $scope.imagePast = $scope.image.url({auth:false});
        $scope.showingImage = true;
      }, 500);
    }
  });

  $scope.$watch("video", function() {
    if($scope.video){
      $http(requestVideoObject($scope.selectedVideo))
      .then(function successCallback(response) {
        $scope.videoPlayer ? $scope.videoPlayer.pause() : null;
        $scope.showingVideo = false;
        $scope.showingImage = false;
        var blob = new Blob( [ response.data ], { type: "video/mp4" } );
        var urlCreator = window.URL || window.webkitURL;
        var videoUrl = urlCreator.createObjectURL(blob);
        $timeout.cancel($scope.showVideoTimer);
        $scope.showVideoTimer = $timeout(function(){
          $scope.videoNew = "";
          $scope.videoNew = trustSrc(videoUrl);
          $scope.showingVideo = true;
          $scope.$apply();
          $scope.videoPlayer = document.getElementById("video-player");
          $scope.videoPlayer.play();
        }, 500);
      }, function errorCallback(response) {
        console.error("Error getting the video", response);
      });
    }
  });

  $scope.$watch("banner", function() {
    if($scope.banner){
      $scope.selectedBannerImage = $scope.banner.reference;
    }
  });

  $scope.$watch("bannerImage", function() {
    if($scope.bannerImage){
      $http({
        method: "GET",
        url: $scope.bannerImage.url({auth:false}),
        responseType: "arraybuffer",
        headers:{
          'Cache-Control': ()=>{ return null}
        }
      })
      .then(function successCallback(response) {
        var blob = new Blob( [ response.data ], { type: "image/jpeg" } );
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        $scope.showingBanner = false;
        $timeout(function(){
          $scope.bannerNew = imageUrl;
          $scope.showingBanner = true;
        }, 500);
      }, function errorCallback(response) {
        console.error("Error getting the image", response);
      });

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
      preLoadContent();
      return true;
    }else{
      return false;
    }
  }

  function areBannersImagesReady(){
    if($scope.IsBannersReady && $scope.IsImagesReady){
      preLoadBanners();
      return true;
    }else{
      return false;
    }
  }

  function preLoadBanners(){
    $scope.bannerStatus = {};
    $scope.banners.forEach((banner)=>{
      $scope.bannerStatus[banner.reference] = {loaded: false};
      $http({
        method: "GET",
        url: Images.findOne({_id:banner.reference}).url({auth:false}),
        responseType: "arraybuffer",
        headers:{
          'Cache-Control': ()=>{ return null }
        }
      })
      .then(function successCallback(response) {
        $scope.bannerStatus[banner.reference] = {loaded: true};
      }, function errorCallback(response) {
        console.error("Error getting the image", response);
      });
    });
  }

  $scope.$watchCollection('bannerStatus', function() {
    if($scope.bannerStatus){
      var completed = 0;
      angular.forEach($scope.bannerStatus, (status)=>{
        status.loaded ? completed++ : null;
      }, completed);
      $rootScope.preLoadBannersCompleted = (completed / Object.keys($scope.bannerStatus).length)*100;
    }
  });

  function preLoadContent(){
    $scope.contentStatus = {};
    $scope.contents.forEach((content)=>{
      $scope.contentStatus[content.reference] = {loaded: false};
      switch (content.type) {
        case "image":
          $http({
            method: "GET",
            url: Images.findOne({_id:content.reference}).url({auth:false}),
            responseType: "image/*",
            headers:{
              'Cache-Control': "public, max-age=31536000"
            }
          })
          .then(function successCallback(response) {
            $scope.contentStatus[content.reference] = {loaded: true};
          }, function errorCallback(response) {
            console.error("Error getting the image", response);
          });
          break;
        case "video":
          $http(requestVideoObject(content.reference))
          .then(function successCallback(response) {
            $scope.contentStatus[content.reference] = {loaded: true};
          }, function errorCallback(response) {
            console.error("Error getting the video", response);
          });
          break;
        case "html":
          //To Do
          break;
        default:
          //To Do
      }
    });
  }

  function requestVideoObject(reference){
    var myVideoRequest = {
      method: "GET",
      url: Videos.findOne({_id:reference}).url({auth:false}),
      responseType: "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
      headers:{
        'Cache-Control': 'public, max-age=31536000',
        'Accept': "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5"
      }
    };
    return myVideoRequest;
  }

  function trustSrc(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.$watchCollection('contentStatus', function() {
    if($scope.contentStatus){
      var completed = 0;
      angular.forEach($scope.contentStatus, (status)=>{
        status.loaded ? completed++ : null;
      }, completed);
      $rootScope.preLoadContentsCompleted = (completed / Object.keys($scope.contentStatus).length)*100;
    }
  });

  //NFC Integration Functionality
  $scope.attendee = {};
  function showAgenda(attendee){
    //VCard expected to be a string with the standard Vcard 3 format
    $scope.attendee = attendee;
    $scope.showingImage = false;
    $scope.showingVideo = false;
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

  var ws = new WebSocket('ws://localhost:8080/');
  ws.onmessage = function(event) {
    var message = event.data.substr(0, event.data.lastIndexOf("}")+1);
    message = JSON.parse(message);
    if(message.Exception){
      console.error("Tag not read properly");
    }else{
      var vcard = parseHex(message.Records[0].PayloadHex);
      vcard = parseVcard(vcard);
      var attendee = {};
      attendee.uid = vcard.uid;
      var name = vcard.n.split(";");
      attendee.fullName = name[1]+" "+name[0];
      console.log(attendee);
      $scope.attendee.uid == attendee.uid ? hideAgenda() : showAgenda(attendee);
    }
  };

});
