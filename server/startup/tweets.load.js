Meteor.startup(function() {
  //Initialize Tweets Collection
  if(Tweets.find().count() === 0) {
    console.log("Tweets");
    var tweets = [
      'Tweets Collection Init',
    ];
    tweets.forEach(function(tweet) {
      if(!tweet.retweeted_status){
        Tweets.insert({
          tweet: tweet,
          createdAt: new Date()
        });
      }
    });
  }


    //Start twitter instance
    T = new Twit({
      consumer_key:         'sE8ebbuGPSMeTG9mON0oXci4n',
      consumer_secret:      'M7b0xgbqOLanhlsB2rhMTft1snNql3HJctjOqW5OPCTsgycDPf',
      access_token:         '38565910-oWfiC6MNCaRlrpkQLJxBUpuWJi2zkQMAyuaabxjx5',
      access_token_secret:  'mNy7jQiCnhY2FFiFhWK7ET9S1r1j3cgRdhB1Xl9gAFhSa',
      timeout_ms:           60*1000,
    });

    //Global streams Holder
    Streams = {};

    TweetNew = Meteor.bindEnvironment(function(tweet, user){
      if(!tweet.retweeted_status){
        var image = tweet.user.profile_image_url_https;
        var imageArray = image.split("_normal");
        var imageNew = imageArray[0]+imageArray[1];
        tweet.user.profile_image_url_https = imageNew;
        !tweet.entities ? tweet.entities = {} : null;
        !tweet.entities.media ? tweet.entities.media = [{media_url_https:false}] : null;
        if(!tweet.entities.media[0].media_url_https){
          var backgroundImage = "/images/tweetbkg/bkg-"+Math.floor(Math.random()*14)+".png";
          tweet.entities.media = [{"media_url_https": backgroundImage}];
        }
        tweet.text = tweet.text.replace(/(https?|ftp):\/\/[\.[a-zA-Z0-9\/\-]+/, "");
        tweet.text = tweet.text.replace(/(https?|ftp):\/\/[\.[a-zA-Z0-9\/\-]+/, "");
        Tweets.insert({
          user: user,
          favorited: false,
          type: 'stream',
          tweet: tweet,
          createdAt: new Date()
        });
      }
      });

    TweetNewSearch = Meteor.bindEnvironment(function(tweet, user){
      var image = tweet.user.profile_image_url_https;
      var imageArray = image.split("_normal");
      var imageNew = imageArray[0]+imageArray[1];
      tweet.user.profile_image_url_https = imageNew;
      !tweet.entities ? tweet.entities = {} : null;
      !tweet.entities.media ? tweet.entities.media = [{media_url_https:false}] : null;
      if(!tweet.entities.media[0].media_url_https){
        var backgroundImage = "/images/tweetbkg/bkg-"+Math.floor(Math.random()*14)+".png";
        tweet.entities.media = [{"media_url_https": backgroundImage}];
      }
      tweet.text = tweet.text.replace(/(https?|ftp):\/\/[\.[a-zA-Z0-9\/\-]+/, "");
      tweet.text = tweet.text.replace(/(https?|ftp):\/\/[\.[a-zA-Z0-9\/\-]+/, "");
      var previouslySelected = Selectedtweets.findOne({"tweet.id": tweet.id});
      var favorited = false;
      previouslySelected ? favorited = true : null;
      Tweets.insert({
        user: user,
        favorited: favorited,
        type: 'search',
        tweet: tweet,
        createdAt: new Date()
      });
    });

    TweetStreamNew = Meteor.bindEnvironment(function(user){
      console.log("New stream started for userID: "+user);
      Streamst.insert({
       user: user,
       createdAt: new Date()
      });
    });

    //Methods to work with temporary tweets
    Meteor.methods({
      TweetStartStream: function (target) {
        user = this.userId;
        Streams["stream"+user] = T.stream('statuses/filter', { track: target }).on('tweet', function (tweet){
          TweetNew(tweet, user);
        });
        TweetStreamNew(user);
        return "Twitter stream started";
      },
      TweetSearch: function (target) {
        user = this.userId;
        T.get('search/tweets', { q: target+" -filter:retweets", count: 100 }, function(err, data, response) {
          user = this.userId;
          for(var i=0; i<data.statuses.length; i++){
            TweetNewSearch(data.statuses[i], user);
          }
        });
        return "Twitter search requested";
      },
      TweetStopStream: function () {
        user = this.userId;
        Streams["stream"+user].stop();
        Streamst.remove({user: this.userId});
        return "Twitter stream from "+user+" has stopped";
      },
      TweetClearStream: function () {
        Tweets.remove({type:'stream'});
        return "Twitter stream cleared";
      },
      TweetClearSelected: function () {
        Selectedtweets.remove({});
        return "Selected tweets cleared";
      },
      TweetClearSearch: function () {
        Tweets.remove({type:'search'});
        return "Twitter search cleared";
      },
      TweetRemove: function (tweet) {
        Tweets.remove({_id: tweet});
        return "Tweet removed";
      }
    });

});
