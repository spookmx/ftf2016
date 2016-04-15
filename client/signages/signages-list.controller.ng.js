'use strict'

angular.module('digitalsignageApp')
.controller('SignagesListCtrl', function($scope, $location, $mdDialog) {
  $scope.selectEnabled = false;
  $scope.page = 1;
  $scope.perPage = 10;
  $scope.sort = {name_sort : 1};
  $scope.orderProperty = '1';

  $scope.helpers({
    signages: function() {
      return Signages.find({}, {
        sort: $scope.getReactively('sort')
      });
    },
    signagesCount: function() {
      return Counts.get('numberOfSignages');
    },
    contents: function() {
      return Contents.find({}, {
        sort: $scope.getReactively('sort')
      });
    },
    contentsCount: function() {
      return Counts.get('numberOfContents');
    },
    images: function()  {
      return Images.find({});
    },
    banners: function()  {
      return Banners.find({});
    },
    categories: function()  {
      return Categories.find({});
    }
  });

  $scope.subscribe('images');
  $scope.subscribe('categories');

  $scope.subscribe('signages', function() {
    return [{
      sort: $scope.getReactively('sort')
      }, $scope.getReactively('search')];
  });

  $scope.subscribe('banners', function() {
    return [{
      sort: $scope.getReactively('sort')
      }, $scope.getReactively('search')];
  });

  $scope.subscribe('contents', function() {
    return [{
      sort: $scope.getReactively('sort'),
      limit: parseInt($scope.getReactively('perPage')),
      skip: ((parseInt($scope.getReactively('page'))) - 1) * (parseInt($scope.getReactively('perPage')))
    }, $scope.getReactively('search')];
  });

  $scope.selectMode = function(){
    if($scope.selectEnabled){
      $scope.selectEnabled = false;
    }else{
      $scope.selectEnabled = true;
    }
  };

  $scope.editSignage = function(signage){
    $location.url('/signages/'+signage._id);
  };

  $scope.settings = function(signage){
    var clone = {};
    angular.copy(signage, clone);
    $mdDialog.show({
      locals:{
			  signage: clone
			},
      controller: SettingsController,
      templateUrl: 'client/signages/signage-template.ng.html',
      clickOutsideToClose:true,
      fullscreen: true
    })
    .then(function() {
      //After dialog completes
    }, function() {
      //When dialog closes
    });
  };

  function SettingsController($scope, $mdDialog, signage) {
    $scope.signage = signage;
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.save = function(signage) {
      var target = signage._id;
      delete signage._id;
      Signages.update({
        _id: target
      }, {
        $set: signage
      }, function(error) {
        if(error) {
          console.error('Unable to update the signage');
        } else {
          console.info('Signage settings updated');
        }
      });
    };
  }

  $scope.addNew = function(){
    $mdDialog.show({
      controller: SignageTemplateController,
      templateUrl: 'client/signages/signage-template.ng.html',
      clickOutsideToClose:true,
      fullscreen: true
    })
    .then(function() {
      //After dialog completes
    }, function() {
      //When dialog closes
    });
  };

  function SignageTemplateController($scope, $mdDialog) {
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.save = function(signage) {
      Signages.insert(signage);
      $mdDialog.hide();
    };
  }

  $scope.remove = function(signage) {
    Signages.remove({_id:signage.id});
  };

  $scope.pageChanged = function(newPage) {
    $scope.page = newPage;
  };

//###################################################### Content Cards Methods

  $scope.removeContent = function(content) {
    switch (content.type) {
      case "image":
        Images.remove({_id:content.reference});
        break;
      case "video":
        Videos.remove({_id:content.reference});
        break;
    }
    Contents.remove({_id: content._id});
  };

  $scope.addContent = function(){
    var newcontent = {};
    $mdDialog.show({
      locals:{
        content: newcontent
      },
      controller: 'ContentTemplateController',
      templateUrl: 'client/signages/content-template.ng.html',
      fullscreen: true
    });
  };


  $scope.editContent = function(content){
    var clone = {};
    angular.copy(content, clone);
    $mdDialog.show({
      locals:{
        content: clone
      },
      controller: 'ContentTemplateController',
      templateUrl: 'client/signages/content-template.ng.html',
      fullscreen: true
    })
    .then(function() {
      //After dialog completes
    }, function() {
      //When dialog closes
    });
  };


  //###################################################### Banner Methods

    $scope.removeBanner = function(banner) {
      banner.reference ? Images.remove({_id:banner.reference}) : null;
      Banners.remove({_id: banner._id});
    };

    $scope.addBanner = function(){
      var newbanner = {};
      $mdDialog.show({
        locals:{
          banner: newbanner
        },
        controller: 'BannerTemplateController',
        templateUrl: 'client/signages/banner-template.ng.html',
        fullscreen: true
      });
    };


    $scope.editBanner = function(banner){
      var clone = {};
      angular.copy(banner, clone);
      $mdDialog.show({
        locals:{
          banner: clone
        },
        controller: 'BannerTemplateController',
        templateUrl: 'client/signages/banner-template.ng.html',
        fullscreen: true
      })
      .then(function() {
        //After dialog completes
      }, function() {
        //When dialog closes
      });
    };

    //###################################################### Category Methods

      $scope.removeCategory = function(category) {
        Categories.remove({_id: category._id});
      };

      $scope.addCategory = function(){
        var newcategory = {};
        $mdDialog.show({
          locals:{
            category: newcategory
          },
          controller: 'CategoryTemplateController',
          templateUrl: 'client/signages/category-template.ng.html',
          fullscreen: true
        });
      };


      $scope.editCategory = function(category){
        var clone = {};
        angular.copy(category, clone);
        $mdDialog.show({
          locals:{
            category: clone
          },
          controller: 'CategoryTemplateController',
          templateUrl: 'client/signages/category-template.ng.html',
          fullscreen: true
        })
        .then(function() {
          //After dialog completes
        }, function() {
          //When dialog closes
        });
      };


  return $scope.$watch('orderProperty', function() {
    if ($scope.orderProperty) {
      $scope.sort = {
        name_sort: parseInt($scope.orderProperty)
      };
    }
  });

});
