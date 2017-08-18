var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  Promise.all([db.users.getAllByTwoos(0, 25), db.users.getAllByProfileVotes(0)]).then(function(data) {
    res.render("leaderboards", { title: "Leaderboards", twoos: data[0], votes: data[1], offset: 0, session: req.session.twitch });
  })
});

router.post("/twoos", function(req, res, next) {
  if (req.body.offset && !isNaN(parseInt(req.body.offset))) {
    db.users.getAllByTwoos(parseInt(req.body.offset), 25).then(function(data) {
      res.render("leaderboard_partial", { data: data, offset: parseInt(req.body.offset), session: req.session.twitch });
    });
  }
  else {
    res.send("");
  }
});

router.post("/votes", function(req, res, next) {
  if (req.body.offset && !isNaN(parseInt(req.body.offset)) && req.body.ids) {
    db.users.getAllByProfileVotes(parseInt(req.body.offset), req.body.ids).then(function(data) {
      res.render("leaderboard_partial", { data: data, offset: parseInt(req.body.offset), session: req.session.twitch });
    });
  }
  else {
    res.send("");
  }
});

module.exports = router;
