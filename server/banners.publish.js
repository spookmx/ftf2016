'use strict'

Meteor.publish('banners', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfBanners', Banners.find(where), {noReady: true});
  return Banners.find(where, options);
});
