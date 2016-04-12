Socials = new Mongo.Collection('socials');

Socials.allow({
  insert: function(userId, social) {
    return userId;
  },
  update: function(userId, social, fields, modifier) {
    return userId;
  },
  remove: function(userId, social) {
    return userId;
  }
});