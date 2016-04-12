'use strict'

Meteor.publish('dashboards', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfDashboards', Dashboards.find(where), {noReady: true});
  return Dashboards.find(where, options);
}, {
  url: "api/beta/dashboards/",
  httpMethod: "get"
});

Meteor.publish('dashboard.single', function(id) {
  return Dashboards.find({'_id':id});
}, {
  url: "api/beta/dashboard/:0",
  httpMethod: "get"
});
