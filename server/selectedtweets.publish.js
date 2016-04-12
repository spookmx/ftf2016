'use strict'

Meteor.publish('selectedtweets', function(options) {
  Counts.publish(this, 'numberOfSelectedtweets', Selectedtweets.find({}), {noReady: true});
  return Selectedtweets.find({}, options);
});
