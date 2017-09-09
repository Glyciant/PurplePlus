var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    db = require("../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
      res.render("schedule_list", { title: "Your Schedule", data: data });
    });
  }
  else {
    req.session.return = "/schedule";
    res.redirect("/auth/redirect/twitch");
  }
});

router.get("/stream", function(req, res, next)  {
  res.redirect("/schedule/stream/new");
});

router.get("/stream/import", function(req, res, next) {
  if (req.session.twitch) {
    helpers.twitch.getChannelEventsById(req.session.twitch.id).then(function(data) {
      res.render("schedule_import", { title: "Schedule Stream", data: data.events });
    });
  }
  else {
    req.session.return = "/schedule/stream/import";
    res.redirect("/auth/redirect/twitch");
  }
});

router.get("/stream/new", function(req, res, next) {
  if (req.session.twitch) {
    var data = req.session.schedule;
    delete req.session.schedule;
    res.render("schedule_edit", { title: "Schedule Stream", data: data });
  }
  else {
    req.session.return = "/schedule/stream/" + req.params.id;
    res.redirect("/auth/redirect/twitch");
  }
});

router.get("/stream/:id", function(req, res, next) {
  if (req.session.twitch) {
    if (req.session.timezone) {
      db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
        if (!data.streams) {
          data.streams = [];
        }
        var index = data.streams.map(function(x) { return x.id; }).indexOf(req.params.id);
        if (index > -1) {
          data.streams[index].start = data.streams[index].start + req.session.timezone;
          data.streams[index].end = data.streams[index].end + req.session.timezone;
          delete req.session.timezone;
          res.render("schedule_edit", { title: "Schedule Stream", data: data.streams[index] });
        }
        else {
          res.redirect("/schedule/stream/new");
        }
      });
    }
    else {
      res.redirect("/schedule/");
    }
  }
  else {
    req.session.return = "/schedule/stream/" + req.params.id;
    res.redirect("/auth/redirect/twitch");
  }
});

router.post("/event/prepare", function(req, res, next) {
  if (req.session.twitch && req.session.twitch.id == req.body.channel) {
    helpers.twitch.getChannelEventsById(req.body.channel).then(function(data) {
      var index = data.events.map(function(x) { return x._id; }).indexOf(req.body.id),
          event = data.events[index];

      req.session.schedule = {};
      req.session.schedule.title = event.title;
      req.session.schedule.description = event.description;
      req.session.schedule.directory = event.game.name;
      req.session.schedule.start = new Date(event.start_time).getTime() + parseInt(req.body.timezone);
      req.session.schedule.end = new Date(event.end_time).getTime() + parseInt(req.body.timezone);

      res.send({ message: "success" });
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/streams/directories", function(req, res, next) {
  helpers.twitch.getDirectoriesByQuery(req.body.query).then(function(data) {
    res.send({ message: "success", data: data });
  });
});

router.post("/streams/save", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
      if (!data.streams) {
        data.streams = [];
      }
      helpers.twitch.getDirectoriesByQuery(req.body.directory).then(function(game) {
        if (game.games && game.games.map(function(x) { return x.name; }).indexOf(req.body.directory) > -1) {
          req.body.start = parseInt(req.body.start);
          req.body.end = parseInt(req.body.end);
          for (var stream of data.streams) {
            if (((stream.start >= req.body.start && stream.start < req.body.end) || (stream.end > req.body.start && stream.end <= req.body.end)) && stream.id !== req.body.id) {
              var clash = true;
            }
          }
          if (!clash) {
            if (req.body.directory === "Creative") {
              req.body.type = "creative";
            }
            else if (req.body.directory === "IRL") {
              req.body.type = "irl";
            }
            else if (req.body.directory === "Social Eating") {
              req.body.type = "socialeating";
            }
            else if (req.body.directory === "Talk Shows") {
              req.body.type = "talkshow";
            }
            else if (req.body.directory === "Music") {
              req.body.type = "music";
            }
            else {
              req.body.type = "gaming";
            }
            if (req.body.id) {
              var index = data.streams.map(function(x) { return x.id; }).indexOf(req.body.id);
              if (index > -1) {
                data.streams.splice(index, 1);
              }
              else {
                res.send({ message: "unknown" });
                return;
              }
            }
            else {
              req.body.id = req.session.twitch.id + "_" + new Date().getTime();
            }
            if (req.body.start < req.body.end) {
              data.streams.push(req.body);
              data.streams.sort(function(a, b){
                if (a.start < b.start) { return -1; }
                if (a.start > b.start) { return 1; }
                return 0;
              });
              db.users.editByTwitchId(data.twitch_id, data).then(function() {
                res.send({ message: "success" });
              });
            }
            else {
              res.send({ message: "unknown" });
            }
          }
          else {
            res.send({ message: "invalid_timestamp" });
          }
        }
        else {
          res.send({ message: "invalid_game" });
        }
      });
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

router.post("/streams/edit", function(req, res, next) {
  req.session.timezone = parseInt(req.body.timezone);
  res.send({ message: "success" });
});

router.post("/streams/delete", function(req, res, next) {
  if (req.session.twitch) {
    db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
      if (data && req.body.id) {
        var index = data.streams.map(function(x) { return x.id; }).indexOf(req.body.id);
        if (index > -1) {
          data.streams.splice(index, 1);
          db.users.editByTwitchId(data.twitch_id, data).then(function(data) {
            res.send({ message: "success" });
          });
        }
        else {
          res.send({ message: "unknown" });
        }
      }
      else {
        res.send({ message: "unknown" });
      }
    });
  }
  else {
    res.send({ message: "forbidden" });
  }
});

module.exports = router;
