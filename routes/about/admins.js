var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  db.users.getAdmins().then(function(data) {
    res.render("admins", { title: "Site Admins", data: data });
  })
});

module.exports = router;
