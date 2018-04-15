// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /profile/
router.get("/", function(req, res, next) {
    // Response Placeholder
    res.render("index");
});

module.exports = router;