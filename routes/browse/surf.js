var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  db.cache.getByRandom(1, "").then(function(data) {
    var twitter;
    if (data && data[0]) {
      if (data[0].profile && data[0].profile.social_media) {
        twitter = data[0].profile.social_media.twitter;
      }
      res.render("surf", { title: "Stream Surf", user: data[0].stream.channel.name, display_name: data[0].stream.channel.display_name, game: data[0].stream.channel.game, twitter: twitter });
    }
    else {
      res.render('error', { title: '500 Error', code: '500', message: 'There are currently no streams available to show.' });
    }
  });
});

module.exports = router;
