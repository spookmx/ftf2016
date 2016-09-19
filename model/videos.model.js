Videos = new FS.Collection("videos", {
  stores: [
    new FS.Store.FileSystem("videos")
  ],
  filter: {
    allow: {
      contentTypes: ['video/*']
    }
  }
});

if (Meteor.isServer) {
  Videos.allow({
    insert: function (userId) {
      return (userId ? true : false);
    },
    remove: function (userId) {
      return (userId ? true : false);
    },
    download: function () {
      return true;
    },
    update: function (userId) {
      return (userId ? true : false);
    }
  });

  FS.HTTP.setHeadersForGet([
  ['Cache-Control', 'public, max-age=31536000'],
  ['Expires', 'Sat, 31 Dec 2033 04:20:00 GMT']
]);

  Meteor.publish('videos', function() {
    return Videos.find({});
  });
}
