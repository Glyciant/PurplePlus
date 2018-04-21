// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /user/:username/
router.get("/:username/", function(req, res, next) {
    req.db.collection("users").findOne({
        "twitch_username": req.params.username.toLowerCase()
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Check if Result Exists
            if (result) {
                req.db.collection("profiles").findOne({
                    "twitch_id": result.twitch_id
                }, function(err, result) {
                    // Handle Database Connection Failure
                    if (err) {
                        res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                    }
                    else {
                        // Check if Result Exists
                        if (result) {
                            helpers.twitchHelix.getUser(req.session.loggedin.twitch_id).then(function(api) {
                            res.render("profile", { title: "My Profile", pagenav: true, user: user, profile: result, api: api.data[0] });
                            });
                        }
                        else {
                            res.render("error", { title: "404 Error", code: "404", message: "There was no profile found for " + req.params.username + "." });
                        }
                        
                    }
                });
            }
            else {
                res.render("error", { title: "404 Error", code: "404", message: "There was no profile found for " + req.params.username + "." });
            }
        }
    });
});

// Handle Route: /user/content/overview
router.post("/content/overview", function(req, res) {
    Promise.all([helpers.twitchHelix.getUser(req.session.loggedin.twitch_id), helpers.twitchKraken.getChannel(req.session.loggedin.twitch_id)]).then(function(api) {
        res.render("user\\overview", { api: api });
    });
});

// Handle Route: /user/content/body
router.post("/content/body", function(req, res) {
    res.render("user\\body");
});

// Handle Route: /user/content/player
router.post("/content/player", function(req, res) {
    res.render("user\\player", { user: req.session.loggedin.twitch_username });
});


module.exports = router;