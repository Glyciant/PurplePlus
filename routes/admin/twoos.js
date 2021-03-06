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
        for (var nomination of data.nominations) {
          if (nomination.nomination_id.toString() == req.body.id.toString()) {
            nomination.status = "approved";
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
        for (var nomination of data.nominations) {
          if (nomination.nomination_id.toString() == req.body.id.toString()) {
            nomination.status = "rejected";
            data.transactions.push({
              timestamp: Date.now(),
              title: "Nomination Rejected",
              type: "Nomination",
              old: parseFloat(data.balance),
              new: parseFloat((parseFloat(data.balance) - 1).toFixed(2)),
              difference: - 1,
              description: "Nomination for " + nomination.nomination_url
            });
            var url = nomination.nomination_url;
            data.balance = parseFloat((parseFloat(data.balance) - 1).toFixed(2));
            Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
              db.users.editByRedditId(data.reddit_id, data).then(function() {
                db.users.getByRedditUsername(nomination.nominator_name.toLowerCase()).then(function(data) {
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
        for (var nomination of data.nominations) {
          if (nomination.nomination_id.toString() == req.body.id.toString()) {
            nomination.status = "rejected";
            data.transactions.push({
              timestamp: Date.now(),
              title: "Nomination Reapproved",
              type: "Nomination",
              old: parseFloat(data.balance),
              new: parseFloat((parseFloat(data.balance) + 1).toFixed(2)),
              difference: 1,
              description: "Nomination for " + nomination.nomination_url
            });
            var url = nomination.nomination_url;
            data.balance = parseFloat((parseFloat(data.balance) + 1).toFixed(2));
            nomination.status = "approved";
            Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
              db.users.editByRedditId(data.reddit_id, data).then(function() {
                db.users.getByRedditUsername(nomination.nominator_name.toLowerCase()).then(function(data) {
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
        for (var transaction of data.transactions) {
          if (req.body.id && transaction.timestamp.toString() != req.body.id) {
            continue;
          }
          transaction.user = data.reddit_name;
          result.push(transaction);
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
        for (var transaction of data.transactions) {
          if (req.body.id && transaction.timestamp.toString() != req.body.id) {
            continue;
          }
          transaction.user = data.reddit_name;
          result.push(transaction);
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
        for (var transaction of data.transactions) {
          if (req.body.id && transaction.timestamp.toString() != req.body.id) {
            continue;
          }
          transaction.user = data.reddit_name;
          result.push(transaction);
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
        for (var user of data) {
          for (var transaction of user.transactions) {
            if (req.body.id && transaction.timestamp.toString() != req.body.id.toString()) {
              continue;
            }
            transaction.user = user.reddit_name;
            transaction.user_id = user.reddit_id;
            result.push(transaction);
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
        for (var nomination of data.nominations) {
          if (req.body.id && nomination.nomination_id.toString() != req.body.id) {
            continue;
          }
          if (req.body.url && req.body.url != nomination.nomination_url) {
            continue;
          }
          if (req.body.status && req.body.status != nomination.status) {
            continue;
          }
          nomination.user = data.reddit_name;
          nomination.user_id = data.reddit_id;
          result.push(nomination);
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
        for (var nomination of data.nominations) {
          if (req.body.id && nomination.nomination_id != req.body.id) {
            continue;
          }
          if (req.body.url && req.body.url != nomination.nomination_url) {
            continue;
          }
          if (req.body.status && req.body.status != nomination.status) {
            continue;
          }
          nomination.user = data.reddit_name;
          nomination.user_id = data.reddit_id;
          result.push(nomination);
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
        for (var nomination of data.nominations) {
          if (req.body.id && nomination.nomination_id.toString() != req.body.id) {
            continue;
          }
          if (req.body.url && req.body.url != nomination.nomination_url) {
            continue;
          }
          if (req.body.status && req.body.status != nomination.status) {
            continue;
          }
          nomination.user = data.reddit_name;
          nomination.user_id = data.reddit_id;
          result.push(nomination);
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
        for (var user of data) {
          for (var nomination of user.nominations) {
            if (req.body.id && nomination.nomination_id.toString() != req.body.id.toString()) {
              continue;
            }
            if (req.body.url && req.body.url != nomination.nomination_url) {
              continue;
            }
            if (req.body.status && req.body.status != nomination.status) {
              continue;
            }
            nomination.user = user.reddit_name;
            nomination.user_id = user.reddit_id;
            result.push(nomination);
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
