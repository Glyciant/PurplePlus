var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.admin) {
    db.settings.get().then(function(data) {
      res.render("admin_settings", { title: "Site Settings", data: data });
    });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
  }
  else {
    req.session.return = "/admin/settings";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/update", function(req, res, next) {
  if (req.session.admin) {
    db.settings.get().then(function(data) {
      data.logs = (req.body.logs == "true");
      data.search = (req.body.search == "true");
      data.verify = (req.body.verify == "true");
      helpers.discord.verify((req.body.verify == "true")).then(function() {
        db.settings.edit(data).then(function() {
          res.send({ message: "success" })
        });
      });
    });
  }
  else {
    res.send({ message: "unknown" });
  }
});

module.exports = router;
