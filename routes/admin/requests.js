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
        for (var i in data.requests) {
          if (req.body.title && data.requests[i].data.name.indexOf(req.body.title) === -1) {
            continue;
          }
          if (req.body.type && req.body.type != data.requests[i].type) {
            continue;
          }
          if (req.body.status && req.body.status != data.requests[i].status) {
            continue;
          }
          data.requests[i].user = data.twitch_username;
          result.push(data.requests[i]);
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
        for (var i in data.requests) {
          if (req.body.title && data.requests[i].data.name.indexOf(req.body.title) === -1) {
            continue;
          }
          if (req.body.type && req.body.type != data.requests[i].type) {
            continue;
          }
          if (req.body.status && req.body.status != data.requests[i].status) {
            continue;
          }
          data.requests[i].user = data.twitch_username;
          result.push(data.requests[i]);
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
        for (var i in data) {
          for (var j in data[i].requests) {
            if (req.body.title && data[i].requests[j].data.name.indexOf(req.body.title) === -1) {
              continue;
            }
            if (req.body.type && req.body.type != data[i].requests[j].type) {
              continue;
            }
            if (req.body.status && req.body.status != data[i].requests[j].status) {
              continue;
            }
            data.requests[i].user = data.twitch_username;
            result.push(data[i].requests[j]);
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
        for (var i in data.requests) {
          if (data.requests[i].timestamp.toString() == req.body.id.toString()) {
            data.requests[i].status = req.body.status;
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
        for (var i in data.requests) {
          if (data.requests[i].timestamp.toString() == req.body.id.toString()) {
            if (!data.requests[i].legacy_id) {
              if (data.requests[i].upvotes.indexOf(req.session.twitch.id) === -1) {
                if (data.requests[i].downvotes.indexOf(req.session.twitch.id) > -1) {
                  data.requests[i].downvotes.splice(data.requests[i].downvotes.indexOf(req.session.twitch.id), 1);
                }
                data.requests[i].upvotes.push(req.session.twitch.id);
                db.users.editByTwitchId(data.twitch_id, data).then(function() {
                  res.send({ message: "success", upvotes: data.requests[i].upvotes.length, downvotes: data.requests[i].downvotes.length });
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
        for (var i in data.requests) {
          if (data.requests[i].timestamp.toString() == req.body.id.toString()) {
            if (!data.requests[i].legacy_id) {
              if (data.requests[i].downvotes.indexOf(req.session.twitch.id) === -1) {
                if (data.requests[i].upvotes.indexOf(req.session.twitch.id) > -1) {
                  data.requests[i].upvotes.splice(data.requests[i].upvotes.indexOf(req.session.twitch.id), 1);
                }
                data.requests[i].downvotes.push(req.session.twitch.id);
                db.users.editByTwitchId(data.twitch_id, data).then(function() {
                  res.send({ message: "success", upvotes: data.requests[i].upvotes.length, downvotes: data.requests[i].downvotes.length });
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
