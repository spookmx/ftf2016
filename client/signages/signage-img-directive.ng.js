'use strict'

angular.module('digitalsignageApp')
.directive('imgcontainer', function(){
    return function(scope, element, attrs){
      scope.$watch("url",function(newValue,oldValue) {
        var url = attrs.url;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
      });
    };
});
