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
    cron = require('node-cron'),
    router = express.Router();

var task = cron.schedule('0 0 0 * * *', function() {
  Promise.all([fetcher.fetchTwitchEmotes(), fetcher.fetchBTTVEmotes()]);
});

Promise.all([fetcher.fetchTwitchEmotes(), fetcher.fetchBTTVEmotes()]);

router.get("/:name", function(req, res, next) {
  db.users.getByTwitchUsername(req.params.name.toLowerCase()).then(function(data) {
    if (data && data.profile) {
      if (data.profile.status == "approved" || req.session.type == "mod" || req.session.type == "helper" || (req.session.twitch && req.session.twitch.id == data.twitch_id)) {
        Promise.all([helpers.twitch.getChannelById(data.twitch_id), helpers.twitch.getChannelEventsById(data.twitch_id), helpers.twitch.getChannelTeamsById(data.twitch_id), helpers.twitch.getChannelVideosById(data.twitch_id), helpers.twitch.getStreamById(data.twitch_id), helpers.twitch.getModeratedChannels(data.twitch_username)]).then(function(api) {
          var voted = false,
              bookmarked = false,
              note;
          if (data.twitch_name.slice(-1) == "s") {
            var possession = "'";
          }
          else {
            var possession = "'s";
          }
          if (req.session.twitch && data.profile.votes && data.profile.votes.indexOf(req.session.twitch.id) > -1) {
            voted = true;
          }
          var streams = {
            gaming: [],
            creative: [],
            irl: [],
            socialeating: [],
            talkshow: [],
            music: []
          };
          if (data.streams) {
            var d = new Date().getTime();
            for (var stream of data.streams) {
              if (stream.start < d + 604800000) {
                streams[stream.type].push(stream);
              }
            }
          }
          if (req.session.twitch) {
            db.users.getByTwitchId(req.session.twitch.id).then(function(user) {
              if (user.notes && user.notes.map(function(x) { return x.id; }).indexOf(api[0]._id) > -1) {
                note = user.notes[user.notes.map(function(x) { return x.id; }).indexOf(api[0]._id)].note;
              }
              if (user.bookmarks && user.bookmarks.indexOf(api[0]._id) > - 1) {
                bookmarked = true;
              }
              if (!data.profile.views) {
                data.profile.views = [];
              }
              if (data.profile.views.indexOf(req.session.twitch.id) === -1) {
                data.profile.views.push(req.session.twitch.id);
              }
              db.users.editByTwitchId(data.twitch_id, data).then(function() {
                data.profile.overview.about = parser.parse(data.profile.overview.about).replace(/\s\"\w*\"/, "");
                data.profile.overview.background = parser.parse(data.profile.overview.background).replace(/\s\"\w*\"/, "");
                if (data.profile.types.streamer_gaming) {
                  data.profile.types.streamer_gaming.goals = parser.parse(data.profile.types.streamer_gaming.goals).replace(/\s\"\w*\"/, "");
                  data.profile.types.streamer_gaming.favourites = parser.parse(data.profile.types.streamer_gaming.favourites).replace(/\s\"\w*\"/, "");
                }
                if (data.profile.types.streamer_creative) {
                  data.profile.types.streamer_creative.goals = parser.parse(data.profile.types.streamer_creative.goals).replace(/\s\"\w*\"/, "");
                  data.profile.types.streamer_creative.creations = parser.parse(data.profile.types.streamer_creative.creations).replace(/\s\"\w*\"/, "");
                }
                if (data.profile.types.streamer_socialeating) {
                  data.profile.types.streamer_socialeating.goals = parser.parse(data.profile.types.streamer_socialeating.goals).replace(/\s\"\w*\"/, "");
                  data.profile.types.streamer_socialeating.meals = parser.parse(data.profile.types.streamer_socialeating.meals).replace(/\s\"\w*\"/, "");
                  data.profile.types.streamer_socialeating.discussions = parser.parse(data.profile.types.streamer_socialeating.discussions).replace(/\s\"\w*\"/, "");
                }
                if (data.profile.types.streamer_irl) {
                  data.profile.types.streamer_irl.goals = parser.parse(data.profile.types.streamer_irl.goals).replace(/\s\"\w*\"/, "");
                  data.profile.types.streamer_irl.activities = parser.parse(data.profile.types.streamer_irl.activities).replace(/\s\"\w*\"/, "");
                }
                if (data.profile.types.streamer_talkshow) {
                  data.profile.types.streamer_talkshow.goals = parser.parse(data.profile.types.streamer_talkshow.goals).replace(/\s\"\w*\"/, "");
                  data.profile.types.streamer_talkshow.discussions = parser.parse(data.profile.types.streamer_talkshow.discussions).replace(/\s\"\w*\"/, "");
                  data.profile.types.streamer_talkshow.guests = parser.parse(data.profile.types.streamer_talkshow.guests).replace(/\s\"\w*\"/, "");
                }
                if (data.profile.types.streamer_music) {
                  data.profile.types.streamer_music.goals = parser.parse(data.profile.types.streamer_music.goals).replace(/\s\"\w*\"/, "");
                  data.profile.types.streamer_music.music = parser.parse(data.profile.types.streamer_music.music).replace(/\s\"\w*\"/, "");
                }
                if (data.profile.types.artist) {
                  data.profile.types.artist.examples = parser.parse(data.profile.types.artist.examples).replace(/\s\"\w*\"/, "");
                  data.profile.types.artist.attraction = parser.parse(data.profile.types.artist.attraction).replace(/\s\"\w*\"/, "");
                  if (data.profile.types.artist.commissions) {
                    data.profile.types.artist.commissions.services = parser.parse(data.profile.types.artist.commissions.services).replace(/\s\"\w*\"/, "");
                    data.profile.types.artist.commissions.contact = parser.parse(data.profile.types.artist.commissions.contact).replace(/\s\"\w*\"/, "");
                    if (data.profile.types.artist.commissions.charge) {
                      data.profile.types.artist.commissions.charge = parser.parse(data.profile.types.artist.commissions.charge).replace(/\s\"\w*\"/, "");
                    }
                  }
                }
                if (data.profile.types.developer) {
                  data.profile.types.developer.examples = parser.parse(data.profile.types.developer.examples).replace(/\s\"\w*\"/, "");
                  data.profile.types.developer.attraction = parser.parse(data.profile.types.developer.attraction).replace(/\s\"\w*\"/, "");
                  if (data.profile.types.developer.commissions) {
                    data.profile.types.developer.commissions.services = parser.parse(data.profile.types.developer.commissions.services).replace(/\s\"\w*\"/, "");
                    data.profile.types.developer.commissions.contact = parser.parse(data.profile.types.developer.commissions.contact).replace(/\s\"\w*\"/, "");
                    if (data.profile.types.developer.commissions.charge) {
                      data.profile.types.developer.commissions.charge = parser.parse(data.profile.types.developer.commissions.charge).replace(/\s\"\w*\"/, "");
                    }
                  }
                }
                if (data.profile.types.communitymanager) {
                  data.profile.types.communitymanager.examples = parser.parse(data.profile.types.communitymanager.examples).replace(/\s\"\w*\"/, "");
                  data.profile.types.communitymanager.attraction = parser.parse(data.profile.types.communitymanager.attraction).replace(/\s\"\w*\"/, "");
                }
                if (data.profile.types.moderator) {
                  data.profile.types.moderator.experience = parser.parse(data.profile.types.moderator.experience).replace(/\s\"\w*\"/, "");
                  data.profile.types.moderator.attraction = parser.parse(data.profile.types.moderator.attraction).replace(/\s\"\w*\"/, "");
                  if (data.profile.types.moderator.requests) {
                    data.profile.types.moderator.requests.requirements = parser.parse(data.profile.types.moderator.requests.requirements).replace(/\s\"\w*\"/, "");
                    data.profile.types.moderator.requests.contact = parser.parse(data.profile.types.moderator.requests.contact).replace(/\s\"\w*\"/, "");
                  }
                }
                if (data.profile.types.viewer) {
                  data.profile.types.viewer.experience = parser.parse(data.profile.types.viewer.experience).replace(/\s\"\w*\"/, "");
                  data.profile.types.viewer.streamers = parser.parse(data.profile.types.viewer.streamers).replace(/\s\"\w*\"/, "");
                }
                if (data.profile.types.other) {
                  data.profile.types.other = parser.parse(data.profile.types.other).replace(/\s\"\w*\"/, "");
                }
                res.render("user", { title: data.twitch_name + possession + " Profile", data: data, api: api[0], events: api[1].events, teams: api[2].teams, videos: api[3].videos, stream: api[4].stream, moderated: api[5].count, streams: streams, voted: voted, bookmarked: bookmarked, note: note });
              });
            });
          }
          else {
            data.profile.overview.about = parser.parse(data.profile.overview.about).replace(/\s\"\w*\"/, "");
            data.profile.overview.background = parser.parse(data.profile.overview.background).replace(/\s\"\w*\"/, "");
            if (data.profile.types.streamer_gaming) {
              data.profile.types.streamer_gaming.goals = parser.parse(data.profile.types.streamer_gaming.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_gaming.favourites = parser.parse(data.profile.types.streamer_gaming.favourites).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_creative) {
              data.profile.types.streamer_creative.goals = parser.parse(data.profile.types.streamer_creative.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_creative.creations = parser.parse(data.profile.types.streamer_creative.creations).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_socialeating) {
              data.profile.types.streamer_socialeating.goals = parser.parse(data.profile.types.streamer_socialeating.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_socialeating.meals = parser.parse(data.profile.types.streamer_socialeating.meals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_socialeating.discussions = parser.parse(data.profile.types.streamer_socialeating.discussions).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_irl) {
              data.profile.types.streamer_irl.goals = parser.parse(data.profile.types.streamer_irl.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_irl.activities = parser.parse(data.profile.types.streamer_irl.activities).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_talkshow) {
              data.profile.types.streamer_talkshow.goals = parser.parse(data.profile.types.streamer_talkshow.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_talkshow.discussions = parser.parse(data.profile.types.streamer_talkshow.discussions).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_talkshow.guests = parser.parse(data.profile.types.streamer_talkshow.guests).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_music) {
              data.profile.types.streamer_music.goals = parser.parse(data.profile.types.streamer_music.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_music.music = parser.parse(data.profile.types.streamer_music.music).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.artist) {
              data.profile.types.artist.examples = parser.parse(data.profile.types.artist.examples).replace(/\s\"\w*\"/, "");
              data.profile.types.artist.attraction = parser.parse(data.profile.types.artist.attraction).replace(/\s\"\w*\"/, "");
              if (data.profile.types.artist.commissions) {
                data.profile.types.artist.commissions.services = parser.parse(data.profile.types.artist.commissions.services).replace(/\s\"\w*\"/, "");
                data.profile.types.artist.commissions.contact = parser.parse(data.profile.types.artist.commissions.contact).replace(/\s\"\w*\"/, "");
                if (data.profile.types.artist.commissions.charge) {
                  data.profile.types.artist.commissions.charge = parser.parse(data.profile.types.artist.commissions.charge).replace(/\s\"\w*\"/, "");
                }
              }
            }
            if (data.profile.types.developer) {
              data.profile.types.developer.examples = parser.parse(data.profile.types.developer.examples).replace(/\s\"\w*\"/, "");
              data.profile.types.developer.attraction = parser.parse(data.profile.types.developer.attraction).replace(/\s\"\w*\"/, "");
              if (data.profile.types.developer.commissions) {
                data.profile.types.developer.commissions.services = parser.parse(data.profile.types.developer.commissions.services).replace(/\s\"\w*\"/, "");
                data.profile.types.developer.commissions.contact = parser.parse(data.profile.types.developer.commissions.contact).replace(/\s\"\w*\"/, "");
                if (data.profile.types.developer.commissions.charge) {
                  data.profile.types.developer.commissions.charge = parser.parse(data.profile.types.developer.commissions.charge).replace(/\s\"\w*\"/, "");
                }
              }
            }
            if (data.profile.types.communitymanager) {
              data.profile.types.communitymanager.examples = parser.parse(data.profile.types.communitymanager.examples).replace(/\s\"\w*\"/, "");
              data.profile.types.communitymanager.attraction = parser.parse(data.profile.types.communitymanager.attraction).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.moderator) {
              data.profile.types.moderator.experience = parser.parse(data.profile.types.moderator.experience).replace(/\s\"\w*\"/, "");
              data.profile.types.moderator.attraction = parser.parse(data.profile.types.moderator.attraction).replace(/\s\"\w*\"/, "");
              if (data.profile.types.moderator.requests) {
                data.profile.types.moderator.requests.requirements = parser.parse(data.profile.types.moderator.requests.requirements).replace(/\s\"\w*\"/, "");
                data.profile.types.moderator.requests.contact = parser.parse(data.profile.types.moderator.requests.contact).replace(/\s\"\w*\"/, "");
              }
            }
            if (data.profile.types.viewer) {
              data.profile.types.viewer.experience = parser.parse(data.profile.types.viewer.experience).replace(/\s\"\w*\"/, "");
              data.profile.types.viewer.streamers = parser.parse(data.profile.types.viewer.streamers).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.other) {
              data.profile.types.other = parser.parse(data.profile.types.other).replace(/\s\"\w*\"/, "");
            }
            res.render("user", { title: data.twitch_name + possession + " Profile", data: data, api: api[0], events: api[1].events, teams: api[2].teams, videos: api[3].videos, stream: api[4].stream, moderated: api[5].count, streams: streams, voted: voted, bookmarked: bookmarked, note: note });
          }
        });
      }
      else {
        if (req.session.twitch) {
          res.render("error", { title: "403 Error", code: "403", message: "The profile you have requested to view has not been approved." });
        }
        else {
          req.session.return = "/user/" + req.params.name;
          res.redirect("/auth/redirect/twitch");
        }
      }
    }
    else {
      res.render("error", { title: "404 Error", code: "404", message: "The profile you have requested to view does not exist." });
    }
  });
});

router.get("/:name/requests/", function(req, res, next) {
  db.users.getByTwitchUsername(req.params.name.toLowerCase()).then(function(data) {
    if (data.twitch_name.slice(-1) == "s") {
      var possession = "'";
    }
    else {
      var possession = "'s";
    }
    res.render("requests", { title: data.twitch_name + possession + " Advertisement Requests", data: data });
  });
});

router.get("/:name/requests/:id/", function(req, res, next) {
  db.users.getByTwitchUsername(req.params.name.toLowerCase()).then(function(data) {
    if (data && data.requests) {
      if (req.session.twitch) {
        for (var request of data.requests) {
          if (request.timestamp.toString() == req.params.id) {
            var vote;
            if (req.session.type == "mod" && req.session.twitch) {
              if (request.upvotes.indexOf(req.session.twitch.id) > -1) {
                vote = "up";
              }
              if (request.downvotes.indexOf(req.session.twitch.id) > -1) {
                vote = "down";
              }
            }
            if (request.status == "approved" || req.session.type == "mod" || req.session.type == "helper" || (req.session.twitch && req.session.twitch.id == data.twitch_id)) {
              res.render("request", { title: "View Request", data: request, profile: data, vote: vote });
            }
            else {
              res.render("error", { title: "403 Error", code: "403", message: "You cannot view that request because it has not been approved." });
            }
            break;
          }
        }
      }
      else {
        req.session.return = "/user/" + req.params.name + "/requests/" + req.params.id;
        res.redirect("/auth/redirect/twitch");
      }
    }
    else {
      res.render("error", { title: "404 Error", code: "404", message: "The advertisement request you have requested to view does not exist." });
    }
  });
});

router.get("/:name/revisions", function(req, res, next) {
  db.users.getByTwitchUsername(req.params.name.toLowerCase()).then(function(data) {
    if (data && data.profile) {
      if (req.session.twitch) {
        if (req.session.type == "mod" || req.session.type == "helper") {
          Promise.all([helpers.twitch.getChannelById(data.twitch_id), helpers.twitch.getChannelEventsById(data.twitch_id), helpers.twitch.getChannelTeamsById(data.twitch_id), helpers.twitch.getChannelVideosById(data.twitch_id), helpers.twitch.getStreamById(data.twitch_id), helpers.twitch.getModeratedChannels(data.twitch_username)]).then(function(api) {
            if (data.twitch_name.slice(-1) == "s") {
              var possession = "'";
            }
            else {
              var possession = "'s";
            }
            res.render("profile_revisions", { title: data.twitch_name + possession + " Profile Revisions", data: data, api: api[0], events: api[1].events, teams: api[2].teams, videos: api[3].videos, stream: api[4].stream, moderated: api[5].count });
          });
        }
        else {
          res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
        }
      }
      else {
        req.session.return = "/user/" + req.params.name + "/revisions";
        res.redirect("/auth/redirect/twitch");
      }
    }
    else {
      res.render("error", { title: "404 Error", code: "404", message: "The profile you have requested to view does not exist." });
    }
  });
});

router.get("/:name/revisions/:id", function(req, res, next) {
  db.users.getByTwitchUsername(req.params.name.toLowerCase()).then(function(data) {
    if (data) {
      if (req.session.type == "mod" || req.session.type == "helper") {
        Promise.all([helpers.twitch.getChannelById(data.twitch_id), helpers.twitch.getChannelEventsById(data.twitch_id), helpers.twitch.getChannelTeamsById(data.twitch_id), helpers.twitch.getChannelVideosById(data.twitch_id), helpers.twitch.getStreamById(data.twitch_id), helpers.twitch.getModeratedChannels(data.twitch_username)]).then(function(api) {
          if (data.twitch_name.slice(-1) == "s") {
            var possession = "'";
          }
          else {
            var possession = "'s";
          }
          for (var revision of data.profile_revisions) {
            if (revision.updated.toString() == req.params.id.toString()) {
              var selection = revision;
              break;
            }
          }
          if (selection) {
            var profile = {
              profile: selection,
              balance: selection.balance
            }
            data.profile.overview.about = parser.parse(data.profile.overview.about).replace(/\s\"\w*\"/, "");
            data.profile.overview.background = parser.parse(data.profile.overview.background).replace(/\s\"\w*\"/, "");
            if (data.profile.types.streamer_gaming) {
              data.profile.types.streamer_gaming.goals = parser.parse(data.profile.types.streamer_gaming.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_gaming.favourites = parser.parse(data.profile.types.streamer_gaming.favourites).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_creative) {
              data.profile.types.streamer_creative.goals = parser.parse(data.profile.types.streamer_creative.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_creative.creations = parser.parse(data.profile.types.streamer_creative.creations).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_socialeating) {
              data.profile.types.streamer_socialeating.goals = parser.parse(data.profile.types.streamer_socialeating.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_socialeating.meals = parser.parse(data.profile.types.streamer_socialeating.meals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_socialeating.discussions = parser.parse(data.profile.types.streamer_socialeating.discussions).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_irl) {
              data.profile.types.streamer_irl.goals = parser.parse(data.profile.types.streamer_irl.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_irl.activities = parser.parse(data.profile.types.streamer_irl.activities).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_talkshow) {
              data.profile.types.streamer_talkshow.goals = parser.parse(data.profile.types.streamer_talkshow.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_talkshow.discussions = parser.parse(data.profile.types.streamer_talkshow.discussions).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_talkshow.guests = parser.parse(data.profile.types.streamer_talkshow.guests).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.streamer_music) {
              data.profile.types.streamer_music.goals = parser.parse(data.profile.types.streamer_music.goals).replace(/\s\"\w*\"/, "");
              data.profile.types.streamer_music.music = parser.parse(data.profile.types.streamer_music.music).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.artist) {
              data.profile.types.artist.examples = parser.parse(data.profile.types.artist.examples).replace(/\s\"\w*\"/, "");
              data.profile.types.artist.attraction = parser.parse(data.profile.types.artist.attraction).replace(/\s\"\w*\"/, "");
              if (data.profile.types.artist.commissions) {
                data.profile.types.artist.commissions.services = parser.parse(data.profile.types.artist.commissions.services).replace(/\s\"\w*\"/, "");
                data.profile.types.artist.commissions.contact = parser.parse(data.profile.types.artist.commissions.contact).replace(/\s\"\w*\"/, "");
                if (data.profile.types.artist.commissions.charge) {
                  data.profile.types.artist.commissions.charge = parser.parse(data.profile.types.artist.commissions.charge).replace(/\s\"\w*\"/, "");
                }
              }
            }
            if (data.profile.types.developer) {
              data.profile.types.developer.examples = parser.parse(data.profile.types.developer.examples).replace(/\s\"\w*\"/, "");
              data.profile.types.developer.attraction = parser.parse(data.profile.types.developer.attraction).replace(/\s\"\w*\"/, "");
              if (data.profile.types.developer.commissions) {
                data.profile.types.developer.commissions.services = parser.parse(data.profile.types.developer.commissions.services).replace(/\s\"\w*\"/, "");
                data.profile.types.developer.commissions.contact = parser.parse(data.profile.types.developer.commissions.contact).replace(/\s\"\w*\"/, "");
                if (data.profile.types.developer.commissions.charge) {
                  data.profile.types.developer.commissions.charge = parser.parse(data.profile.types.developer.commissions.charge).replace(/\s\"\w*\"/, "");
                }
              }
            }
            if (data.profile.types.communitymanager) {
              data.profile.types.communitymanager.examples = parser.parse(data.profile.types.communitymanager.examples).replace(/\s\"\w*\"/, "");
              data.profile.types.communitymanager.attraction = parser.parse(data.profile.types.communitymanager.attraction).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.moderator) {
              data.profile.types.moderator.experience = parser.parse(data.profile.types.moderator.experience).replace(/\s\"\w*\"/, "");
              data.profile.types.moderator.attraction = parser.parse(data.profile.types.moderator.attraction).replace(/\s\"\w*\"/, "");
              if (data.profile.types.moderator.requests) {
                data.profile.types.moderator.requests.requirements = parser.parse(data.profile.types.moderator.requests.requirements).replace(/\s\"\w*\"/, "");
                data.profile.types.moderator.requests.contact = parser.parse(data.profile.types.moderator.requests.contact).replace(/\s\"\w*\"/, "");
              }
            }
            if (data.profile.types.viewer) {
              data.profile.types.viewer.experience = parser.parse(data.profile.types.viewer.experience).replace(/\s\"\w*\"/, "");
              data.profile.types.viewer.streamers = parser.parse(data.profile.types.viewer.streamers).replace(/\s\"\w*\"/, "");
            }
            if (data.profile.types.other) {
              data.profile.types.other = parser.parse(data.profile.types.other).replace(/\s\"\w*\"/, "");
            }
            res.render("profile_revision", { title: data.twitch_name + possession + " Profile", data: profile, api: api[0], events: api[1].events, teams: api[2].teams, videos: api[3].videos, stream: api[4].stream, moderated: api[5].count, status: true });
          }
          else {
            res.render("error", { title: "404 Error", code: "404", message: "The profile revision you have requested to view does not exist." });
          }
        });
      }
      else {
        if (req.session.twitch) {
          res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
        }
        else {
          res.redirect("/auth/redirect/twitch");
        }
      }
    }
    else {
      res.render("error", { title: "404 Error", code: "404", message: "The profile you have requested to view does not exist." });
    }
  });
});

router.post("/upvote", function(req, res, next) {
  if (req.body.id) {
    if (req.session.twitch) {
      db.users.getByTwitchId(req.body.id).then(function(data) {
        if (data) {
          if (data.twitch_id !== req.session.twitch.id && data.profile.votes.indexOf(req.session.twitch.id) === -1) {
            data.profile.votes.push(req.session.twitch.id);
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success" });
            });
          }
          else {
            res.send({ message: "forbidden" });
          }
        }
        else {
          res.send({ message: "unknown" });
        }
      });
    }
    else {
      res.send({ message: "forbidden" });
    }
  }
  else {
    res.send({ message: "unknown" });
  }
});

router.post("/downvote", function(req, res, next) {
  if (req.body.id) {
    if (req.session.twitch) {
      db.users.getByTwitchId(req.body.id).then(function(data) {
        if (data) {
          if (data.twitch_id !== req.session.twitch.id && data.profile.votes.indexOf(req.session.twitch.id) > -1) {
            data.profile.votes.splice(data.profile.votes.indexOf(req.session.twitch.id), 1);
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success" });
            });
          }
          else {
            res.send({ message: "forbidden" });
          }
        }
        else {
          res.send({ message: "unknown" });
        }
      });
    }
    else {
      res.send({ message: "forbidden" });
    }
  }
  else {
    res.send({ message: "unknown" });
  }
});

router.post("/bookmark", function(req, res, next) {
  if (req.body.id) {
    if (req.session.twitch) {
      db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
        if (data) {
          if (data.bookmarks.indexOf(req.body.id) === -1) {
            data.bookmarks.push(req.body.id);
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success" });
            });
          }
          else {
            res.send({ message: "forbidden" });
          }
        }
        else {
          res.send({ message: "unknown" });
        }
      });
    }
    else {
      res.send({ message: "forbidden" });
    }
  }
  else {
    res.send({ message: "unknown" });
  }
});

router.post("/unbookmark", function(req, res, next) {
  if (req.body.id) {
    if (req.session.twitch) {
      db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
        if (data) {
          if (data.bookmarks.indexOf(req.body.id) > -1) {
            data.bookmarks.splice(data.bookmarks.indexOf(req.body.id), 1);
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success" });
            });
          }
          else {
            res.send({ message: "forbidden" });
          }
        }
        else {
          res.send({ message: "unknown" });
        }
      });
    }
    else {
      res.send({ message: "forbidden" });
    }
  }
  else {
    res.send({ message: "unknown" });
  }
});

router.post("/note", function(req, res, next) {
  if (req.body.id) {
    if (req.session.twitch) {
      db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
        if (data) {
          if (data.notes.map(function(x) { return x.id; }).indexOf(req.body.id) > -1) {
            data.notes.splice(data.notes.map(function(x) { return x.id; }).indexOf(req.body.id), 1);
          }
          if (req.body.note) {
            data.notes.push({
              id: req.body.id,
              note: req.body.note
            });
          }
          db.users.editByTwitchId(data.twitch_id, data).then(function() {
            res.send({ message: "success" });
          });
        }
        else {
          res.send({ message: "unknown" });
        }
      });
    }
    else {
      res.send({ message: "forbidden" });
    }
  }
  else {
    res.send({ message: "unknown" });
  }
});

module.exports = router;
