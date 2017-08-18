var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    db.logs.getLatest().then(function(logs) {
      channels = [];
      for (var i in logs) {
        if (channels.map(function(x) { return x.id; }).indexOf(logs[i].channel_id) === -1) {
          channels.push({ id: logs[i].channel_id, name: logs[i].channel_name });
        }
      }
      channels.sort(function(a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
      db.commands.getAll().then(function(commands) {
        db.settings.get().then(function(settings) {
          res.render("admin_discord", { title: "Manage Discord Server", logs: logs, channels: channels, commands: commands, settings: settings });
        });
      });
    });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
  }
  else {
    req.session.return = "/admin/discord";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/commands/get", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.id) {
      db.commands.getById(req.body.id).then(function(data) {
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

router.post("/commands/add", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.name && req.body.response) {
      db.commands.getByName(req.body.name).then(function(data) {
        if (!data) {
          db.commands.add(req.body).then(function() {
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

router.post("/commands/edit", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.id && req.body.name && req.body.response) {
      db.commands.getByName(req.body.name).then(function(data) {
        if (!data) {
          var id = req.body.id;
          delete req.body.id;
          db.commands.edit(id, req.body).then(function() {
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

router.post("/commands/delete", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.id) {
      db.commands.delete(req.body.id).then(function() {
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

router.post("/logs", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    db.logs.query(req.body.channel, req.body.user, req.body.limit).then(function(logs) {
      if (logs[0]) {
        if (req.body.response == "table") {
          res.render("log_partial", { data: logs });
        }
        else if (req.body.response == "modal") {
          res.render("log_modal_partial", { data: logs });
        }
        else {
          res.send({ message: "unknown" });
        }
      }
      else {
        res.send({ message: "not_found" });
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

module.exports = router;
