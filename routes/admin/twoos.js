var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    db.users.getAll().then(function(data) {
      res.render("admin_twoos", { title: "Manage Twoos", data: data });
    });
  }
  else if (req.session.twitch) {
    res.render("error", { title: "403 Error", code: "403", message: "You do not have permission to view this page." });
  }
  else {
    req.session.return = "/admin/twoos";
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/approve", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.reddit && req.body.id) {
      db.users.getByRedditId(req.body.reddit).then(function(data) {
        for (var i in data.nominations) {
          if (data.nominations[i].nomination_id.toString() == req.body.id.toString()) {
            data.nominations[i].status = "approved";
            db.users.editByRedditId(data.reddit_id, data).then(function() {
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

router.post("/reject", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.reddit && req.body.id) {
      db.users.getByRedditId(req.body.reddit).then(function(data) {
        for (var i in data.nominations) {
          if (data.nominations[i].nomination_id.toString() == req.body.id.toString()) {
            data.nominations[i].status = "rejected";
            data.transactions.push({
              timestamp: Date.now(),
              title: "Nomination Rejected",
              type: "Nomination",
              old: parseFloat(data.balance),
              new: parseFloat((parseFloat(data.balance) - 1).toFixed(2)),
              difference: - 1,
              description: "Nomination for " + data.nominations[i].nomination_url
            });
            var url = data.nominations[i].nomination_url;
            data.balance = parseFloat((parseFloat(data.balance) - 1).toFixed(2));
            Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
              db.users.editByRedditId(data.reddit_id, data).then(function() {
                db.users.getByRedditUsername(data.nominations[i].nominator_name.toLowerCase()).then(function(data) {
                  data.transactions.push({
                    timestamp: Date.now(),
                    title: "Nominating Submission (Rejected)",
                    type: "Nominating Submission",
                    old: parseFloat(data.balance),
                    new: parseFloat((parseFloat(data.balance) - 0.1).toFixed(2)),
                    difference: - 0.1,
                    description: "Nominating " + url
                  });
                  data.balance = parseFloat((parseFloat(data.balance) - 0.1).toFixed(2));
                  Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
                    db.users.editByRedditId(data.reddit_id, data).then(function() {
                      res.send({ message: "success" });
                    });
                  });
                });
              });
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

router.post("/reapprove", function(req, res, next) {
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.reddit && req.body.id) {
      db.users.getByRedditId(req.body.reddit).then(function(data) {
        for (var i in data.nominations) {
          if (data.nominations[i].nomination_id.toString() == req.body.id.toString()) {
            data.nominations[i].status = "rejected";
            data.transactions.push({
              timestamp: Date.now(),
              title: "Nomination Reapproved",
              type: "Nomination",
              old: parseFloat(data.balance),
              new: parseFloat((parseFloat(data.balance) + 1).toFixed(2)),
              difference: 1,
              description: "Nomination for " + data.nominations[i].nomination_url
            });
            var url = data.nominations[i].nomination_url;
            data.balance = parseFloat((parseFloat(data.balance) + 1).toFixed(2));
            data.nominations[i].status = "approved";
            Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
              db.users.editByRedditId(data.reddit_id, data).then(function() {
                db.users.getByRedditUsername(data.nominations[i].nominator_name.toLowerCase()).then(function(data) {
                  data.transactions.push({
                    timestamp: Date.now(),
                    title: "Nominating Submission (Reapproved)",
                    type: "Nominating Submission",
                    old: parseFloat(data.balance),
                    new: parseFloat((parseFloat(data.balance) + 0.1).toFixed(2)),
                    difference: + 0.1,
                    description: "Nominating " + url
                  });
                  data.balance = parseFloat((parseFloat(data.balance) + 0.1).toFixed(2));
                  Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
                    db.users.editByRedditId(data.reddit_id, data).then(function() {
                      res.send({ message: "success" });
                    });
                  });
                });
              });
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

router.post("/transactions", function(req, res, next) {
  var result = [];
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.reddit) {
      db.users.getByRedditUsername(req.body.reddit.toLowerCase()).then(function(data) {
        if (!data || !data.transactions) {
          res.send({ message: "not_found" });
          return;
        }
        if (req.body.twitch && req.body.twitch.toLowerCase() != data.twitch_username) {
          res.send({ message: "not_found" });
          return;
        }
        if (req.body.discord && req.body.discord != data.discord_id) {
          res.send({ message: "not_found" });
          return;
        }
        for (var i in data.transactions) {
          if (req.body.id && data.transactions[i].timestamp.toString() != req.body.id) {
            continue;
          }
          data.transactions[i].user = data.reddit_name;
          result.push(data.transactions[i]);
        }
        if (result.length > 0) {
          if (req.body.response == "table") {
            res.render("transaction_partial", { data: result });
          }
          else if (req.body.response == "modal") {
            res.render("transaction_modal_partial", { data: result });
          }
          else {
            res.send({ message: "unknown" });
          }
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
        if (!data || !data.transactions) {
          res.send({ message: "not_found" });
          return;
        }
        if (req.body.discord && req.body.discord != data.discord_id) {
          res.send({ message: "not_found" });
          return;
        }
        for (var i in data.transactions) {
          if (req.body.id && data.transactions[i].timestamp.toString() != req.body.id) {
            continue;
          }
          data.transactions[i].user = data.reddit_name;
          result.push(data.transactions[i]);
        }
        if (result.length > 0) {
          if (req.body.response == "table") {
            res.render("transaction_partial", { data: result });
          }
          else if (req.body.response == "modal") {
            res.render("transaction_modal_partial", { data: result });
          }
          else {
            res.send({ message: "unknown" });
          }
          return;
        }
        else {
          res.send({ message: "not_found" });
          return;
        }
      });
    }
    else if (req.body.discord) {
      db.users.getByDiscordId(req.body.discord).then(function(data) {
        if (!data || !data.transactions) {
          res.send({ message: "not_found" });
          return;
        }
        for (var i in data.transactions) {
          if (req.body.id && data.transactions[i].timestamp.toString() != req.body.id) {
            continue;
          }
          data.transactions[i].user = data.reddit_name;
          result.push(data.transactions[i]);
        }
        if (result.length > 0) {
          if (req.body.response == "table") {
            res.render("transaction_partial", { data: result });
          }
          else if (req.body.response == "modal") {
            res.render("transaction_modal_partial", { data: result });
          }
          else {
            res.send({ message: "unknown" });
          }
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
          for (var j in data[i].transactions) {
            if (req.body.id && data[i].transactions[j].timestamp.toString() != req.body.id.toString()) {
              continue;
            }
            data[i].transactions[j].user = data[i].reddit_name;
            data[i].transactions[j].user_id = data[i].reddit_id;
            result.push(data[i].transactions[j]);
          }
        }
        if (result.length > 0) {
          if (req.body.response == "table") {
            res.render("transaction_partial", { data: result });
          }
          else if (req.body.response == "modal") {
            res.render("transaction_modal_partial", { data: result });
          }
          else {
            res.send({ message: "unknown" });
          }
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

router.post("/nominations", function(req, res, next) {
  var result = [];
  if (req.session.type == "mod" || req.session.type == "helper") {
    if (req.body.reddit) {
      db.users.getByRedditUsername(req.body.reddit.toLowerCase()).then(function(data) {
        if (!data || !data.nominations) {
          res.send({ message: "not_found" });
          return;
        }
        if (req.body.twitch && req.body.twitch.toLowerCase() != data.twitch_username) {
          res.send({ message: "not_found" });
          return;
        }
        if (req.body.discord && req.body.discord != data.discord_id) {
          res.send({ message: "not_found" });
          return;
        }
        for (var i in data.nominations) {
          if (req.body.id && data.nominations[i].nomination_id.toString() != req.body.id) {
            continue;
          }
          if (req.body.url && req.body.url != data.nominations[i].nomination_url) {
            continue;
          }
          if (req.body.status && req.body.status != data.nominations[i].status) {
            continue;
          }
          data.nominations[i].user = data.reddit_name;
          data.nominations[i].user_id = data.reddit_id;
          result.push(data.nominations[i]);
        }
        if (result.length > 0) {
          if (req.body.response == "table") {
            res.render("nomination_partial", { data: result });
          }
          else if (req.body.response == "modal") {
            res.render("nomination_modal_partial", { data: result });
          }
          else {
            res.send({ message: "unknown" });
          }
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
        if (!data || !data.nominations) {
          res.send({ message: "not_found" });
          return;
        }
        if (req.body.discord && req.body.discord != data.discord_id) {
          res.send({ message: "not_found" });
          return;
        }
        for (var i in data.nominations) {
          if (req.body.id && data.nominations[i].nomination_id != req.body.id) {
            continue;
          }
          if (req.body.url && req.body.url != data.nominations[i].nomination_url) {
            continue;
          }
          if (req.body.status && req.body.status != data.nominations[i].status) {
            continue;
          }
          data.nominations[i].user = data.reddit_name;
          data.nominations[i].user_id = data.reddit_id;
          result.push(data.nominations[i]);
        }
        if (result.length > 0) {
          if (req.body.response == "table") {
            res.render("nomination_partial", { data: result });
          }
          else if (req.body.response == "modal") {
            res.render("nomination_modal_partial", { data: result });
          }
          else {
            res.send({ message: "unknown" });
          }
          return;
        }
        else {
          res.send({ message: "not_found" });
          return;
        }
      });
    }
    else if (req.body.discord) {
      db.users.getByDiscordId(req.body.discord).then(function(data) {
        if (!data || !data.nominations) {
          res.send({ message: "not_found" });
          return;
        }
        for (var i in data.nominations) {
          if (req.body.id && data.nominations[i].nomination_id.toString() != req.body.id) {
            continue;
          }
          if (req.body.url && req.body.url != data.nominations[i].nomination_url) {
            continue;
          }
          if (req.body.status && req.body.status != data.nominations[i].status) {
            continue;
          }
          data.nominations[i].user = data.reddit_name;
          data.nominations[i].user_id = data.reddit_id;
          result.push(data.nominations[i]);
        }
        if (result.length > 0) {
          if (req.body.response == "table") {
            res.render("nomination_partial", { data: result });
          }
          else if (req.body.response == "modal") {
            res.render("nomination_modal_partial", { data: result });
          }
          else {
            res.send({ message: "unknown" });
          }
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
          for (var j in data[i].nominations) {
            if (req.body.id && data[i].nominations[j].nomination_id.toString() != req.body.id.toString()) {
              continue;
            }
            if (req.body.url && req.body.url != data[i].nominations[j].nomination_url) {
              continue;
            }
            if (req.body.status && req.body.status != data[i].nominations[j].status) {
              continue;
            }
            data[i].nominations[j].user = data[i].reddit_name;
            data[i].nominations[j].user_id = data[i].reddit_id;
            result.push(data[i].nominations[j]);
          }
        }
        if (result.length > 0) {
          if (req.body.response == "table") {
            res.render("nomination_partial", { data: result });
          }
          else if (req.body.response == "modal") {
            res.render("nomination_modal_partial", { data: result });
          }
          else {
            res.send({ message: "unknown" });
          }
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

module.exports = router;
