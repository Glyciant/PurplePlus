var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    db = require("../db"),
    router = express.Router();

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
          if (req.session.twitch) {
            db.users.getByTwitchId(req.session.twitch.id).then(function(user) {
              if (user.notes && user.notes.map(function(x) { return x.id; }).indexOf(api[0]._id) > -1) {
                note = user.notes[user.notes.map(function(x) { return x.id; }).indexOf(api[0]._id)].note;
              }
              if (user.bookmarks && user.bookmarks.indexOf(api[0]._id) > - 1) {
                bookmarked = true;
              }
              res.render("user", { title: data.twitch_name + possession + " Profile", data: data, api: api[0], events: api[1].events, teams: api[2].teams, videos: api[3].videos, stream: api[4].stream, moderated: api[5].count, voted: voted, bookmarked: bookmarked, note: note });
            });
          }
          else {
            res.render("user", { title: data.twitch_name + possession + " Profile", data: data, api: api[0], events: api[1].events, teams: api[2].teams, videos: api[3].videos, stream: api[4].stream, moderated: api[5].count, voted: voted, bookmarked: bookmarked, note: note });
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
        for (var i in data.requests) {
          if (data.requests[i].timestamp.toString() == req.params.id) {
            var vote;
            if (req.session.type == "mod" && req.session.twitch) {
              if (data.requests[i].upvotes.indexOf(req.session.twitch.id) > -1) {
                vote = "up";
              }
              if (data.requests[i].downvotes.indexOf(req.session.twitch.id) > -1) {
                vote = "down";
              }
            }
            if (data.requests[i].status == "approved" || req.session.type == "mod" || req.session.type == "helper" || (req.session.twitch && req.session.twitch.id == data.twitch_id)) {
              res.render("request", { title: "View Request", data: data.requests[i], profile: data, vote: vote });
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
          for (var i in data.profile_revisions) {
            if (data.profile_revisions[i].updated.toString() == req.params.id.toString()) {
              var selection = data.profile_revisions[i];
              break;
            }
          }
          if (selection) {
            var profile = {
              profile: selection,
              balance: selection.balance
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
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success" });
            });
          }
          else {
            res.send({ message: "success" });
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

module.exports = router;
