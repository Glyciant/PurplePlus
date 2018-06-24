// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /beta/changelog/
router.get("/changelog/", function(req, res, next) {
    // Send Static Page
    res.render("changelog", { title: "Changelog" });
});

// Handle Route: /beta/twoos/
router.get("/twoos/", function(req, res, next) {
    // Send Static
    res.render("twoos", { title: "Twoos Scale" });
});

module.exports = router;