var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
      if (data.profile && data.profile.status == "approved") {
        res.render("home", { title: "Home" });
      }
      else {
        res.redirect("/browse/streams");
      }
    });
  }
  else {
    res.redirect("/browse/streams");
  }
});

router.post("/viewing/profiles", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
      if (data.profile && data.profile.status == "approved") {
        var viewing = [],
            i = [];

        if (data.profile.types && data.profile.types.viewer) {
          if (data.profile.types.viewer.streams.action == "true") {
            i.push({ "profile.types.streamer_gaming.genres.action": "true" });
          }
          if (data.profile.types.viewer.streams.adventure == "true") {
            i.push({ "profile.types.streamer_gaming.genres.adventure": "true" });
          }
          if (data.profile.types.viewer.streams.roleplaying == "true") {
            i.push({ "profile.types.streamer_gaming.genres.roleplaying": "true" });
          }
          if (data.profile.types.viewer.streams.simulation == "true") {
            i.push({ "profile.types.streamer_gaming.genres.simulation": "true" });
          }
          if (data.profile.types.viewer.streams.strategy == "true") {
            i.push({ "profile.types.streamer_gaming.genres.strategy": "true" });
          }
          if (data.profile.types.viewer.streams.survival == "true") {
            i.push({ "profile.types.streamer_gaming.genres.survival": "true" });
          }
          if (data.profile.types.viewer.streams.horror == "true") {
            i.push({ "profile.types.streamer_gaming.genres.horror": "true" });
          }
          if (data.profile.types.viewer.streams.cooking == "true") {
            i.push({ "profile.types.streamer_creative.activities.cooking": "true" });
          }
          if (data.profile.types.viewer.streams.drawing == "true") {
            i.push({ "profile.types.streamer_creative.activities.drawing": "true" });
          }
          if (data.profile.types.viewer.streams.painting == "true") {
            i.push({ "profile.types.streamer_creative.activities.painting": "true" });
          }
          if (data.profile.types.viewer.streams.programming == "true") {
            i.push({ "profile.types.streamer_creative.activities.programming": "true" });
          }
          if (data.profile.types.viewer.streams.editing == "true") {
            i.push({ "profile.types.streamer_creative.activities.editing": "true" });
          }
          if (data.profile.types.viewer.streams.irl == "true") {
            i.push({ "profile.types.streamer_irl": { $exists: true } });
          }
          if (data.profile.types.viewer.streams.socialeating == "true") {
            i.push({ "profile.types.streamer_socialeating": { $exists: true } });
          }
          if (data.profile.types.viewer.streams.talkshow == "true") {
            i.push({ "profile.types.streamer_talkshow": { $exists: true } });
          }
          if (data.profile.types.viewer.streams.music == "true") {
            i.push({ "profile.types.streamer_music": { $exists: true } });
          }
          if (i[0]) {
            viewing.push({ $or: i });
            if (data.profile.types.viewer.family == "true") {
              viewing.push({ mature: false });
            }
          }
        }

        if (!req.body.ids) {
          req.body.ids = [];
        }

        if (viewing[0] && viewing[0]["$or"][0]) {
          db.users.query({ $and: [{ "profile.status": "approved" }, { $and: viewing }, { "twitch_id": { $nin: req.body.ids, $ne: req.session.twitch.id } } ] }, 8).then(function(data) {
            if (data[0]) {
              res.render("profile_partial.html", { data: data });
            }
            else if (req.body.init) {
              res.render("missing_partial.html", { message: "We could not find any profile suggestions for you." });
            }
            else {
              res.send("");
            }
          });
        }
        else {
          res.send("");
        }
      }
      else {
        res.send("");
      }
    });
  }
  else {
    res.send("");
  }
});

