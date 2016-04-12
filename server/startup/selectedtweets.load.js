Meteor.startup(function() {
  if(Selectedtweets.find().count() === 0) {
    var selectedtweets = [
      {
        'name': 'selectedtweet 1'
      },
      {
        'name': 'selectedtweet 2'
      }
    ];
    selectedtweets.forEach(function(selectedtweet) {
      Selectedtweets.insert(selectedtweet);
    });
  }
});