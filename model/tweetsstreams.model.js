TweetsStreams = new Mongo.Collection('tweetsstreams');

TweetsStreams.allow({
  insert: function(userId, tweet) {
    return true;
  },
  update: function(userId, tweet, fields, modifier) {
    return true;
  },
  remove: function(userId, tweet) {
    return true;
  }
});
