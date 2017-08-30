var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    db = require("../db"),
    router = express.Router();

router.get("/submit", function(req, res, next) {
  if (req.session.reddit && req.session.twitch) {
    res.render("requests_submit", { title: "Submit Request" });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You must have a linked Reddit account to access this page." });
  }
  else {
    req.session.return = "/requests/submit";
    res.redirect("/auth/redirect/twitch");
  }
});

router.get("/submit/web", function(req, res, next) {
  if (req.session.reddit && req.session.twitch) {
    res.render("requests_submit_tool", { title: "Submit Request: Web Tool", request_type: "web" });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You must have a linked Reddit account to access this page." });
  }
  else {
    req.session.return = "/requests/submit/web";
    res.redirect("/auth/redirect/twitch");
  }
});

router.get("/submit/desktop", function(req, res, next) {
  if (req.session.reddit && req.session.twitch) {
    res.render("requests_submit_tool", { title: "Submit Request: Desktop Tool", request_type: "desktop" });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You must have a linked Reddit account to access this page." });
  }
  else {
    req.session.return = "/requests/submit/desktop";
    res.redirect("/auth/redirect/twitch");
  }
});

router.get("/submit/extension", function(req, res, next) {
  if (req.session.reddit && req.session.twitch) {
    res.render("requests_submit_tool", { title: "Submit Request: Browser Extension", request_type: "extension" });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You must have a linked Reddit account to access this page." });
  }
  else {
    req.session.return = "/requests/submit/extenstion";
    res.redirect("/auth/redirect/twitch");
  }
});

router.get("/submit/other", function(req, res, next) {
  if (req.session.reddit && req.session.twitch) {
    res.render("requests_submit_other", { title: "Submit Request: Other" });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You must have a linked Reddit account to access this page." });
  }
  else {
    req.session.return = "/requests/submit/other";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/submit", function(req, res, next) {
  if (req.session.reddit && req.session.twitch && req.session.reddit.id == req.body.reddit && req.session.twitch.id == req.body.twitch) {
    db.users.getByRedditId(req.body.reddit).then(function(data) {
      if (!data.bans || data.bans.requests === false) {
        var request = {
          twitch_id: data.twitch_id,
          timestamp: Date.now(),
          type: req.body.type,
          data: req.body.data,
          comments: [],
          upvotes: [],
          downvotes: [],
          status: "pending"
        }
        var type;
        if (request.type == "web") {
          type = "Web Tool";
        }
        else if (request.type == "desktop") {
          type = "Desktop Tool";
        }
        else if (request.type == "extension") {
          type = "Browser Extension";
        }
        else {
          type = "Other";
        }
        helpers.slack.webhook({ "text": "New Advertisement Request on Purple+!\n```\nTwitch Username: " + req.session.twitch.name + " (" + req.session.twitch.id + ")\nReddit Username: " + req.session.reddit.name + " (" + req.session.reddit.id + ")\nRequest Name:    " + request.data.name + "\nRequest Type:    " + type + "\nRequest URL:     <https://purple.plus/user/" + req.session.twitch.username + "/requests/" + request.timestamp +">\n```" }).then(function() {
          if (req.body.type == "web" || req.body.type == "desktop" || req.body.type == "extension") {
            request.data.api = (request.data.api == "true");
            request.data.tos = (request.data.tos == "true");
            request.data.source = (request.data.source == "true");
            request.data.beta = (request.data.beta == "true");
            if (req.body.type == "extension") {
              request.data.browsers.edge = (request.data.browsers.edge == "true");
              request.data.browsers.explorer = (request.data.browsers.explorer == "true");
              request.data.browsers.chrome = (request.data.browsers.chrome == "true");
              request.data.browsers.firefox = (request.data.browsers.firefox == "true");
              request.data.browsers.opera = (request.data.browsers.opera == "true");
              request.data.browsers.safari = (request.data.browsers.safari == "true");
            }
          }
          if (!data.requests) {
            data.requests = [];
          }
          data.requests.push(request);
          db.users.editByRedditId(data.reddit_id, data).then(function() {
            var redirect = "/user/" + data.twitch_username + "/requests/" + request.timestamp;
            res.send({ message: "success", redirect: redirect });
          });
        });
      }
      else {
        res.send({ message: "forbidden" });
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/comment/add", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper" || (req.session.twitch && req.session.twitch.id == req.body.twitch)) {
    db.users.getByTwitchId(req.body.twitch).then(function(data) {
      for (var request of data.requests) {
        if (request.timestamp.toString() == req.body.id.toString()) {
          if (req.session.twitch.id == req.body.twitch && !(req.session.type == "mod" || req.session.type == "helper")) {
            req.body.type = "public";
          }
          request.comments.push({
            timestamp: Date.now(),
            submitter: req.session.twitch.name,
            comment: req.body.comment,
            type: req.body.type
          });
          db.users.editByTwitchId(data.twitch_id, data).then(function() {
            res.send({ message: "success", submitter: req.session.twitch.name });
          });
          break;
        }
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/status/withdraw", function(req, res, next) {
  if (req.session.twitch.id == req.body.twitch) {
    db.users.getByTwitchId(req.body.twitch).then(function(data) {
      for (var request of data.requests) {
        if (request.timestamp.toString() == req.body.id.toString()) {
          if (request.status == "pending") {
            request.status = "withdrawn";
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success", status: "withdrawn" });
            });
          }
          else if (request.status == "withdrawn") {
            request.status = "pending";
            db.users.editByTwitchId(data.twitch_id, data).then(function() {
              res.send({ message: "success", status: "pending" });
            });
          }
          else {
            res.send({ message: "unknown" });
          }
          break;
        }
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

module.exports = router;
