var express = require("express"),
    swig = require("swig"),
    restler = require("restler"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.type == "mod") {
    Promise.all([helpers.reddit.getMacros(), helpers.reddit.getLinkFlairs()]).then(function(data) {
      res.render("admin_pusher", { title: "Pusher", macros: JSON.parse(data[0].data.data.content_md).modMacros, flairs: data[1].data, subreddit: config.app.subreddit });
    });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
  }
  else {
    req.session.return = "/admin/pusher";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/approve", function(req, res, next) {
  if (req.session.type == "mod") {
    helpers.reddit.approve(req.body.id).then(function() {
      res.send({ message: "success" });
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/remove", function(req, res, next) {
  if (req.session.type == "mod") {
    helpers.reddit.remove(req.body.id).then(function() {
      res.send({ message: "success" });
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/lock", function(req, res, next) {
  if (req.session.type == "mod") {
    helpers.reddit.lock(req.body.id).then(function() {
      res.send({ message: "success" });
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/comment", function(req, res, next) {
  if (req.session.type == "mod") {
    helpers.reddit.comment(req.body.id, req.body.text).then(function() {
      if (req.body.distinguish == "true") {
        restler.get("https://www.reddit.com/user/" + config.reddit.bot.username  + "/comments.json?limit=1&sort=new").on("complete", function(account) {
          helpers.reddit.distinguish("t1_" + account.data.children[0].data.id).then(function() {
            res.send({ message: "success" });
          });
        });
      }
      else {
        res.send({ message: "success" });
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/flair", function(req, res, next) {
  if (req.session.type == "mod") {
    helpers.reddit.setLinkFlair(req.body.id, req.body.css, req.body.text).then(function() {
      res.send({ message: "success" });
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

module.exports = router;
