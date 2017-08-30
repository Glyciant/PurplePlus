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
          for (var note of user.notes) {
            notes[note.id] = note.note;
          }
        }
        var bookmarks = [];
        for (var bookmark of data) {
          if (bookmark.stream && bookmark.stream.stream_type == "live") {
            bookmarks.push(bookmark);
          }
        }
        for (var bookmark of data) {
          if (bookmark.stream && bookmark.stream.stream_type == "vodcast") {
            bookmarks.push(bookmark);
          }
        }
        for (var bookmark of data) {
          if (!bookmark.stream) {
            bookmarks.push(bookmark);
          }
        }
        var results = [];
        if (req.body.query) {
          var regex = new RegExp(req.body.query.toLowerCase(), "g");
          for (var bookmark of bookmarks) {
            if (regex.test(bookmark.twitch_username)) {
              results.push(bookmark);
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
