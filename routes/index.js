var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    db = require("../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.visited && !req.query.show) {
    res.redirect("/browse/streams");
  }
  else {
    req.session.visited = true;
    res.render("index", { hidenav: true });
  }
});

module.exports = router;
