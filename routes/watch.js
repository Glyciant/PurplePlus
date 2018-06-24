// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /watch
router.get("/", function(req, res, next) {
    // Send Error
    res.render("error", { title: "400 Error", code: "400", message: "You must specify a user to watch." });
});

// Handle Route: /watch/:user
router.get("/:user", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

module.exports = router;