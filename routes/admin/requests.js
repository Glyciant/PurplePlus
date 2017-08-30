var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    db.users.getAll().then(function(data) {
      res.render("admin_requests", { title: "Manage Advertisement Requests", data: data });
    });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
  }
  else {
    req.session.return = "/admin/requests";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/get", function(req, res, next) {
  var result = [];
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.reddit) {
      db.users.getByRedditUsername(req.body.reddit.toLowerCase()).then(function(data) {
        if (!data) {
          res.send({ message: "not_found" });
          return;
        }
        if (req.body.twitch && req.body.twitch.toLowerCase() != data.twitch_username) {
          res.send({ message: "not_found" });
          return;
        }
        for (var request of data.requests) {
          if (req.body.title && request.data.name.indexOf(req.body.title) === -1) {
            continue;
          }
          if (req.body.type && req.body.type != request.type) {
            continue;
          }
          if (req.body.status && req.body.status != request.status) {
            continue;
          }
          request.user = data.twitch_username;
          result.push(request);
        }
        if (result.length > 0) {
          res.render("request_partial", { data: result });
          return;
        }
        else {
          res.send({ message: "not_found" });
          return;
        }
      });
    }
    else if (req.body.twitch) {
      db.users.getByTwitchUsername(req.body.twitch.toLowerCase()).then(function(data) {
        if (!data) {
          res.send({ message: "not_found" });
          return;
        }
        for (var request of data.requests) {
          if (req.body.title && request.data.name.indexOf(req.body.title) === -1) {
            continue;
          }
          if (req.body.type && req.body.type != request.type) {
            continue;
          }
          if (req.body.status && req.body.status != request.status) {
            continue;
          }
          request.user = data.twitch_username;
          result.push(request);
        }
        if (result.length > 0) {
          res.render("request_partial", { data: result });
          return;
        }
        else {
          res.send({ message: "not_found" });
          return;
        }
      });
    }
    else {
      db.users.getAll().then(function(data) {
        if (!data) {
          res.send({ message: "not_found" });
          return;
        }
        for (var user of data) {
          for (var request of user.requests) {
            if (req.body.title && request.data.name.indexOf(req.body.title) === -1) {
              continue;
            }
            if (req.body.type && req.body.type != request.type) {
              continue;
            }
            if (req.body.status && req.body.status != request.status) {
              continue;
            }
            request.user = data.twitch_username;
            result.push(request);
          }
        }
        if (result.length > 0) {
          res.render("request_partial", { data: result });
          return;
        }
        else {
          res.send({ message: "not_found" });
          return;
        }
      });
    }
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/status/update", function(req, res, next) {
  if (req.session.type == "mod") {
    if (req.body.status == "pending" || req.body.status == "approved" || req.body.status == "rejected") {
      db.users.getByTwitchId(req.body.twitch).then(function(data) {
        for (var request of data.requests) {
          if (request.timestamp.toString() == req.body.id.toString()) {
            request.status = req.body.status;
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success" });
            });
            break;
          }
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


router.post("/vote/approve", function(req, res, next) {
  if (req.session.type == "mod") {
    if (req.session.twitch) {
      db.users.getByTwitchId(req.body.twitch).then(function(data) {
        for (var request of data.requests) {
          if (request.timestamp.toString() == req.body.id.toString()) {
            if (!request.legacy_id) {
              if (request.upvotes.indexOf(req.session.twitch.id) === -1) {
                if (request.downvotes.indexOf(req.session.twitch.id) > -1) {
                  request.downvotes.splice(request.downvotes.indexOf(req.session.twitch.id), 1);
                }
                request.upvotes.push(req.session.twitch.id);
                db.users.editByTwitchId(data.twitch_id, data).then(function() {
                  res.send({ message: "success", upvotes: request.upvotes.length, downvotes: request.downvotes.length });
                });
                break;
              }
              else {
                res.send({ message: "forbidden" });
              }
            }
            else {
              res.send({ message: "forbidden" });
            }
          }
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

router.post("/vote/reject", function(req, res, next) {
  if (req.session.type == "mod") {
    if (req.session.twitch) {
      db.users.getByTwitchId(req.body.twitch).then(function(data) {
        for (var request of data.requests) {
          if (request.timestamp.toString() == req.body.id.toString()) {
            if (!request.legacy_id) {
              if (request.downvotes.indexOf(req.session.twitch.id) === -1) {
                if (request.upvotes.indexOf(req.session.twitch.id) > -1) {
                  request.upvotes.splice(request.upvotes.indexOf(req.session.twitch.id), 1);
                }
                request.downvotes.push(req.session.twitch.id);
                db.users.editByTwitchId(data.twitch_id, data).then(function() {
                  res.send({ message: "success", upvotes: request.upvotes.length, downvotes: request.downvotes.length });
                });
                break;
              }
              else {
                res.send({ message: "forbidden" });
              }
            }
            else {
              res.send({ message: "forbidden" });
            }
          }
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
