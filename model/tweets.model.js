Tweets = new Mongo.Collection('tweets');

Tweets.allow({
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