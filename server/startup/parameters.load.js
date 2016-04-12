Meteor.startup(function() {
  if(Parameters.find().count() === 0) {
    var parameters = [
      {
        'name': 'parameter 1'
      },
      {
        'name': 'parameter 3333'
      }
    ];
    parameters.forEach(function(parameter) {
      Parameters.insert(parameter);
    });
  }
});