router.post("/viewing/streams", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
      if (data.profile && data.profile.status == "approved") {
        var viewing = [],
            i = [];

        if (data.profile.types && data.profile.types.viewer) {
          if (data.profile.types.viewer.streams.action == "true") {
            i.push({ "profile.types.streamer_gaming.genres.action": "true" });
          }
          if (data.profile.types.viewer.streams.adventure == "true") {
            i.push({ "profile.types.streamer_gaming.genres.adventure": "true" });
          }
          if (data.profile.types.viewer.streams.roleplaying == "true") {
            i.push({ "profile.types.streamer_gaming.genres.roleplaying": "true" });
          }
          if (data.profile.types.viewer.streams.simulation == "true") {
            i.push({ "profile.types.streamer_gaming.genres.simulation": "true" });
          }
          if (data.profile.types.viewer.streams.strategy == "true") {
            i.push({ "profile.types.streamer_gaming.genres.strategy": "true" });
          }
          if (data.profile.types.viewer.streams.survival == "true") {
            i.push({ "profile.types.streamer_gaming.genres.survival": "true" });
          }
          if (data.profile.types.viewer.streams.horror == "true") {
            i.push({ "profile.types.streamer_gaming.genres.horror": "true" });
          }
          if (data.profile.types.viewer.streams.cooking == "true") {
            i.push({ "profile.types.streamer_creative.activities.cooking": "true" });
          }
          if (data.profile.types.viewer.streams.drawing == "true") {
            i.push({ "profile.types.streamer_creative.activities.drawing": "true" });
          }
          if (data.profile.types.viewer.streams.painting == "true") {
            i.push({ "profile.types.streamer_creative.activities.painting": "true" });
          }
          if (data.profile.types.viewer.streams.programming == "true") {
            i.push({ "profile.types.streamer_creative.activities.programming": "true" });
          }
          if (data.profile.types.viewer.streams.editing == "true") {
            i.push({ "profile.types.streamer_creative.activities.editing": "true" });
          }
          if (data.profile.types.viewer.streams.irl == "true") {
            i.push({ "profile.types.streamer_irl": { $exists: true } });
          }
          if (data.profile.types.viewer.streams.socialeating == "true") {
            i.push({ "profile.types.streamer_socialeating": { $exists: true } });
          }
          if (data.profile.types.viewer.streams.talkshow == "true") {
            i.push({ "profile.types.streamer_talkshow": { $exists: true } });
          }
          if (data.profile.types.viewer.streams.music == "true") {
            i.push({ "profile.types.streamer_music": { $exists: true } });
          }
          if (i[0]) {
            viewing.push({ $or: i });
            if (data.profile.types.viewer.family == "true") {
              viewing.push({ mature: false });
            }
          }
        }

        if (!req.body.ids) {
          req.body.ids = [];
        }

        if (viewing[0] && viewing[0]["$or"][0]) {
          db.users.query({ $and: [{ "profile.status": "approved" }, { "stream.stream_type": "live" }, { $and: viewing }, { "twitch_id": { $nin: req.body.ids, $ne: req.session.twitch.id } } ] }, 8).then(function(data) {
            if (data[0]) {
              res.render("stream_partial.html", { data: data });
            }
            else if (req.body.init) {
              res.render("missing_partial.html", { message: "We could not find any stream suggestions for you." });
            }
            else {
              res.send("");
            }
          });
        }
        else {
          res.send("");
        }
      }
      else {
        res.send("");
      }
    });
  }
  else {
    res.send("");
  }
});

