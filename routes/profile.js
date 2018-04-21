// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /profile/
router.get("/", function(req, res, next) {
    // Check User is Logged In
    if (req.session.loggedin) {
        req.db.collection("users").findOne({
            "twitch_id": req.session.loggedin.twitch_id
        }, function(err, result) {
            // Store Result for Later
            var user = result;
            // Handle Database Connection Failure
            if (err) {
                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                req.db.collection("profiles").findOne({
                    "twitch_id": req.session.loggedin.twitch_id
                }, function(err, result) {
                    // Handle Database Connection Failure
                    if (err) {
                        res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                    }
                    else {
                        helpers.twitchHelix.getUser(req.session.loggedin.twitch_id).then(function(api) {
                            res.render("profile", { title: "My Profile", pagenav: true, user: user, profile: result, api: api.data[0] });
                        });
                    }
                });
            }
        })
    }
    else {
        res.redirect("/auth/redirect/twitch")
    }
});

// Handle Route: /profile/content/overview
router.post("/content/overview", function(req, res) {
    Promise.all([helpers.twitchHelix.getUser(req.session.loggedin.twitch_id), helpers.twitchKraken.getChannel(req.session.loggedin.twitch_id)]).then(function(api) {
        res.render("users\\overview", { api: api });
    });
});

// Handle Route: /profile/content/body
router.post("/content/body", function(req, res) {
    res.render("users\\body");
});

// Handle Route: /profile/content/player
router.post("/content/player", function(req, res) {
    res.render("users\\player", { user: req.session.loggedin.twitch_username });
});


module.exports = router;