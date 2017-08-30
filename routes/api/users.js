var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (!req.query.offset || isNaN(parseInt(req.query.offset)) || req.query.offset < 0) {
    req.query.offset = 0;
  }
  else {
    req.query.offset = parseInt(req.query.offset);
  }
  if (!req.query.limit || isNaN(parseInt(req.query.limit)) || req.query.limit < 0 || req.query.limit > 100) {
    req.query.limit = 25;
  }
  else {
    req.query.limit = parseInt(req.query.limit)
  }
  db.users.getAllByTwoos(req.query.offset, req.query.limit).then(function(data) {
    var users = [];
    for (var user of data) {
      users.push({
        twitch_id: user.twitch_id,
        twitch: {
          id: user.twitch_id,
          name: user.twitch_name,
          username: user.twitch_username
        },
        reddit: {
          id: user.reddit_id,
          name: user.reddit_name,
          username: user.reddit_username
        },
        discord: {
          id: user.discord_id,
          name: user.discord_name,
          discriminator: user.discord_tag
        },
        balance: user.balance,
        last_login: user.last_login
      });
    }
    res.json({
      status: 200,
      message: "OK",
      description: "Match Found",
      users: users
    });
  });
});

router.get("/:id", function(req, res, next) {
  db.users.getByTwitchId(req.params.id).then(function(data) {
    if (data) {
      res.json({
        status: 200,
        message: "OK",
        description: "Match Found",
        twitch_id: data.twitch_id,
        twitch: {
          id: data.twitch_id,
          name: data.twitch_name,
          username: data.twitch_username
        },
        reddit: {
          id: data.reddit_id,
          name: data.reddit_name,
          username: data.reddit_username
        },
        discord: {
          id: data.discord_id,
          name: data.discord_name,
          discriminator: data.discord_tag
        },
        balance: data.balance,
        last_login: data.last_login
      });
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no user with the Twitch ID " + req.params.id + "."
      });
    }
  });
});

router.get("/:id/types", function(req, res, next) {
  db.users.getByTwitchId(req.params.id).then(function(data) {
    if (data) {
      res.json({
        status: 200,
        message: "OK",
        description: "Match Found",
        twitch_id: data.twitch_id,
        site_admin: data.admin,
        site_type: data.type,
        subreddit_type: data.display.subreddit,
        subreddit_ama: data.display.ama,
        profile_type: data.display.profile
      });
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no user with the Twitch ID " + req.params.id + "."
      });
    }
  });
});

router.get("/:id/profile", function(req, res, next) {
  db.users.getByTwitchId(req.params.id).then(function(data) {
    if (data) {
      if (data.profile) {
        if (data.profile.status == "approved") {
          res.json({
            status: 200,
            message: "OK",
            description: "Match Found.",
            twitch_id: data.twitch_id,
            approval_status: data.profile.status,
            created_at: data.profile.created,
            updated_at: data.profile.updated,
            overview: data.profile.overview,
            types: data.profile.types,
            votes: data.profile.votes.length,
            views: data.profile.views.length,
            tags: data.profile.tags,
            social_media: data.profile.social_media,
            communities: data.profile.communities,
            appearance: {
              clip: data.profile.appearance.clip,
              videos: data.profile.appearance.videos,
              events: data.profile.appearance.events,
              teams: data.profile.appearance.teams
            }
          });
        }
        else {
          res.json({
            status: 206,
            message: "Partial Content",
            description: "The user with the Twitch ID " + req.params.id + " does not have an approved profile.",
            approval_status: data.profile.status
          });
        }
      }
      else {
        res.json({
          status: 204,
          message: "No Content",
          description: "The user with the Twitch ID " + req.params.id + " does not have a profile."
        });
      }
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no user with the Twitch ID " + req.params.id + "."
      });
    }
  });
});

