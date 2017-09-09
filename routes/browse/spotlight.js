var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  Promise.all([db.users.getRandomApprovedGamingStreamer(true), db.users.getRandomApprovedByType("streamer_creative", "Creative", true), db.users.getRandomApprovedByType("streamer_irl", "IRL", true), db.users.getRandomApprovedByType("streamer_socialeating", "Social Eating", true), db.users.getRandomApprovedByType("streamer_talkshow", "Talk Show", true), db.users.getRandomApprovedByType("streamer_music", "Music", true)]).then(function(data) {
    res.render("spotlight", { title: "Streamer Spotlight", streamer_gaming: data[0][0], streamer_creative: data[1][0], streamer_irl: data[2][0], streamer_socialeating: data[3][0], streamer_talkshow: data[4][0], streamer_music: data[5][0] });
  })
});

module.exports = router;
