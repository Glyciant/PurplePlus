var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    db = require("../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.twitch) {
    Promise.all([db.users.getByTwitchId(req.session.twitch.id), helpers.twitch.getChannelById(req.session.twitch.id), helpers.twitch.getChannelEventsById(req.session.twitch.id), helpers.twitch.getChannelTeamsById(req.session.twitch.id), helpers.twitch.getChannelVideosById(req.session.twitch.id), helpers.twitch.getStreamById(req.session.twitch.id), helpers.twitch.getModeratedChannels(req.session.twitch.username), helpers.legacy.getIntro(req.session.twitch.id)]).then(function(data) {
      if (req.query.tutorial == "true") {
        var tutorial = true;
      }
      else {
        var tutorial = false;
      }
      helpers.reddit.getFlair(data[0]).then(function(flair) {
        var flair;
        if (flair.data) {
          flair = flair.data.users[0].flair_text;
        }
        if (data[0].transactions) {
          data[0].transactions = data[0].transactions.reverse();
          var transactions = [],
              twoos = {
                nominations: 0,
                nominating: 0,
                community: 0,
                admins: 0,
                discord: 0,
                other: 0
              },
              j = [];
          for (var i in data[0].transactions) {
            if (data[0].transactions[i].type == "Nomination") {
              twoos.nominations = twoos.nominations + parseFloat(data[0].transactions[i].difference);
            }
            else if (data[0].transactions[i].type == "Nominating Submission") {
              twoos.nominating = twoos.nominating + parseFloat(data[0].transactions[i].difference);
            }
            else if (data[0].transactions[i].type == "Streaming to the Community") {
              twoos.community = twoos.community + parseFloat(data[0].transactions[i].difference);
            }
            else if (data[0].transactions[i].type == "Admin Action") {
              twoos.admins = twoos.admins + parseFloat(data[0].transactions[i].difference);
            }
            else if (data[0].transactions[i].type == "Discord Server") {
              twoos.discord = twoos.discord + parseFloat(data[0].transactions[i].difference);
            }
            else {
              twoos.other = twoos.other + parseFloat(data[0].transactions[i].difference);
            }
            if (!j[0]) {
              j.push(data[0].transactions[i])
              continue;
            }
            if (data[0].transactions[i - 1].title == data[0].transactions[i].title && data[0].transactions[i - 1].timestamp - data[0].transactions[i].timestamp <= 600000) {
              j.push(data[0].transactions[i]);
            }
            else {
              transactions.push(j);
              j = [];
              j.push(data[0].transactions[i]);
            }
          }
          if (j[0]) {
            transactions.push(j);
          }
        }
        res.render("profile", { title: "My Profile", data: data[0], api: data[1], events: data[2].events, teams: data[3].teams, videos: data[4].videos, stream: data[5].stream, moderated: data[6].count, intro: data[7], flair: flair, twoos: twoos, transactions: transactions, status: true, tutorial: tutorial });
      });
    });
  }
  else {
    req.session.return = "/profile";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/submit", function(req, res, next) {
  if (req.session.twitch) {
    if (req.session.twitch.id == req.body.id) {
      db.users.getByTwitchId(req.body.id).then(function(data) {
        helpers.legacy.getIntro(req.body.id).then(function(legacy) {
          if (data) {
            if (!data.bans || data.bans.profile === false) {
              req.body.profile.updated = parseInt(req.body.profile.date);
              if (legacy[0]) {
                data.legacy_intro = legacy[0].intro_status;
              }
              else {
                data.legacy_intro = "none";
              }
              if (data.profile) {
                if (data.profile.created) {
                  var created = data.profile.created;
                }
                if (data.profile.social_media) {
                  var social_media = data.profile.social_media;
                }
                if (data.profile.communities) {
                  var communities = data.profile.communities;
                }
                if (data.profile.appearance) {
                  var appearance = data.profile.appearance;
                }
                if (data.profile.tags) {
                  var tags = data.profile.tags;
                }
                if (data.profile.votes) {
                  var votes = data.profile.votes;
                }
                else {
                  var votes = [];
                }
                if (!data.profile_revisions) {
                  data.profile_revisions = [];
                }
                delete data.profile.notifications;
                data.profile.balance = data.balance;
                data.profile_revisions.push(data.profile);
              }
              else {
                req.body.profile.created = parseInt(req.body.profile.date);
                var appearance = {
                  clip: "",
                  videos: "true",
                  events: "true",
                  teams: "true"
                }
                var tags = [];
                var votes = [];
              }
              data.profile = req.body.profile;
              if (created) {
                data.profile.created = created;
              }
              if (social_media) {
                data.profile.social_media = social_media;
              }
              if (communities) {
                data.profile.communities = communities;
              }
              data.profile.votes = votes;
              data.profile.appearance = appearance;
              if ((!data.profile.types.streamer_gaming && req.body.primary_type == "streamer_gaming") || (!data.profile.types.streamer_creative && req.body.primary_type == "streamer_creative") || (!data.profile.types.socialeating && req.body.primary_type == "streamer_socialeating") || (!data.profile.types.streamer_irl && req.body.primary_type == "streamer_irl") || (!data.profile.types.streamer_talkshow && req.body.primary_type == "streamer_talkshow") || (!data.profile.types.streamer_music && req.body.primary_type == "streamer_music") || (!data.profile.types.artist && req.body.primary_type == "artist") || (!data.profile.types.developer && req.body.primary_type == "developer") || (!data.profile.types.communitymanager && req.body.primary_type == "communitymanager") || (!data.profile.types.viewer && req.body.primary_type == "viewer") || (!data.profile.types.moderator && req.body.primary_type == "moderator") || (!data.profile.types.other && req.body.primary_type == "other")) {
                res.send({ message: "forbidden" });
              }
              else {
                data.display.profile = req.body.primary_type;
                Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]);
                db.users.editByTwitchId(data.twitch_id, data).then(function() {
                  res.send({ message: "success"});
                });
              }
            }
            else {
              res.send({ message: "forbidden" });
            }
          }
          else {
            res.send({ message: "unknown"});
          }
        });
      });
    }
    else {
      res.send({ message: "forbidden" });
    }
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/submit/appearance", function(req, res, next) {
  if (req.session.twitch.id == req.body.id) {
    db.users.getByTwitchId(req.body.id).then(function(data) {
      if (data) {
        if ((!data.profile.types.streamer_gaming && req.body.primary_type == "streamer_gaming") || (!data.profile.types.streamer_creative && req.body.primary_type == "streamer_creative") || (!data.profile.types.socialeating && req.body.primary_type == "streamer_socialeating") || (!data.profile.types.streamer_irl && req.body.primary_type == "streamer_irl") || (!data.profile.types.streamer_talkshow && req.body.primary_type == "streamer_talkshow") || (!data.profile.types.streamer_music && req.body.primary_type == "streamer_music") || (!data.profile.types.artist && req.body.primary_type == "artist") || (!data.profile.types.developer && req.body.primary_type == "developer") || (!data.profile.types.communitymanager && req.body.primary_type == "communitymanager") || (!data.profile.types.viewer && req.body.primary_type == "viewer") || (!data.profile.types.moderator && req.body.primary_type == "moderator") || (!data.profile.types.other && req.body.primary_type == "other") || (data.profile.status != "approved")) {
          res.send({ message: "forbidden" });
        }
        else {
          helpers.reddit.setFlair(data, req.body.flair).then(function() {
            if (req.body.appearance.clip) {
              if (req.body.appearance.clip.indexOf("https://clips.twitch.tv/") > -1 || req.body.appearance.clip.indexOf("http://clips.twitch.tv/") > -1) {
                helpers.twitch.getClipBySlug(req.body.appearance.clip.replace("https://clips.twitch.tv/", "").replace("http://clips.twitch.tv/", "")).then(function(clip) {
                  if (!(clip && clip.broadcaster && clip.broadcaster.id == data.twitch_id)) {
                    req.body.appearance.clip = null;
                  }
                  data.display.profile = req.body.primary_type;
                  data.profile.appearance = req.body.appearance;
                  db.users.editByTwitchId(data.twitch_id, data).then(function() {
                    res.send({ message: "success"});
                    return;
                  });
                });
              }
              else {
                req.body.appearance.clip = null;
                data.display.profile = req.body.primary_type;
                data.profile.appearance = req.body.appearance;
                db.users.editByTwitchId(data.twitch_id, data).then(function() {
                  res.send({ message: "success"});
                });
              }
            }
            else {
              data.display.profile = req.body.primary_type;
              data.profile.appearance = req.body.appearance;
              db.users.editByTwitchId(data.twitch_id, data).then(function() {
                res.send({ message: "success"});
              });
            }
          });
        }
      }
      else {
        res.send({ message: "unknown_error"});
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/submit/social_media", function(req, res, next) {
  if (req.session.twitch.id == req.body.id) {
    db.users.getByTwitchId(req.body.id).then(function(data) {
      if (data) {
        if (req.body.social_media.facebook) {
          req.body.social_media.facebook = req.body.social_media.facebook.replace("https://facebook.com/", "").replace("http://facebook.com/", "").replace("https://www.facebook.com/", "").replace("http://www.facebook.com/", "").replace("/", "");
        }
        if (req.body.social_media.twitter) {
          req.body.social_media.twitter = req.body.social_media.twitter.replace("https://twitter.com/", "").replace("http://twitter.com/", "").replace("https://www.twitter.com/", "").replace("http://www.twitter.com/", "").replace("/", "").replace("@", "");
        }
        if (req.body.social_media.youtube) {
          req.body.social_media.youtube = req.body.social_media.youtube.replace("https://youtube.com/", "").replace("http://youtube.com/", "").replace("https://www.youtube.com/", "").replace("http://www.youtube.com/", "").replace("/", "");
        }
        if (req.body.social_media.instagram) {
          req.body.social_media.instagram = req.body.social_media.instagram.replace("https://instagram.com/", "").replace("http://instagram.com/", "").replace("https://www.instagram.com/", "").replace("http://www.instagram.com/", "").replace("/", "");
        }
        if (req.body.social_media.steam) {
          req.body.social_media.steam = req.body.social_media.steam.replace("https://steamcommunity.com/", "").replace("http://steamcommunity.com/", "").replace("https://www.steamcommunity.com/", "").replace("http://www.steamcommunity.com/", "").replace("/", "");
        }
        if (req.body.social_media.deviantart) {
          req.body.social_media.deviantart = req.body.social_media.deviantart.replace("https://", "").replace("http://", "").replace(".deviantart.com", "").replace(".deviantart.com", "").replace("/", "");
        }
        if (req.body.social_media.soundcloud) {
          req.body.social_media.soundcloud = req.body.social_media.soundcloud.replace("https://soundcloud.com/", "").replace("http://soundcloud.com/", "").replace("https://www.soundcloud.com/", "").replace("http://www.soundcloud.com/", "").replace("/", "");
        }
        if (req.body.social_media.github) {
          req.body.social_media.github = req.body.social_media.github.replace("https://github.com/", "").replace("http://github.com/", "").replace("https://www.github.com/", "").replace("http://www.github.com/", "").replace("/", "");
        }
        if (req.body.social_media.googleplus) {
          req.body.social_media.googleplus = req.body.social_media.googleplus.replace("https://plus.google.com/", "").replace("http://plus.google.com/", "").replace("/", "");
        }
        if (req.body.social_media.linkedin) {
          req.body.social_media.linkedin = req.body.social_media.linkedin.replace("https://linkedin.com/in/", "").replace("http://linkedin.com/in/", "").replace("https://www.linkedin.com/in/", "").replace("http://www.linkedin.com/in/", "").replace("/", "");
        }
        if (req.body.social_media.tumblr) {
          req.body.social_media.tumblr = req.body.social_media.tumblr.replace("https://", "").replace("http://", "").replace(".tumblr.com", "").replace(".tumblr.com", "").replace("/", "");
        }
        data.profile.social_media = req.body.social_media;
        db.users.editByTwitchId(data.twitch_id, data).then(function() {
          res.send({ message: "success"});
        });
      }
      else {
        res.send({ message: "unknown_error"});
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/submit/communities", function(req, res, next) {
  if (req.session.twitch.id == req.body.id) {
    db.users.getByTwitchId(req.body.id).then(function(data) {
      if (data) {
        if (req.body.communities.discord && req.body.communities.discord.indexOf("https://discord.gg/") === -1 && req.body.communities.discord.indexOf("http://discord.gg/") === -1 && req.body.communities.discord.indexOf("https://www.discord.gg/") === -1 && req.body.communities.discord.indexOf("http://www.discord.gg/") === -1) {
          res.send({ message: "invalid" });
          return;
        }
        if (req.body.communities.steam && req.body.communities.steam.indexOf("https://steamcommunity.com/groups/") === -1 && req.body.communities.steam.indexOf("http://steamcommunity.com/groups/") === -1 && req.body.communities.steam.indexOf("https://www,steamcommunity.com/groups/") === -1 && req.body.communities.steam.indexOf("http://www,steamcommunity.com/groups/") === -1) {
          res.send({ message: "invalid" });
          return;
        }
        if (req.body.communities.reddit && req.body.communities.reddit.indexOf("https://reddit.com/r/") === -1 && req.body.communities.reddit.indexOf("http://reddit.com/r/") === -1 && req.body.communities.reddit.indexOf("https://wwww.reddit.com/r/") === -1 && req.body.communities.reddit.indexOf("http://wwww.reddit.com/r/") === -1) {
          res.send({ message: "invalid" });
          return;
        }
        if (req.body.communities.twitch && req.body.communities.twitch.indexOf("https://twitch.tv/communities/") === -1 && req.body.communities.twitch.indexOf("http://twitch.tv/communities/") === -1 && req.body.communities.twitch.indexOf("https://www.twitch.tv/communities/") === -1 && req.body.communities.twitch.indexOf("https://www.twitch.tv/communities/") === -1) {
          res.send({ message: "invalid" });
          return;
        }
        if (req.body.communities.desktop && req.body.communities.desktop.indexOf("https://invite.twitch.tv/") === -1 && req.body.communities.desktop.indexOf("http://invite.twitch.tv/") === -1 && req.body.communities.desktop.indexOf("https://www.invite.twitch.tv/") === -1 && req.body.communities.desktop.indexOf("https://www.invite.twitch.tv/") === -1) {
          res.send({ message: "invalid" });
          return;
        }
        data.profile.communities = req.body.communities;
        db.users.editByTwitchId(data.twitch_id, data).then(function() {
          res.send({ message: "success"});
        });
      }
      else {
        res.send({ message: "unknown_error"});
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

module.exports = router;
