var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    db.users.getByStatus("pending").then(function(data) {
      res.render("admin_profiles", { title: "Manage Profiles", data: data });
    });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
  }
  else {
    req.session.return = "/admin/profiles";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/approve", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.id) {
      db.users.getByTwitchId(req.body.id).then(function(data) {
        if (data && data.profile) {
          data.profile.status = "approved";
          if (data.profile.notifications && data.profile.notifications.twitch == "true") {
            var message = "Greetings " + data.twitch_name + "! This is an automated message to inform you that your profile on Purple+ has been approved. If you have any questions or concerns, please contact the /r/Twitch moderators at https://www.reddit.com/message/compose?to=%2Fr%2FTwitch. Thank you for using the site!";
            helpers.twitch.whisper(data.twitch_username, message);
          }
          if (data.profile.notifications && data.profile.notifications.reddit == "true") {
            var message = "Greetings " + data.reddit_name + "!\n\nThis is an automated message to inform you that your profile on Purple+ has been approved.\n\nIf you have any questions or concerns, please contact the /r/Twitch moderators at https://www.reddit.com/message/compose?to=%2Fr%2FTwitch.\n\nThank you for using the site!";
            helpers.reddit.message(data.reddit_username, "Purple+ Profile", message);
          }
          if (data.profile.notifications && data.profile.notifications.discord == "true") {
            var message = "Greetings " + data.discord_name + "!\n\nThis is an automated message to inform you that your profile on Purple+ has been approved.\n\nIf you have any questions or concerns, please contact the /r/Twitch moderators at https://www.reddit.com/message/compose?to=%2Fr%2FTwitch.\n\nThank you for using the site!";
            helpers.discord.message(data.discord_id, message);
          }
          delete data.profile.notifications;
          Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]);
          db.users.editByTwitchId(data.twitch_id, data).then(function() {
            res.send({ message: "success" });
          });
        }
        else {
          res.send({ message: "not_found" });
        }
      });
    }
    else {
      res.send({ message: "not_found" });
    }
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/reject", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.id) {
      db.users.getByTwitchId(req.body.id).then(function(data) {
        if (data && data.profile) {
          data.profile.status = "rejected";
          data.profile.rejection_reason = req.body.reason;
          if (data.profile.notifications && data.profile.notifications.twitch == "true") {
            var message = "Greetings " + data.twitch_name + "! This is an automated message to inform you that your profile on Purple+ has been rejected for the following reason: " + req.body.reason + ". If you have any questions or concerns, please contact the /r/Twitch moderators at https://www.reddit.com/message/compose?to=%2Fr%2FTwitch. Thank you for using the site!";
            helpers.twitch.whisper(data.twitch_username, message);
          }
          if (data.profile.notifications && data.profile.notifications.reddit == "true") {
            var message = "Greetings " + data.discord_name + "!\n\nThis is an automated message to inform you that your profile on Purple+ has been rejected for the following reason: " + req.body.reason + ".\n\nIf you have any questions or concerns, please contact the /r/Twitch moderators at https://www.reddit.com/message/compose?to=%2Fr%2FTwitch.\n\nThank you for using the site!";
            helpers.reddit.message(data.reddit_username, "Purple+ Profile", message);
          }
          if (data.profile.notifications && data.profile.notifications.discord == "true") {
            var message = "Greetings " + data.discord_name + "!\n\nThis is an automated message to inform you that your profile on Purple+ has been rejected for the following reason: " + req.body.reason + ".\n\nIf you have any questions or concerns, please contact the /r/Twitch moderators at https://www.reddit.com/message/compose?to=%2Fr%2FTwitch.\n\nThank you for using the site!";
            helpers.discord.message(data.discord_id, message);
          }
          delete data.profile.notifications;
          Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]);
          db.users.editByTwitchId(data.twitch_id, data).then(function() {
            res.send({ message: "success" });
          });
        }
        else {
          res.send({ message: "not_found" });
        }
      });
    }
    else {
      res.send({ message: "not_found" });
    }
  }
  else {
    res.send({ message: "forbidden" });
  }
});

module.exports = router;
