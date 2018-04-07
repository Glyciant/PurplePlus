// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    db = require("../db"),
    router = express.Router();

// Handle Route: /
router.get("/", function(req, res, next) {
    // Response Placeholder
    res.render("index");
});

module.exports = router;