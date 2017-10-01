var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    restler = require("restler"),
    router = express.Router();

// Reddit Unlink
router.get("/reddit/", function(req, res) {
  if (req.session.reddit) {
    db.users.getByRedditId(req.session.reddit.id).then(function(data) {
      if (data && data.twitch_id) {
        var id = data.reddit_id,
            name = data.reddit_username;
        delete req.session.reddit;
        data.reddit_id = null;
        data.reddit_name = null;
        data.reddit_username = null;
        data.transactions.push({
          timestamp: Date.now(),
          title: "Unlinked Reddit Account",
          type: "Other",
          old: parseFloat(data.balance),
          new: parseFloat(data.balance),
          difference: 0,
          description: null
        });
        db.users.editByRedditId(id, data).then(function() {
          res.redirect("/profile/");
        });
      }
      else {
        res.render("error", { title: "403 Error", code: "403", message: "You cannot unlink your Reddit account unless your Twitch account is linked." });
      }
    });
  }
  else {
    res.render("error", { title: "401 Error", code: "401", message: "You do not appear to be logged in." });
  }
});

// Discord Unlink
router.get("/discord/", function(req, res) {
  if (req.session.discord) {
    db.users.getByDiscordId(req.session.discord.id).then(function(data) {
      if (data && (data.reddit_id || data.twitch_id)) {
        var id = data.discord_id;
        delete req.session.discord;

        helpers.discord.inServer(data).then(function(server) {
          if (server.server === true && data.discord === true) {
            data.transactions.push({
              timestamp: Date.now(),
              title: "Leaving the Discord Server",
              type: "Other",
              old: parseFloat(data.balance),
              new: parseFloat((parseFloat(data.balance) - 1).toFixed(2)),
              difference: -1,
              description: null
            });
            data.discord = false;
            data.discord_id = null;
            data.discord_name = null;
            data.discord_tag = null;
            data.balance = parseFloat((parseFloat(data.balance) - 1).toFixed(2));
            helpers.reddit.setFlair(data, null).then(function(response) {
              db.users.editByTwitchId(data.twitch_id, data).then(function() {
                res.redirect(req.session.return);
              });
            });
          }
          else {
            data.discord_id = null;
            data.discord_name = null;
            data.discord_tag = null;
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.redirect(req.session.return);
            });
          }
        });
      }
      else {
        res.render("error", { title: "403 Error", code: "403", message: "You cannot unlink your Discord account unless your Reddit or Twitch account is linked." });
      }
    });
  }
  else {
    res.render("error", { title: "401 Error", code: "401", message: "You do not appear to be logged in." });
  }
});


module.exports = router;
