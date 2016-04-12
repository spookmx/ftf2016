'use strict'

Meteor.publish('socials', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfSocials', Socials.find(where), {noReady: true});
  return Socials.find(where, options);
});
