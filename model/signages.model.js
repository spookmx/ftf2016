Signages = new Mongo.Collection('signages');

Signages.allow({
  insert: function(userId, signage) {
    return userId;
  },
  update: function(userId, signage, fields, modifier) {
    return userId;
  },
  remove: function(userId, signage) {
    return userId;
  }
});