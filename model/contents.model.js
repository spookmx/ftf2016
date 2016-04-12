Contents = new Mongo.Collection('contents');

Contents.allow({
  insert: function(userId, content) {
    return true;
  },
  update: function(userId, content, fields, modifier) {
    return true;
  },
  remove: function(userId, content) {
    return true;
  }
});