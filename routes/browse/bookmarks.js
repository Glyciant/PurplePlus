var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.twitch) {
    res.render("bookmarks", { title: "Bookmarks" });
  }
  else {
    req.session.return = "/browse/bookmarks";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/search", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(user) {
      db.users.getByTwitchIds(user.bookmarks).then(function(data) {
        var notes = {};
        if (user.notes) {
          for (var i in user.notes) {
            notes[user.notes[i].id] = user.notes[i].note;
          }
        }
        var bookmarks = [];
        for (var i in data) {
          if (data[i].stream && data[i].stream.stream_type == "live") {
            bookmarks.push(data[i]);
          }
        }
        for (var i in data) {
          if (data[i].stream && data[i].stream.stream_type == "vodcast") {
            bookmarks.push(data[i]);
          }
        }
        for (var i in data) {
          if (!data[i].stream) {
            bookmarks.push(data[i]);
          }
        }
        var results = [];
        if (req.body.query) {
          var regex = new RegExp(req.body.query.toLowerCase(), "g");
          for (var i in bookmarks) {
            if (regex.test(bookmarks[i].twitch_username)) {
              results.push(bookmarks[i]);
            }
          }
        }
        else {
          results = bookmarks;
        }
        res.render("bookmark_partial", { data: results, notes: notes });
      });
    });
  }
  else {
    res.send("");
  }
});

module.exports = router;
