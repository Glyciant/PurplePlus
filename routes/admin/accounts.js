var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.type == "mod") {
    res.render("admin_accounts", { title: "Manage Accounts" });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
  }
  else {
    req.session.return = "/admin/accounts";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/get", function(req, res, next) {
  if (req.session.type == "mod") {
    if (req.body.query) {
      if (req.body.field == "reddit_name") {
        db.users.getByRedditUsername(req.body.query.toLowerCase()).then(function(data) {
          if (data) {
            res.send({ message: "success", data: data });
          }
          else {
            res.send({ message: "not_found" });
          }
        });
      }
      else if (req.body.field == "reddit_id") {
        db.users.getByRedditId(req.body.query).then(function(data) {
          if (data) {
            res.send({ message: "success", data: data });
          }
          else {
            res.send({ message: "not_found" });
          }
        });
      }
      else if (req.body.field == "twitch_name") {
        db.users.getByTwitchUsername(req.body.query.toLowerCase()).then(function(data) {
          if (data) {
            res.send({ message: "success", data: data });
          }
          else {
            res.send({ message: "not_found" });
          }
        });
      }
      else if (req.body.field == "twitch_id") {
        db.users.getByTwitchId(req.body.query).then(function(data) {
          if (data) {
            res.send({ message: "success", data: data });
          }
          else {
            res.send({ message: "not_found" });
          }
        });
      }
      else if (req.body.field == "discord") {
        db.users.getByDiscordId(req.body.query).then(function(data) {
          if (data) {
            res.send({ message: "success", data: data });
          }
          else {
            res.send({ message: "not_found" });
          }
        });
      }
    }
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/submit", function(req, res, next) {
  if (req.session.type == "mod") {
    if (!req.body.balance) {
      req.body.balance = 0;
    }
    if ((isNaN(parseFloat(req.body.balance)) === true) || (req.body.type !== "user" && req.body.type !== "mod" && req.body.type !== "helper") || (req.body.subreddit !== "user" && req.body.subreddit !== "bot" && req.body.subreddit !== "contributor" && req.body.subreddit !== "wiki") || (req.body.admin == "true" && req.session.admin === false) || (req.body.profile == "approved" && (req.body.flair !== "streamer_gaming" && req.body.flair !== "streamer_creative" && req.body.flair !== "streamer_socialeating" && req.body.flair !== "streamer_irl" && req.body.flair !== "streamer_talkshow" && req.body.flair !== "streamer_music" && req.body.flair !== "artist" && req.body.flair !== "developer" && req.body.flair !== "communitymanager" && req.body.flair !== "viewer" && req.body.flair !== "moderator" && req.body.flair !== "other")) || (req.body.profile && (req.body.profile !== "pending" && req.body.profile !== "approved" && req.body.profile !== "rejected" && req.body.profile !== "clear"))) {
      res.send({ message: "invalid_request" });
    }
    else {
      db.users.getByTwitchId(req.body.id).then(function(data) {
        if (data) {
          data.admin = (req.body.admin == "true");
          data.beta = (req.body.beta == "true");
          data.display.ama = (req.body.ama == "true");
          data.display.subreddit = req.body.subreddit;
          if (!data.bans) {
            data.bans = {};
          }
          data.bans.profile = (req.body.bans.profile == "true");
          data.bans.nominations = (req.body.bans.nominations == "true");
          data.bans.requests = (req.body.bans.requests == "true");
          if (req.body.balance != data.balance && data.transactions) {
            data.transactions.push({
              timestamp: Date.now(),
              title: "Manual Edit",
              type: "Admin Action",
              old: parseFloat(data.balance),
              new: parseFloat(req.body.balance),
              difference: parseFloat((parseFloat(req.body.balance)).toFixed(2)) - parseFloat(data.balance),
              description: null
            });
          }
          data.balance = parseFloat(req.body.balance);
          data.type = req.body.type;
          if (req.body.profile == "pending") {
            data.profile.status = "pending";
            data.profile.rejection_reason = null;
          }
          else if (req.body.profile == "approved") {
            data.display.profile = req.body.flair;
            data.profile.status = "approved";
            data.profile.rejection_reason = null;
          }
          else if (req.body.profile == "rejected") {
            data.profile.status = "rejected";
            data.profile.rejection_reason = req.body.rejection_reason;
          }
          else if (req.body.profile == "clear") {
            data.profile = null;
          }
          Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success" });
            });
          });
        }
        else {
          res.send({ message: "not_found" });
        }
      });
    }
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/list", function(req, res, next) {
  if (req.session.type == "mod") {
    var i = [];
    if (req.body.site_admin == "true") {
      i.push({ admin: true });
    }
    else if (req.body.site_admin == "false") {
      i.push({ admin: false });
    }
    if (req.body.mod == "true") {
      i.push({ type: "mod" });
    }
    else if (req.body.mod == "false") {
      i.push({ type: { $ne: "mod" } });
    }
    if (req.body.helper == "true") {
      i.push({ type: "helper" });
    }
    else if (req.body.helper == "false") {
      i.push({ type: { $ne: "helper" } });
    }
    if (req.body.wiki == "true") {
      i.push({ "display.subreddit": "wiki" });
    }
    else if (req.body.wiki == "false") {
      i.push({ "display.subreddit": { $ne: "wiki" } });
    }
    if (req.body.contributor == "true") {
      i.push({ "display.subreddit": "contributor" });
    }
    else if (req.body.contributor == "false") {
      i.push({ "display.subreddit": { $ne: "contributor" } });
    }
    if (req.body.bot == "true") {
      i.push({ "display.subreddit": "bot" });
    }
    else if (req.body.bot == "false") {
      i.push({ "display.subreddit": { $ne: "bot" } });
    }
    if (req.body.staff == "true") {
      i.push({ "display.twitch": "staff" });
    }
    else if (req.body.staff == "false") {
      i.push({ "display.twitch": { $ne: "staff" } });
    }
    if (req.body.admin == "true") {
      i.push({ "display.twitch": "admin" });
    }
    else if (req.body.admin == "false") {
      i.push({ "display.twitch": { $ne: "admin" } });
    }
    if (req.body.global_mod == "true") {
      i.push({ "display.twitch": "global_mod" });
    }
    else if (req.body.global_mod == "false") {
      i.push({ "display.twitch": { $ne: "global_mod" } });
    }
    if (req.body.ama == "true") {
      i.push({ "display.ama": true });
    }
    else if (req.body.ama == "false") {
      i.push({ "display.ama": false });
    }
    if (req.body.streamer_gaming == "true") {
      i.push({ "profile.types.streamer_gaming": { $exists: true } });
    }
    else if (req.body.streamer_gaming == "false") {
      i.push({ "profile.types.streamer_gaming": { $exists: false } });
    }
    if (req.body.streamer_creative == "true") {
      i.push({ "profile.types.streamer_creative": { $exists: true } });
    }
    else if (req.body.streamer_creative == "false") {
      i.push({ "profile.types.streamer_creative": { $exists: false } });
    }
    if (req.body.streamer_irl == "true") {
      i.push({ "profile.types.streamer_irl": { $exists: true } });
    }
    else if (req.body.streamer_irl == "false") {
      i.push({ "profile.types.streamer_irl": { $exists: false } });
    }
    if (req.body.streamer_socialeating == "true") {
      i.push({ "profile.types.streamer_socialeating": { $exists: true } });
    }
    else if (req.body.streamer_socialeating == "false") {
      i.push({ "profile.types.streamer_socialeating": { $exists: false } });
    }
    if (req.body.streamer_talkshow == "true") {
      i.push({ "profile.types.streamer_talkshow": { $exists: true } });
    }
    else if (req.body.streamer_talkshow == "false") {
      i.push({ "profile.types.streamer_talkshow": { $exists: false } });
    }
    if (req.body.streamer_music == "true") {
      i.push({ "profile.types.streamer_music": { $exists: true } });
    }
    else if (req.body.streamer_music == "false") {
      i.push({ "profile.types.streamer_music": { $exists: false } });
    }
    if (req.body.artist == "true") {
      i.push({ "profile.types.artist": { $exists: true } });
    }
    else if (req.body.artist == "false") {
      i.push({ "profile.types.artist": { $exists: false } });
    }
    if (req.body.developer == "true") {
      i.push({ "profile.types.developer": { $exists: true } });
    }
    else if (req.body.developer == "false") {
      i.push({ "profile.types.developer": { $exists: false } });
    }
    if (req.body.communitymanager == "true") {
      i.push({ "profile.types.communitymanager": { $exists: true } });
    }
    else if (req.body.communitymanager == "false") {
      i.push({ "profile.types.communitymanager": { $exists: false } });
    }
    if (req.body.moderator == "true") {
      i.push({ "profile.types.moderator": { $exists: true } });
    }
    else if (req.body.moderator == "false") {
      i.push({ "profile.types.moderator": { $exists: false } });
    }
    if (req.body.viewer == "true") {
      i.push({ "profile.types.viewer": { $exists: true } });
    }
    else if (req.body.viewer == "false") {
      i.push({ "profile.types.viewer": { $exists: false } });
    }
    if (req.body.other == "true") {
      i.push({ "profile.types.other": { $exists: true } });
    }
    else if (req.body.other == "false") {
      i.push({ "profile.types.other": { $exists: false } });
    }
    if (req.body.profile == "pending") {
      i.push({ "profile.status": "pending" });
    }
    else if (req.body.profile == "approved") {
      i.push({ "profile.status": "approved" });
    }
    else if (req.body.profile == "rejected") {
      i.push({ "profile.status": "rejected" });
    }
    else if (req.body.profile == "missing") {
      i.push({ "profile": { $exists: false } });
    }
    if (req.body.twoos == "more") {
      if (isNaN(parseInt(req.body.twoos_value))) {
        req.body.twoos_value = 0;
      }
      i.push({ "balance": { $gte: parseInt(req.body.twoos_value) } });
    }
    else if (req.body.twoos == "less") {
      if (isNaN(parseInt(req.body.twoos_value))) {
        req.body.twoos_value = 1000;
      }
      i.push({ "balance": { $lte: parseInt(req.body.twoos_value) } });
    }
    else if (req.body.twoos == "exact") {
      if (isNaN(parseInt(req.body.twoos_value))) {
        req.body.twoos_value = 0;
      }
      i.push({ "balance": parseInt(req.body.twoos_value) });
    }
    if (i[0]) {
      var query = {};
      if (req.body.method == "all") {
        query["$and"] = i;
      }
      else {
        query["$or"] = i;
      }

      db.users.query(query).then(function(data) {
        if (data[0]) {
          res.render("account_partial", { data: data });
        }
        else {
          res.send({ message: "not_found" });
        }
      });
    }
    else {
      res.send({ message: "unknown" });
    }
  }
  else {
    res.send({ message: "forbidden" });
  }
});

module.exports = router;
