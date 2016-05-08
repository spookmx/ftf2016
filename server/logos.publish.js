'use strict'

Meteor.publish('logos', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfLogos', Logos.find(where), {noReady: true});
  return Logos.find(where, options);
});
