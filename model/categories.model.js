Categories = new Mongo.Collection('categories');

Categories.allow({
  insert: function(userId, category) {
    return true;
  },
  update: function(userId, category, fields, modifier) {
    return true;
  },
  remove: function(userId, category) {
    return true;
  }
});
