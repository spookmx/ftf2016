'use strict'

Meteor.publish('categories', function(options) {
  Counts.publish(this, 'numberOfCategories', Categories.find({}), {noReady: true});
  return Categories.find({}, options);
});
