var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  db.users.getAdmins().then(function(data) {
    data.sort(function(a, b){
      if (a.twitch_username < b.twitch_username) { return -1; }
      if (a.twitch_username > b.twitch_username) { return 1; }
      return 0;
    });
    res.render("admins", { title: "Site Admins", data: data });
  })
});

module.exports = router;
