var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  var d = new Date();
  var times = {
    "1": new Date(Math.floor(d.getTime() / 1800000) * 1800000).getTime()
  },
  i = 2;
  while (i <= 10) {
    times[i.toString()] = times[(i - 1).toString()] + 1800000;
    i++;
  }
  db.users.getScheduledStreams(times[1], times[10], 100, 0).then(function(data) {
    data.sort(function(a, b){
      if (a.balance > b.balance) { return -1; }
      if (a.balance < b.balance) { return 1; }
      return 0;
    });
    res.render("schedule", { title: "Schedule", times: times, data: data });
  });
});

router.post("/header", function(req, res, next) {
  if (!req.body.start) {
    var d = new Date();
  }
  else {
    var d = new Date(parseInt(req.body.start));
    if (isNaN(d.getTime())) {
      var d = new Date();
    }
  }
  var times = {
    "1": new Date(Math.floor(d.getTime() / 1800000) * 1800000).getTime()
  },
  i = 2;
  while (i <= 10) {
    times[i.toString()] = times[(i - 1).toString()] + 1800000;
    i++;
  }
  res.render("schedule_header_partial", { times: times });
});

router.post("/streams", function(req, res, next) {
  if (!req.body.start) {
    var d = new Date();
  }
  else {
    var d = new Date(parseInt(req.body.start));
    if (isNaN(d.getTime())) {
      var d = new Date();
    }
  }
  var times = {
    "1": new Date(Math.floor(d.getTime() / 1800000) * 1800000).getTime()
  },
  i = 2;
  while (i <= 10) {
    times[i.toString()] = times[(i - 1).toString()] + 1800000;
    i++;
  }
  if (req.body.method == "scroll") {
    db.users.getByTwitchIds(req.body.ids).then(function(data) {
      data.sort(function(a, b){
        if (a.balance > b.balance) { return -1; }
        if (a.balance < b.balance) { return 1; }
        return 0;
      });
      res.render("schedule_partial", { times: times, data: data });
    });
  }
  else {
    if (req.body.query) {
      db.users.searchApproved(100, "", req.body.query).then(function(data) {
        data.sort(function(a, b){
          if (a.balance > b.balance) { return -1; }
          if (a.balance < b.balance) { return 1; }
          return 0;
        });
        res.render("schedule_partial", { times: times, data: data });
      });
    }
    else {
      db.users.getScheduledStreams(times[1], times[10], 100, 0).then(function(data) {
        res.render("schedule_partial", { times: times, data: data });
      });
    }
  }
});

module.exports = router;
