'use strict'

Meteor.publish('contents', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfContents', Contents.find(where), {noReady: true});
  return Contents.find(where, options);
});
