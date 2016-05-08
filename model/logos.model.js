Logos = new Mongo.Collection('logos');

Logos.allow({
  insert: function(userId, logo) {
    return true;
  },
  update: function(userId, logo, fields, modifier) {
    return true;
  },
  remove: function(userId, logo) {
    return true;
  }
});
