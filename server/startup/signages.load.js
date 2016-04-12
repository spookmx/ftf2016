Meteor.startup(function() {
  if(Signages.find().count() === 0) {
    var signages = [
      {
        'name': 'signage 1'
      },
      {
        'name': 'signage 2'
      }
    ];
    signages.forEach(function(signage) {
      Signages.insert(signage);
    });
  }
});