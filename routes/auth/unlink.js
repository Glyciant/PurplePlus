// Modules
var express = require("express"),
    config = require("../../config"),
    restler = require("restler"),
    router = express.Router();

// Handle Route: /auth/unlink/reddit
router.get("/reddit/", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Get User's Account Record
        req.db.collection("users").findOne({
            "twitch_id": req.session.loggedin.twitch_id
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                // Update User's Account Record
                req.db.collection("users").updateOne({ 
                    "twitch_id": req.session.loggedin.twitch_id
                }, {
                    "$set": {
                        "reddit_id": null,
                        "reddit_name": null,
                        "reddit_username": null
                    }
                }, function(err, result) {
                    // Handle Database Connection Failure
                    if (err) {
                        res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                    }
                    else {
                        // Redirect to Account Link Page
                        res.redirect("/dashboard/account/link/");
                    }
                });
            }
        });
    }
    else {
        res.render("error", { title: "400 Error", code: "400", message: "You must be logged in to unlink your Reddit account." });
    }
});

// Handle Route: /auth/unlink/discord
router.get("/discord/", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Get User's Account Record
        req.db.collection("users").findOne({
            "twitch_id": req.session.loggedin.twitch_id
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                // Update User's Account Record
                req.db.collection("users").updateOne({ 
                    "twitch_id": req.session.loggedin.twitch_id
                }, {
                    "$set": {
                        "discord_id": null,
                        "discord_name": null,
                        "discord_discriminator": null
                    }
                }, function(err, result) {
                    // Handle Database Connection Failure
                    if (err) {
                        res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                    }
                    else {
                        // Redirect to Account Link Page
                        res.redirect("/dashboard/account/link/");
                    }
                });
            }
        });
    }
    else {
        res.render("error", { title: "400 Error", code: "400", message: "You must be logged in to unlink your Discord account." });
    }
});

module.exports = router;