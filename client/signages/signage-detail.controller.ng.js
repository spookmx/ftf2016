'use strict'

angular.module('digitalsignageApp')
.controller('SignageDetailCtrl', function($scope, $stateParams, $interval, $reactive, $timeout) {
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
      return Contents.find({});
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
    $scope.tweetsCount > $scope.targetTweet ? $timeout(changeCard, $scope.getRandomInt(10000, 7000)) : null;
  };
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
      $timeout(changeCard,  $scope.getRandomInt(10000, 7000));
    }else{
      $scope.tweetlist[$scope.targetCard].changing = true;
      $scope.changingCard = true;
      $timeout(changeCard, 500);
    }
  }

  $scope.getRandomInt = function(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

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

  $scope.changeInterval = $interval(changeContent, 20000);
  $scope.bannerInterval = $interval(changeBanner, 35000);

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
      $timeout(function(){
        $scope.imageNew = $scope.image.url();
        $scope.imagePast = $scope.image.url();
        $scope.showingImage = true;
      }, 500);
    }
  });

  $scope.$watch("video", function() {
    if($scope.video){
      $scope.showingVideo = false;
      $scope.showingImage = false;
      $timeout(function(){
        $scope.videoNew = $scope.video.url();
        $scope.showingVideo = true;
      }, 500);
    }
  });

  $scope.$watch("banner", function() {
    if($scope.banner){
      $scope.selectedBannerImage = $scope.banner.reference;
    }
  });

  $scope.$watch("bannerImage", function() {
    if($scope.bannerImage){
      $scope.bannerPast = {'background-image': 'url(' + $scope.bannerImage.url() +')'};
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


});
