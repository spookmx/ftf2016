'use strict'

Meteor.publish('tweets', function(options) {
  Counts.publish(this, 'numberOfTweets', Tweets.find({}), {noReady: true});
  return Tweets.find({}, options);
});
