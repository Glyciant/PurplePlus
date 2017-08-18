var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  Promise.all([db.users.getRandomApprovedByType("streamer_gaming", true), db.users.getRandomApprovedByType("streamer_creative", true), db.users.getRandomApprovedByType("streamer_irl", true), db.users.getRandomApprovedByType("streamer_socialeating", true), db.users.getRandomApprovedByType("streamer_talkshow", true), db.users.getRandomApprovedByType("streamer_music", true)]).then(function(data) {
    res.render("spotlight", { title: "Streamer Spotlight", streamer_gaming: data[0][0], streamer_creative: data[1][0], streamer_irl: data[2][0], streamer_socialeating: data[3][0], streamer_talkshow: data[4][0], streamer_music: data[5][0] });
  })
});

module.exports = router;
