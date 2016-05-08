Meteor.startup(function() {
  if(Logos.find().count() === 0) {
    var logos = [
      {
        'name': 'logo 1'
      }
    ];
    logos.forEach(function(banner) {
      Logos.insert(banner);
    });
  }
});
