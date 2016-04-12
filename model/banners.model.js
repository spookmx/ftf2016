Banners = new Mongo.Collection('banners');

Banners.allow({
  insert: function(userId, banner) {
    return true;
  },
  update: function(userId, banner, fields, modifier) {
    return true;
  },
  remove: function(userId, banner) {
    return true;
  }
});