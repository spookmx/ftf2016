Streamst = new Mongo.Collection('streamst');

Streamst.allow({
  insert: function(userId, stream) {
    return true;
  },
  update: function(userId, stream, fields, modifier) {
    return true;
  },
  remove: function(userId, stream) {
    return true;
  }
});
