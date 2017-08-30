var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  db.users.getBetaTesters().then(function(data) {
    res.render("beta_testers", { title: "Beta Testers", data: data });
  })
});

module.exports = router;
