'use strict'

Meteor.publish('streamst', function(options) {
  Counts.publish(this, 'numberOfStreamst', Streamst.find({}), {noReady: true});
  return Streamst.find({}, options);
});
