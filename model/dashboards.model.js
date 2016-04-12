Dashboards = new Mongo.Collection('dashboards');

Dashboards.allow({
  insert: function(userId, dashboard) {
    return true;
  },
  update: function(userId, dashboard, fields, modifier) {
    return true;
  },
  remove: function(userId, dashboard) {
    return true;
  }
});