router.post("/collaborations/profiles", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
      if (data.profile && data.profile.status == "approved") {
        var collaborations = [],
            followers = data.followers,
            i = [];
        if (data.profile.types && data.profile.types.streamer_gaming) {
          if (data.profile.types.streamer_gaming.genres.action == "true") {
            i.push({ "profile.types.streamer_gaming.genres.action": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.adventure == "true") {
            i.push({ "profile.types.streamer_gaming.genres.adventure": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.roleplaying == "true") {
            i.push({ "profile.types.streamer_gaming.genres.roleplaying": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.simulation == "true") {
            i.push({ "profile.types.streamer_gaming.genres.simulation": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.strategy == "true") {
            i.push({ "profile.types.streamer_gaming.genres.strategy": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.survival == "true") {
            i.push({ "profile.types.streamer_gaming.genres.survival": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.horror == "true") {
            i.push({ "profile.types.streamer_gaming.genres.horror": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.other == "true") {
            i.push({ "profile.types.streamer_gaming.genres.other": "true" });
          }
        }

        if (data.profile.types && data.profile.types.streamer_creative) {
          if (data.profile.types.streamer_creative.activities.cooking == "true") {
            i.push({ "profile.types.streamer_creative.activities.cooking": "true" });
          }
          if (data.profile.types.streamer_creative.activities.drawing == "true") {
            i.push({ "profile.types.streamer_creative.activities.drawing": "true" });
          }
          if (data.profile.types.streamer_creative.activities.painting == "true") {
            i.push({ "profile.types.streamer_creative.activities.painting": "true" });
          }
          if (data.profile.types.streamer_creative.activities.programming == "true") {
            i.push({ "profile.types.streamer_creative.activities.programming": "true" });
          }
          if (data.profile.types.streamer_creative.activities.editing == "true") {
            i.push({ "profile.types.streamer_creative.activities.editing": "true" });
          }
          if (data.profile.types.streamer_creative.activities.other == "true") {
            i.push({ "profile.types.streamer_creative.activities.other": "true" });
          }
        }

        if (data.profile.types && data.profile.types.streamer_irl) {
          i.push({ "profile.types.streamer_irl": { $exists: true } });
        }

        if (data.profile.types && data.profile.types.streamer_socialeating) {
          i.push({ "profile.types.streamer_socialeating": { $exists: true } });
        }

        if (data.profile.types && data.profile.types.streamer_talkshow) {
          i.push({ "profile.types.streamer_talkshow": { $exists: true } });
        }

        if (data.profile.types && data.profile.types.streamer_music) {
          i.push({ "profile.types.streamer_music": { $exists: true } });
        }

        if (i[0]) {
          collaborations.push({ $or: i });
          collaborations.push({ followers: {
              $lte: followers + (followers / 10), $gte: followers - (followers / 10),
          }});
        }

        if (!req.body.ids) {
          req.body.ids = [];
        }

        if (collaborations[0] && collaborations[0]["$or"][0]) {
          db.users.query({ $and: [{ "profile.status": "approved" }, { $and: collaborations }, { "twitch_id": { $nin: req.body.ids, $ne: req.session.twitch.id } } ] }, 8).then(function(data) {
            if (data[0]) {
              res.render("profile_partial.html", { data: data });
            }
            else if (req.body.init) {
              res.render("missing_partial.html", { message: "We could not find any profile suggestions for you." });
            }
            else {
              res.send("");
            }
          });
        }
        else {
          res.send("");
        }
      }
      else {
        res.send("");
      }
    });
  }
  else {
    res.send("");
  }
});

router.post("/collaborations/streams", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
      if (data.profile && data.profile.status == "approved") {
        var collaborations = [],
            followers = data.followers,
            i = [];
        if (data.profile.types && data.profile.types.streamer_gaming) {
          if (data.profile.types.streamer_gaming.genres.action == "true") {
            i.push({ "profile.types.streamer_gaming.genres.action": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.adventure == "true") {
            i.push({ "profile.types.streamer_gaming.genres.adventure": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.roleplaying == "true") {
            i.push({ "profile.types.streamer_gaming.genres.roleplaying": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.simulation == "true") {
            i.push({ "profile.types.streamer_gaming.genres.simulation": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.strategy == "true") {
            i.push({ "profile.types.streamer_gaming.genres.strategy": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.survival == "true") {
            i.push({ "profile.types.streamer_gaming.genres.survival": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.horror == "true") {
            i.push({ "profile.types.streamer_gaming.genres.horror": "true" });
          }
          if (data.profile.types.streamer_gaming.genres.other == "true") {
            i.push({ "profile.types.streamer_gaming.genres.other": "true" });
          }
        }

        if (data.profile.types && data.profile.types.streamer_creative) {
          if (data.profile.types.streamer_creative.activities.cooking == "true") {
            i.push({ "profile.types.streamer_creative.activities.cooking": "true" });
          }
          if (data.profile.types.streamer_creative.activities.drawing == "true") {
            i.push({ "profile.types.streamer_creative.activities.drawing": "true" });
          }
          if (data.profile.types.streamer_creative.activities.painting == "true") {
            i.push({ "profile.types.streamer_creative.activities.painting": "true" });
          }
          if (data.profile.types.streamer_creative.activities.programming == "true") {
            i.push({ "profile.types.streamer_creative.activities.programming": "true" });
          }
          if (data.profile.types.streamer_creative.activities.editing == "true") {
            i.push({ "profile.types.streamer_creative.activities.editing": "true" });
          }
          if (data.profile.types.streamer_creative.activities.other == "true") {
            i.push({ "profile.types.streamer_creative.activities.other": "true" });
          }
        }

        if (data.profile.types && data.profile.types.streamer_irl) {
          i.push({ "profile.types.streamer_irl": { $exists: true } });
        }

        if (data.profile.types && data.profile.types.streamer_socialeating) {
          i.push({ "profile.types.streamer_socialeating": { $exists: true } });
        }

        if (data.profile.types && data.profile.types.streamer_talkshow) {
          i.push({ "profile.types.streamer_talkshow": { $exists: true } });
        }

        if (data.profile.types && data.profile.types.streamer_music) {
          i.push({ "profile.types.streamer_music": { $exists: true } });
        }

        if (i[0]) {
          collaborations.push({ $or: i });
          collaborations.push({ followers: {
              $lte: followers + (followers / 10), $gte: followers - (followers / 10),
          }});
        }

        if (!req.body.ids) {
          req.body.ids = [];
        }

        if (collaborations[0] && collaborations[0]["$or"][0]) {
          db.users.query({ $and: [{ "profile.status": "approved" }, { "stream.stream_type": "live" }, { $and: collaborations }, { "twitch_id": { $nin: req.body.ids, $ne: req.session.twitch.id } } ] }, 8).then(function(data) {
            if (data[0]) {
              res.render("stream_partial.html", { data: data });
            }
            else if (req.body.init) {
              res.render("missing_partial.html", { message: "We could not find any stream suggestions for you." });
            }
            else {
              res.send("");
            }
          });
        }
        else {
          res.send("");
        }
      }
      else {
        res.send("");
      }
    });
  }
  else {
    res.send("");
  }
});

module.exports = router;
