// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /about
router.get("/", function(req, res, next) {
    res.redirect("/about/statistics/");
});

// Handle Route: /about/statistics
router.get("/statistics", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

// Handle Route: /about/subreddit
router.get("/subreddit", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

// Handle Route: /about/admins
router.get("/admins", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

// Handle Route: /about/beta
router.get("/beta", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

// Handle Route: /about/features
router.get("/features", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

// Handle Route: /about/discord
router.get("/discord", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

// Handle Route: /about/terms
router.get("/terms", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

// Handle Route: /about/privacy
router.get("/privacy", function(req, res, next) {
    res.render("error", { title: "418 Error", code: "418" });
});

module.exports = router;