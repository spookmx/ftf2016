Meteor.startup(function() {
  if(Dashboards.find().count() === 0) {
    var dashboards = [
      {
        'name': 'dashboard 1'
      },
      {
        'name': 'dashboard 2'
      }
    ];
    dashboards.forEach(function(dashboard) {
      Dashboards.insert(dashboard);
    });
  }
});