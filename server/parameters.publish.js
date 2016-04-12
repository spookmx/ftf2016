'use strict'

Meteor.publish('parameters', function(dashboard) {
  var where = {
    'dashboard': dashboard
  };
  return Parameters.find(where);
}, {
  url: "api/beta/dashboard/:0/parameters",
  httpMethod: "get"
});

Meteor.method("parameters.post", function (parameters, dashboard) {
  var response = [];
  Object.keys(parameters).forEach(function(key) {
    var parameter = parameters[key];
    var process = Parameters.update(
      {'_id':parameter.r, 'dashboard': dashboard},
      { $push: {
        'values': parameter.v
      },$set: {
        'lastUpdated': new Date()
      }
    });
    response.push({'r':parameter.r, 's':process});
  });
  return {'response':response};
}, {
  url: "api/beta/parameters/",
  httpMethod: "post",
  getArgsFromRequest: function (res) {
    var content = res.body;
    return [ content.parameters, content.dashboard];
  }
});
