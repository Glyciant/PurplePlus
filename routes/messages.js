// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /messages
router.get("/", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

module.exports = router;