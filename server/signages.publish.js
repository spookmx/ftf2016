'use strict'

Meteor.publish('signages', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfSignages', Signages.find(where), {noReady: true});
  return Signages.find(where, options);
});
