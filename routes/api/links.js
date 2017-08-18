var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/:short", function(req, res, next) {
  db.links.getByShort(req.params.short).then(function(data) {
    if (data) {
      res.json({
        status: 200,
        message: "OK",
        description: "Match Found",
        short: data.short,
        redirect: data.redirect,
        enabled: data.enabled
      });
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no short link with the code " + req.params.short + "."
      });
    }
  });
});

module.exports = router;
