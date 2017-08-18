var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.type == "mod") {
    db.links.getAll().then(function(data) {
      res.render("admin_links", { title: "Manage Short Links", data: data });
    });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
  }
  else {
    req.session.return = "/admin/links";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/get", function(req, res, next) {
  if (req.session.type == "mod") {
    if (req.body.id) {
      db.links.getById(req.body.id).then(function(data) {
        if (data) {
          res.send({ message: "success", data: data });
        }
        else {
          res.send({ message: "unknown" });
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

router.post("/add", function(req, res, next) {
  if (req.session.type == "mod") {
    var short_regex = new RegExp(/^[a-zA-Z0-9_]*$/),
        url_regex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
    if (req.body.short && req.body.redirect && short_regex.test(req.body.short) && url_regex.test(req.body.redirect)) {
      db.links.getByShort(req.body.short).then(function(data) {
        if (!data) {
          req.body.enabled = (req.body.enabled == "true");
          db.links.add(req.body).then(function() {
            res.send({ message: "success" });
          });
        }
        else {
          res.send({ message: "exists" });
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

router.post("/edit", function(req, res, next) {
  if (req.session.type == "mod") {
    var short_regex = new RegExp(/^[a-zA-Z0-9_]*$/),
        url_regex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
    if (req.body.short && req.body.redirect && short_regex.test(req.body.short) && url_regex.test(req.body.redirect)) {
      db.links.getByShort(req.body.short).then(function(data) {
        if (!data) {
          var id = req.body.id;
          req.body.enabled = (req.body.enabled == "true");
          delete req.body.id;
          db.links.edit(id, req.body).then(function() {
            res.send({ message: "success" });
          });
        }
        else {
          res.send({ message: "exists" });
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

router.post("/delete", function(req, res, next) {
  if (req.session.type == "mod") {
    if (req.body.id) {
      db.links.delete(req.body.id).then(function() {
        res.send({ message: "success" });
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
