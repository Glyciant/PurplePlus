var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    db = require("../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  res.redirect("/");
});

router.get("/:link", function(req, res, next) {
  db.links.getByShort(req.params.link).then(function(data) {
    if (data) {
      if (data.enabled === true) {
        res.redirect(data.redirect);
      }
      else {
        res.render('error', { title: '400 Error', code: '400', message: 'That short link is disabled.' });
      }
    }
    else {
      res.render('error', { title: '404 Error', code: '404', message: 'That short link does not exist.' });
    }
  });
});

module.exports = router;
