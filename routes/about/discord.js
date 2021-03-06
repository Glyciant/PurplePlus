var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  db.commands.getAll().then(function(data) {
    res.render("discord", { title: "Discord Commands", data: data });
  })
});

module.exports = router;
