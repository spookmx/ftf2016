Meteor.startup(function() {
  if(Banners.find().count() === 0) {
    var banners = [
      {
        'name': 'banner 1'
      },
      {
        'name': 'banner 2'
      }
    ];
    banners.forEach(function(banner) {
      Banners.insert(banner);
    });
  }
});