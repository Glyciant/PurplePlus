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
      for (var log of logs) {
        if (channels.map(function(x) { return x.id; }).indexOf(log.channel_id) === -1) {
          channels.push({ id: log.channel_id, name: log.channel_name });
        }
      }
      channels.sort(function(a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
      Promise.all([db.commands.getAll(), db.filters.getAll()]).then(function(data) {
        db.settings.get().then(function(settings) {
          res.render("admin_discord", { title: "Manage Discord Server", logs: logs, channels: channels, commands: data[0], filters: data[1], settings: settings });
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
          req.body.enabled = (req.body.enabled == "true");
          req.body.restricted = (req.body.restricted == "true");
          if (req.body.restricted === true) {
            req.body.restrictions.mods = (req.body.restrictions.mods == "true");
            req.body.restrictions.helpers = (req.body.restrictions.helpers == "true");
            req.body.restrictions.wiki = (req.body.restrictions.wiki == "true");
            req.body.restrictions.staff = (req.body.restrictions.staff == "true");
            req.body.restrictions.admins = (req.body.restrictions.admins == "true");
            req.body.restrictions.global_mods = (req.body.restrictions.global_mods == "true");
            req.body.restrictions.contributors = (req.body.restrictions.contributors == "true");
            req.body.restrictions.profiles = (req.body.restrictions.profiles == "true");
            req.body.restrictions.twoos = (req.body.restrictions.twoos == "true");
            if (req.body.restrictions.twoos === true) {
              req.body.restrictions.twoos_value = parseInt(req.body.restrictions.twoos_value);
            }
          }
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
        if (!data || data._id.toString() == req.body.id) {
          req.body.enabled = (req.body.enabled == "true");
          req.body.restricted = (req.body.restricted == "true");
          if (req.body.restricted === true) {
            req.body.restrictions.mods = (req.body.restrictions.mods == "true");
            req.body.restrictions.helpers = (req.body.restrictions.helpers == "true");
            req.body.restrictions.wiki = (req.body.restrictions.wiki == "true");
            req.body.restrictions.staff = (req.body.restrictions.staff == "true");
            req.body.restrictions.admins = (req.body.restrictions.admins == "true");
            req.body.restrictions.global_mods = (req.body.restrictions.global_mods == "true");
            req.body.restrictions.contributors = (req.body.restrictions.contributors == "true");
            req.body.restrictions.profiles = (req.body.restrictions.profiles == "true");
            req.body.restrictions.twoos = (req.body.restrictions.twoos == "true");
            if (req.body.restrictions.twoos === true) {
              req.body.restrictions.twoos_value = parseInt(req.body.restrictions.twoos_value);
            }
          }
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

router.post("/filters/get", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.id) {
      db.filters.getById(req.body.id).then(function(data) {
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

router.post("/filters/add", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.banphrase) {
      db.filters.getByName(req.body.banphrase).then(function(data) {
        if (!data) {
          req.body.enabled = (req.body.enabled == "true");
          req.body.exclusions.mods = (req.body.exclusions.mods == "true");
          req.body.exclusions.helpers = (req.body.exclusions.helpers == "true");
          req.body.exclusions.wiki = (req.body.exclusions.wiki == "true");
          req.body.exclusions.staff = (req.body.exclusions.staff == "true");
          req.body.exclusions.admins = (req.body.exclusions.admins == "true");
          req.body.exclusions.global_mods = (req.body.exclusions.global_mods == "true");
          req.body.exclusions.contributors = (req.body.exclusions.contributors == "true");
          req.body.exclusions.profiles = (req.body.exclusions.profiles == "true");
          req.body.exclusions.twoos = (req.body.exclusions.twoos == "true");
          if (req.body.exclusions.twoos === true) {
            req.body.exclusions.twoos_value = parseInt(req.body.exclusions.twoos_value);
          }
          db.filters.add(req.body).then(function() {
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

router.post("/filters/edit", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.id && req.body.banphrase) {
      db.filters.getByName(req.body.banphrase).then(function(data) {
        if (!data) {
          req.body.enabled = (req.body.enabled == "true");
          req.body.exclusions.mods = (req.body.exclusions.mods == "true");
          req.body.exclusions.helpers = (req.body.exclusions.helpers == "true");
          req.body.exclusions.wiki = (req.body.exclusions.wiki == "true");
          req.body.exclusions.staff = (req.body.exclusions.staff == "true");
          req.body.exclusions.admins = (req.body.exclusions.admins == "true");
          req.body.exclusions.global_mods = (req.body.exclusions.global_mods == "true");
          req.body.exclusions.contributors = (req.body.exclusions.contributors == "true");
          req.body.exclusions.profiles = (req.body.exclusions.profiles == "true");
          req.body.exclusions.twoos = (req.body.exclusions.twoos == "true");
          if (req.body.exclusions.twoos === true) {
            req.body.exclusions.twoos_value = parseInt(req.body.exclusions.twoos_value);
          }
          var id = req.body.id;
          delete req.body.id;
          db.filters.edit(id, req.body).then(function() {
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

router.post("/filters/delete", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.id) {
      db.filters.delete(req.body.id).then(function() {
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
