Selectedtweets = new Mongo.Collection('selectedtweets');

Selectedtweets.allow({
  insert: function(userId, selectedtweet) {
    return true;
  },
  update: function(userId, selectedtweet, fields, modifier) {
    return true;
  },
  remove: function(userId, selectedtweet) {
    return true;
  }
});