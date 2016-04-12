Meteor.startup(function() {
  if(Contents.find().count() === 0) {
    var contents = [
      {
        'name': 'Content Card 1'
      },
      {
        'name': 'Content Card 2'
      }
    ];
    contents.forEach(function(content) {
      Contents.insert(content);
    });
  }
});
