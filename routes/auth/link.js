// Modules
var express = require("express"),
    config = require("../../config"),
    restler = require("restler"),
    router = express.Router();

// Handle Route: /auth/link/reddit
router.get("/reddit", function(req, res, next) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check for Access Denied Error
        if (req.query.error != "access_denied") {
            // Check State String is Correct
            if (req.query.state == req.session.reddit_state) {
                // Get OAuth Token
                restler.post("https://www.reddit.com/api/v1/access_token", {
                    username: config.reddit.auth.id,
                    password: config.reddit.auth.secret,
                    data: {
                        code: req.query.code,
                        grant_type: "authorization_code",
                        redirect_uri: config.reddit.auth.redirect
                    }
                }).on("complete", function(auth) {
                    restler.get("https://oauth.reddit.com/api/v1/me", {
                        "headers": {
                            "User-Agent": "Purple+",
                            "Authorization": "bearer " + auth.access_token
                        }
                    }).on("complete", function(resp) {
                        var user = resp;

                        // Get User's Account Record
                        req.db.collection("users").findOne({
                            "twitch_id": req.session.loggedin.twitch_id
                        }, function(err, result) {
                            // Handle Database Connection Failure
                            if (err) {
                                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                            }
                            else {
                                req.db.collection("users").updateOne({ 
                                    "twitch_id": req.session.loggedin.twitch_id
                                }, {
                                    "$set": {
                                        "reddit_id": user.id,
                                        "reddit_name": user.name,
                                        "reddit_username": user.name.toLowerCase()
                                    }
                                }, function(err, result) {
                                    // Handle Database Connection Failure
                                    if (err) {
                                        res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                                    }
                                    else {
                                        res.redirect("/accounts/")
                                    }
                                });
                            }
                        });
                    });
                });
            }      
            else {
                res.render("error", { title: "403 Error", code: "403", message: "An invalid state parameter was returned. Please try again." });
            }
        }
        else {
            res.render("error", { title: "401 Error", code: "401", message: "Access to your account was denied." });
        }
    }
    else {
        res.render("error", { title: "400 Error", code: "400", message: "You must be logged in to link your Reddit account." });
    }
});

// Handle Route: /auth/link/discord
router.get("/discord", function(req, res, next) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check for Access Denied Error
        if (req.query.error != "access_denied") {
            // Check State String is Correct
            if (req.query.state == req.session.discord_state) {
                // Get OAuth Token
                restler.post("https://discordapp.com/api/oauth2/token", {
                    data: {
                        client_id: config.discord.auth.id,
                        client_secret: config.discord.auth.secret,
                        grant_type: "authorization_code",
                        redirect_uri: config.discord.auth.redirect,
                        code: req.query.code
                    }
                }).on("complete", function(auth) {
                    restler.get("https://discordapp.com/api/users/@me", {
                        "headers": {
                            "Authorization": "Bearer " + auth.access_token
                        }
                    }).on("complete", function(resp) {
                        var user = resp;

                        // Get User's Account Record
                        req.db.collection("users").findOne({
                            "twitch_id": req.session.loggedin.twitch_id
                        }, function(err, result) {
                            // Handle Database Connection Failure
                            if (err) {
                                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                            }
                            else {
                                req.db.collection("users").updateOne({ 
                                    "twitch_id": req.session.loggedin.twitch_id
                                }, {
                                    "$set": {
                                        "discord_id": user.id,
                                        "discord_name": user.username,
                                        "discord_discriminator": "#" + user.discriminator
                                    }
                                }, function(err, result) {
                                    // Handle Database Connection Failure
                                    if (err) {
                                        res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                                    }
                                    else {
                                        res.redirect("/accounts/")
                                    }
                                });
                            }
                        });
                    });
                });
            }      
            else {
                res.render("error", { title: "403 Error", code: "403", message: "An invalid state parameter was returned. Please try again." });
            }
        }
        else {
            res.render("error", { title: "401 Error", code: "401", message: "Access to your account was denied." });
        }
    }
    else {
        res.render("error", { title: "400 Error", code: "400", message: "You must be logged in to link your Discord account." });
    }
});

module.exports = router;