var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  res.render("search", { title: "Search" });
});

router.post("/search", function(req, res, next) {
  db.users.searchApproved(24, req.body.ids, req.body.query).then(function(data) {
    if (data[0] && data[0].twitch_name) {
      res.render("profile_partial", { data: data });
    }
    else if (req.body.init) {
      res.render("missing_partial", { message: "Your search query returned no results.", margin: true });
    }
    else {
      res.send();
    }
  });
});

module.exports = router;