router.get("/:id/schedule", function(req, res, next) {
  db.users.getByTwitchId(req.params.id).then(function(data) {
    if (data) {
      if (data.streams && data.streams[0]) {
        res.json({
          status: 200,
          message: "OK",
          description: "Match Found.",
          streams: data.streams
        });
      }
      else {
        res.json({
          status: 204,
          message: "No Content",
          description: "The user with the Twitch ID " + req.params.id + " has no scheduled streams."
        });
      }
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no user with the Twitch ID " + req.params.id + "."
      });
    }
  });
});

router.get("/:id/schedule/:stream", function(req, res, next) {
  db.users.getByTwitchId(req.params.id).then(function(data) {
    if (data) {
      if (data.streams && data.streams[0]) {
        var index = data.streams.map(function(x) { return x.id }).indexOf(req.params.stream);
        if (index > -1) {
          res.json({
            status: 200,
            message: "OK",
            description: "Match Found.",
            id: data.streams[index].id,
            title: data.streams[index].title,
            description: data.streams[index].description,
            start: data.streams[index].start,
            end: data.streams[index].end,
            directory: data.streams[index].directory,
            type: data.streams[index].type
          });
        }
        else {
          res.json({
            status: 404,
            message: "Not Found",
            description: "The user with the Twitch ID " + req.params.id + " does not have a scheduled stream with the ID of " + req.params.request + "."
          });
        }
      }
      else {
        res.json({
          status: 204,
          message: "No Content",
          description: "The user with the Twitch ID " + req.params.id + " has no scheduled streams."
        });
      }
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no user with the Twitch ID " + req.params.id + "."
      });
    }
  });
});

router.get("/:id/requests", function(req, res, next) {
  db.users.getByTwitchId(req.params.id).then(function(data) {
    if (data) {
      if (data.requests && data.requests[0]) {
        var requests = [];
        for (var request of data.requests) {
          if (request.status == "approved") {
            var legacy = false;
            requests.push({
              legacy: (request.legacy_id !== undefined),
              timestamp: request.timestamp,
              approval_status: request.status,
              type: request.type,
              data: request.data
            });
          }
        }
        if (requests[0]) {
          res.json({
            status: 200,
            message: "OK",
            description: "Match Found.",
            requests: requests
          });
        }
        else {
          res.json({
            status: 204,
            message: "No Content",
            description: "The user with the Twitch ID " + req.params.id + " has no approved advertisement requests."
          });
        }
      }
      else {
        res.json({
          status: 204,
          message: "No Content",
          description: "The user with the Twitch ID " + req.params.id + " has no approved advertisement requests."
        });
      }
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no user with the Twitch ID " + req.params.id + "."
      });
    }
  });
});

router.get("/:id/requests/:request", function(req, res, next) {
  db.users.getByTwitchId(req.params.id).then(function(data) {
    if (data) {
      if (data.requests && data.requests[0]) {
        var index = data.requests.map(function(x) { return x.timestamp.toString() }).indexOf(req.params.request);
        if (index > -1) {
          if (data.requests[index].status == "approved") {
            res.json({
              status: 200,
              message: "OK",
              description: "Match Found.",
              legacy: (data.requests[index].legacy_id !== undefined),
              timestamp: data.requests[index].timestamp,
              approval_status: data.requests[index].status,
              type: data.requests[index].type,
              data: data.requests[index].data
            });
          }
          else {
            res.json({
              status: 206,
              message: "Partial Content",
              description: "The user with the Twitch ID " + req.params.id + " does not have an approved request with the ID of " + req.params.request + ".",
              legacy: (data.requests[index].legacy_id !== undefined),
              timestamp: data.requests[index].timestamp,
              approval_status: data.requests[index].status,
              type: data.requests[index].type
            });
          }
        }
        else {
          res.json({
            status: 404,
            message: "Not Found",
            description: "The user with the Twitch ID " + req.params.id + " does not have a request with the ID of " + req.params.request + "."
          });
        }
      }
      else {
        res.json({
          status: 204,
          message: "No Content",
          description: "The user with the Twitch ID " + req.params.id + " has no advertisement requests."
        });
      }
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no user with the Twitch ID " + req.params.id + "."
      });
    }
  });
});

module.exports = router;
