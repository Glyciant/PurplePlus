var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    db = require("../db"),
		{ EmoteFetcher, EmoteParser, } = require('twitch-emoticons'),
		fetcher = new EmoteFetcher(),
		parser = new EmoteParser(fetcher, {
		   type: "markdown",
		   match: /:(.+?):/g
		}),
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
              i = 0,
              j = [];
          for (var transaction of data[0].transactions) {
            if (transaction.type == "Nomination") {
              twoos.nominations = twoos.nominations + parseFloat(transaction.difference);
            }
            else if (transaction.type == "Nominating Submission") {
              twoos.nominating = twoos.nominating + parseFloat(transaction.difference);
            }
            else if (transaction.type == "Streaming to the Community") {
              twoos.community = twoos.community + parseFloat(transaction.difference);
            }
            else if (transaction.type == "Admin Action") {
              twoos.admins = twoos.admins + parseFloat(transaction.difference);
            }
            else if (transaction.type == "Discord Server") {
              twoos.discord = twoos.discord + parseFloat(transaction.difference);
            }
            else {
              twoos.other = twoos.other + parseFloat(transaction.difference);
            }
            if (!j[0]) {
              j.push(transaction)
              continue;
            }
            if (data[0].transactions[i].title == transaction.title && data[0].transactions[i].timestamp - transaction.timestamp <= 600000) {
              j.push(transaction);
            }
            else {
              transactions.push(j);
              j = [];
              j.push(transaction);
            }
            i++;
          }
          if (j[0]) {
            transactions.push(j);
          }
        }
        var streams = {
          gaming: [],
          creative: [],
          irl: [],
          socialeating: [],
          talkshow: [],
          music: []
        };
        if (data[0].streams) {
          var d = new Date().getTime();
          for (var stream of data[0].streams) {
            if (stream.start < d + 604800000) {
              streams[stream.type].push(stream);
            }
          }
        }
        if (data[0].profile) {
          Promise.all([fetcher.fetchTwitchEmotes(), fetcher.fetchBTTVEmotes()]).then(function() {
            var existing = JSON.parse(JSON.stringify(data[0].profile));
            data[0].profile.overview.about = parser.parse(data[0].profile.overview.about).replace(/\s\"\w*\"/, "");
            data[0].profile.overview.background = parser.parse(data[0].profile.overview.background).replace(/\s\"\w*\"/, "");
            if (data[0].profile.types.streamer_gaming) {
              data[0].profile.types.streamer_gaming.goals = parser.parse(data[0].profile.types.streamer_gaming.goals).replace(/\s\"\w*\"/, "");
              data[0].profile.types.streamer_gaming.favourites = parser.parse(data[0].profile.types.streamer_gaming.favourites).replace(/\s\"\w*\"/, "");
            }
            if (data[0].profile.types.streamer_creative) {
              data[0].profile.types.streamer_creative.goals = parser.parse(data[0].profile.types.streamer_creative.goals).replace(/\s\"\w*\"/, "");
              data[0].profile.types.streamer_creative.creations = parser.parse(data[0].profile.types.streamer_creative.creations).replace(/\s\"\w*\"/, "");
            }
            if (data[0].profile.types.streamer_socialeating) {
              data[0].profile.types.streamer_socialeating.goals = parser.parse(data[0].profile.types.streamer_socialeating.goals).replace(/\s\"\w*\"/, "");
              data[0].profile.types.streamer_socialeating.meals = parser.parse(data[0].profile.types.streamer_socialeating.meals).replace(/\s\"\w*\"/, "");
              data[0].profile.types.streamer_socialeating.discussions = parser.parse(data[0].profile.types.streamer_socialeating.discussions).replace(/\s\"\w*\"/, "");
            }
            if (data[0].profile.types.streamer_irl) {
              data[0].profile.types.streamer_irl.goals = parser.parse(data[0].profile.types.streamer_irl.goals).replace(/\s\"\w*\"/, "");
              data[0].profile.types.streamer_irl.activities = parser.parse(data[0].profile.types.streamer_irl.activities).replace(/\s\"\w*\"/, "");
            }
            if (data[0].profile.types.streamer_talkshow) {
              data[0].profile.types.streamer_talkshow.goals = parser.parse(data[0].profile.types.streamer_talkshow.goals).replace(/\s\"\w*\"/, "");
              data[0].profile.types.streamer_talkshow.discussions = parser.parse(data[0].profile.types.streamer_talkshow.discussions).replace(/\s\"\w*\"/, "");
              data[0].profile.types.streamer_talkshow.guests = parser.parse(data[0].profile.types.streamer_talkshow.guests).replace(/\s\"\w*\"/, "");
            }
            if (data[0].profile.types.streamer_music) {
              data[0].profile.types.streamer_music.goals = parser.parse(data[0].profile.types.streamer_music.goals).replace(/\s\"\w*\"/, "");
              data[0].profile.types.streamer_music.music = parser.parse(data[0].profile.types.streamer_music.music).replace(/\s\"\w*\"/, "");
            }
            if (data[0].profile.types.artist) {
              data[0].profile.types.artist.examples = parser.parse(data[0].profile.types.artist.examples).replace(/\s\"\w*\"/, "");
              data[0].profile.types.artist.attraction = parser.parse(data[0].profile.types.artist.attraction).replace(/\s\"\w*\"/, "");
              if (data[0].profile.types.artist.commissions) {
                data[0].profile.types.artist.commissions.services = parser.parse(data[0].profile.types.artist.commissions.services).replace(/\s\"\w*\"/, "");
                data[0].profile.types.artist.commissions.contact = parser.parse(data[0].profile.types.artist.commissions.contact).replace(/\s\"\w*\"/, "");
                if (data[0].profile.types.artist.commissions.charge) {
                  data[0].profile.types.artist.commissions.charge = parser.parse(data[0].profile.types.artist.commissions.charge).replace(/\s\"\w*\"/, "");
                }
              }
            }
            if (data[0].profile.types.developer) {
              data[0].profile.types.developer.examples = parser.parse(data[0].profile.types.developer.examples).replace(/\s\"\w*\"/, "");
              data[0].profile.types.developer.attraction = parser.parse(data[0].profile.types.developer.attraction).replace(/\s\"\w*\"/, "");
              if (data[0].profile.types.developer.commissions) {
                data[0].profile.types.developer.commissions.services = parser.parse(data[0].profile.types.developer.commissions.services).replace(/\s\"\w*\"/, "");
                data[0].profile.types.developer.commissions.contact = parser.parse(data[0].profile.types.developer.commissions.contact).replace(/\s\"\w*\"/, "");
                if (data[0].profile.types.developer.commissions.charge) {
                  data[0].profile.types.developer.commissions.charge = parser.parse(data[0].profile.types.developer.commissions.charge).replace(/\s\"\w*\"/, "");
                }
              }
            }
            if (data[0].profile.types.communitymanager) {
              data[0].profile.types.communitymanager.examples = parser.parse(data[0].profile.types.communitymanager.examples).replace(/\s\"\w*\"/, "");
              data[0].profile.types.communitymanager.attraction = parser.parse(data[0].profile.types.communitymanager.attraction).replace(/\s\"\w*\"/, "");
            }
            if (data[0].profile.types.moderator) {
              data[0].profile.types.moderator.experience = parser.parse(data[0].profile.types.moderator.experience).replace(/\s\"\w*\"/, "");
              data[0].profile.types.moderator.attraction = parser.parse(data[0].profile.types.moderator.attraction).replace(/\s\"\w*\"/, "");
              if (data[0].profile.types.moderator.requests) {
                data[0].profile.types.moderator.requests.requirements = parser.parse(data[0].profile.types.moderator.requests.requirements).replace(/\s\"\w*\"/, "");
                data[0].profile.types.moderator.requests.contact = parser.parse(data[0].profile.types.moderator.requests.contact).replace(/\s\"\w*\"/, "");
              }
            }
            if (data[0].profile.types.viewer) {
              data[0].profile.types.viewer.experience = parser.parse(data[0].profile.types.viewer.experience).replace(/\s\"\w*\"/, "");
              data[0].profile.types.viewer.streamers = parser.parse(data[0].profile.types.viewer.streamers).replace(/\s\"\w*\"/, "");
            }
            if (data[0].profile.types.other) {
              data[0].profile.types.other = parser.parse(data[0].profile.types.other).replace(/\s\"\w*\"/, "");
            }
            res.render("profile", { title: "My Profile", data: data[0], existing: existing, api: data[1], events: data[2].events, teams: data[3].teams, videos: data[4].videos, stream: data[5].stream, moderated: data[6].count, intro: data[7], streams: streams, flair: flair, twoos: twoos, transactions: transactions, status: true, tutorial: tutorial });
          });
        }
        else {
          res.render("profile", { title: "My Profile", data: data[0], api: data[1], events: data[2].events, teams: data[3].teams, videos: data[4].videos, stream: data[5].stream, moderated: data[6].count, intro: data[7], streams: streams, flair: flair, twoos: twoos, transactions: transactions, status: true, tutorial: tutorial });
        }
      });
    });
  }
  else {
    req.session.return = "/profile";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/submit", function(req, res, next) {
  if (req.session.twitch && req.session.twitch.id == req.body.id) {
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
              if (data.profile.views) {
                var views = data.profile.views;
              }
              else {
                var views = [];
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
                videos: true,
                events: true,
                teams: true
              }
              var tags = [];
              var votes = [];
            }
            data.profile = req.body.profile;
            if (data.profile.notifications) {
              data.profile.notifications.twitch = (data.profile.notifications.twitch == "true");
              data.profile.notifications.reddit = (data.profile.notifications.reddit == "true");
              data.profile.notifications.discord = (data.profile.notifications.discord == "true");
            }
            if (data.profile.types.streamer_gaming) {
              data.profile.types.streamer_gaming.genres.action = (data.profile.types.streamer_gaming.genres.action == "true");
              data.profile.types.streamer_gaming.genres.adventure = (data.profile.types.streamer_gaming.genres.adventure == "true");
              data.profile.types.streamer_gaming.genres.horror = (data.profile.types.streamer_gaming.genres.horror == "true");
              data.profile.types.streamer_gaming.genres.roleplaying = (data.profile.types.streamer_gaming.genres.roleplaying == "true");
              data.profile.types.streamer_gaming.genres.simulation = (data.profile.types.streamer_gaming.genres.simulation == "true");
              data.profile.types.streamer_gaming.genres.strategy = (data.profile.types.streamer_gaming.genres.strategy == "true");
              data.profile.types.streamer_gaming.genres.survival = (data.profile.types.streamer_gaming.genres.survival == "true");
              data.profile.types.streamer_gaming.genres.other = (data.profile.types.streamer_gaming.genres.other == "true");
              data.profile.types.streamer_gaming.collaborations = (data.profile.types.streamer_gaming.collaborations == "true");
              data.profile.types.streamer_gaming.charity = (data.profile.types.streamer_gaming.charity == "true");
            }
            if (data.profile.types.streamer_creative) {
              data.profile.types.streamer_creative.activities.cooking = (data.profile.types.streamer_creative.activities.cooking == "true");
              data.profile.types.streamer_creative.activities.drawing = (data.profile.types.streamer_creative.activities.drawing == "true");
              data.profile.types.streamer_creative.activities.painting = (data.profile.types.streamer_creative.activities.painting == "true");
              data.profile.types.streamer_creative.activities.programming = (data.profile.types.streamer_creative.activities.programming == "true");
              data.profile.types.streamer_creative.activities.editing = (data.profile.types.streamer_creative.activities.editing == "true");
              data.profile.types.streamer_creative.activities.other = (data.profile.types.streamer_creative.activities.other == "true");
              data.profile.types.streamer_creative.collaborations = (data.profile.types.streamer_creative.collaborations == "true");
              data.profile.types.streamer_creative.charity = (data.profile.types.streamer_creative.charity == "true");
            }
            if (data.profile.types.streamer_irl) {
              data.profile.types.streamer_irl.collaborations = (data.profile.types.streamer_irl.collaborations == "true");
              data.profile.types.streamer_irl.charity = (data.profile.types.streamer_irl.charity == "true");
            }
            if (data.profile.types.streamer_socialeating) {
              data.profile.types.streamer_socialeating.collaborations = (data.profile.types.streamer_socialeating.collaborations == "true");
              data.profile.types.streamer_socialeating.charity = (data.profile.types.streamer_socialeating.charity == "true");
            }
            if (data.profile.types.streamer_talkshow) {
              data.profile.types.streamer_talkshow.collaborations = (data.profile.types.streamer_talkshow.collaborations == "true");
              data.profile.types.streamer_talkshow.charity = (data.profile.types.streamer_talkshow.charity == "true");
            }
            if (data.profile.types.streamer_music) {
              data.profile.types.streamer_music.collaborations = (data.profile.types.streamer_music.collaborations == "true");
              data.profile.types.streamer_music.charity = (data.profile.types.streamer_music.charity == "true");
            }
            if (data.profile.types.artist && data.profile.types.artist.commissions) {
              data.profile.types.artist.commissions.accepting = (data.profile.types.artist.commissions.accepting == "true");
            }
            if (data.profile.types.developer && data.profile.types.developer.commissions) {
              data.profile.types.developer.commissions.accepting = (data.profile.types.developer.commissions.accepting == "true");
            }
            if (data.profile.types.viewer) {
              data.profile.types.viewer.streams.action = (data.profile.types.viewer.streams.action == "true");
              data.profile.types.viewer.streams.adventure = (data.profile.types.viewer.streams.adventure == "true");
              data.profile.types.viewer.streams.roleplaying = (data.profile.types.viewer.streams.roleplaying == "true");
              data.profile.types.viewer.streams.simulation = (data.profile.types.viewer.streams.simulation == "true");
              data.profile.types.viewer.streams.strategy = (data.profile.types.viewer.streams.strategy == "true");
              data.profile.types.viewer.streams.survival = (data.profile.types.viewer.streams.survival == "true");
              data.profile.types.viewer.streams.horror = (data.profile.types.viewer.streams.horror == "true");
              data.profile.types.viewer.streams.music = (data.profile.types.viewer.streams.music == "true");
              data.profile.types.viewer.streams.cooking = (data.profile.types.viewer.streams.cooking == "true");
              data.profile.types.viewer.streams.drawing = (data.profile.types.viewer.streams.drawing == "true");
              data.profile.types.viewer.streams.painting = (data.profile.types.viewer.streams.painting == "true");
              data.profile.types.viewer.streams.programming = (data.profile.types.viewer.streams.programming == "true");
              data.profile.types.viewer.streams.editing = (data.profile.types.viewer.streams.editing == "true");
              data.profile.types.viewer.streams.talkshow = (data.profile.types.viewer.streams.talkshow == "true");
              data.profile.types.viewer.streams.irl = (data.profile.types.viewer.streams.irl == "true");
              data.profile.types.viewer.streams.socialeating = (data.profile.types.viewer.streams.socialeating == "true");
              data.profile.types.viewer.family = (data.profile.types.viewer.family == "true");
            }
            if (created) {
              data.profile.created = created;
            }
            if (social_media) {
              data.profile.social_media = social_media;
            }
            if (communities) {
              data.profile.communities = communities;
            }
            data.profile.views = views;
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
});

router.post("/submit/appearance", function(req, res, next) {
  if (req.session.twitch && req.session.twitch.id == req.body.id) {
    db.users.getByTwitchId(req.body.id).then(function(data) {
      if (data) {
        if ((!data.profile.types.streamer_gaming && req.body.primary_type == "streamer_gaming") || (!data.profile.types.streamer_creative && req.body.primary_type == "streamer_creative") || (!data.profile.types.socialeating && req.body.primary_type == "streamer_socialeating") || (!data.profile.types.streamer_irl && req.body.primary_type == "streamer_irl") || (!data.profile.types.streamer_talkshow && req.body.primary_type == "streamer_talkshow") || (!data.profile.types.streamer_music && req.body.primary_type == "streamer_music") || (!data.profile.types.artist && req.body.primary_type == "artist") || (!data.profile.types.developer && req.body.primary_type == "developer") || (!data.profile.types.communitymanager && req.body.primary_type == "communitymanager") || (!data.profile.types.viewer && req.body.primary_type == "viewer") || (!data.profile.types.moderator && req.body.primary_type == "moderator") || (!data.profile.types.other && req.body.primary_type == "other")) {
          res.send({ message: "forbidden" });
        }
        else {
          helpers.reddit.setFlair(data, req.body.flair).then(function() {
            req.body.appearance.videos = (req.body.appearance.videos == "true");
            req.body.appearance.events = (req.body.appearance.events == "true");
            req.body.appearance.teams = (req.body.appearance.teams == "true");
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
  if (req.session.twitch && req.session.twitch.id == req.body.id) {
    db.users.getByTwitchId(req.body.id).then(function(data) {
      if (data) {
        if (req.body.social_media.facebook) {
          req.body.social_media.facebook = req.body.social_media.facebook.replace("https://facebook.com/", "").replace("http://facebook.com/", "").replace("https://www.facebook.com/", "").replace("http://www.facebook.com/", "").replace("/", "");
        }
        if (req.body.social_media.twitter) {
          req.body.social_media.twitter = req.body.social_media.twitter.replace("https://twitter.com/", "").replace("http://twitter.com/", "").replace("https://www.twitter.com/", "").replace("http://www.twitter.com/", "").replace("/", "").replace("@", "");
        }
        if (req.body.social_media.reddit) {
          req.body.social_media.reddit = (req.body.social_media.reddit == "true");
        }
        if (req.body.social_media.discord) {
          req.body.social_media.discord = (req.body.social_media.discord == "true");
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
  if (req.session.twitch && req.session.twitch.id == req.body.id) {
    db.users.getByTwitchId(req.body.id).then(function(data) {
      if (data) {
        if (req.body.communities) {
          if (req.body.communities.discord && req.body.communities.discord.indexOf("https://discord.gg/") === -1 && req.body.communities.discord.indexOf("http://discord.gg/") === -1 && req.body.communities.discord.indexOf("https://www.discord.gg/") === -1 && req.body.communities.discord.indexOf("http://www.discord.gg/") === -1) {
            res.send({ message: "invalid", data: "Discord Server" });
            return;
          }
          if (req.body.communities.steam && req.body.communities.steam.indexOf("https://steamcommunity.com/groups/") === -1 && req.body.communities.steam.indexOf("http://steamcommunity.com/groups/") === -1 && req.body.communities.steam.indexOf("https://www,steamcommunity.com/groups/") === -1 && req.body.communities.steam.indexOf("http://www,steamcommunity.com/groups/") === -1) {
            res.send({ message: "invalid", data: "Steam Group" });
            return;
          }
          if (req.body.communities.subreddit && req.body.communities.subreddit.indexOf("https://reddit.com/r/") === -1 && req.body.communities.subreddit.indexOf("https://reddit.com/r/") === -1 && req.body.communities.subreddit.indexOf("https://www.reddit.com/r/") === -1 && req.body.communities.subreddit.indexOf("http://wwww.reddit.com/r/") === -1) {
            res.send({ message: "invalid", data: "Subreddit" });
            return;
          }
          if (req.body.communities.twitch && req.body.communities.twitch.indexOf("https://twitch.tv/communities/") === -1 && req.body.communities.twitch.indexOf("http://twitch.tv/communities/") === -1 && req.body.communities.twitch.indexOf("https://www.twitch.tv/communities/") === -1 && req.body.communities.twitch.indexOf("https://www.twitch.tv/communities/") === -1) {
            res.send({ message: "invalid", data: "Twitch Community" });
            return;
          }
          if (req.body.communities.desktop && req.body.communities.desktop.indexOf("https://invite.twitch.tv/") === -1 && req.body.communities.desktop.indexOf("http://invite.twitch.tv/") === -1 && req.body.communities.desktop.indexOf("https://www.invite.twitch.tv/") === -1 && req.body.communities.desktop.indexOf("https://www.invite.twitch.tv/") === -1) {
            res.send({ message: "invalid", data: "Twitch Desktop Invite" });
            return;
          }
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
