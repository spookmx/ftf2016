Meteor.startup(function() {
  if(Streamst.find().count() === 0) {
    var streamst = [
      {
        'name': 'Stream Init'
      }
    ];
    streamst.forEach(function(stream) {
      Streamst.insert(stream);
    });
  }
  Streamst.remove({});
});
