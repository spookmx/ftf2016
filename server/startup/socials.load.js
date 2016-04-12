Meteor.startup(function() {
  if(Socials.find().count() === 0) {
    var socials = [
      {
        'name': 'Social Content Collection for #FTF'
      },
      {
        'name': 'Social Content Collection for #NXPFTF'
      }
    ];
    socials.forEach(function(social) {
      Socials.insert(social);
    });
  }
});
