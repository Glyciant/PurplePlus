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
        // Check if Profile Exists
        req.db.collection("profiles").findOne({
            "twitch_id": req.session.loggedin.twitch_id,
            "status": {
                "$not": {
                    "$eq": "incomplete"
                }
            }
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                // Check if Result Exists
                if (result) {
                    res.redirect("/user/" + req.session.loggedin.twitch_username)
                }
                else {
                    res.render("profile\\introduction", { title: "Create Profile" });
                }
            }
        });
    }
    else {
        res.redirect("/auth/redirect/twitch")
    }
});

// Handle Route: /profile/overview/
router.get("/overview", function(req, res, next) {
    // Check User is Logged In
    if (req.session.loggedin) {
        // Check if Profile Exists
        req.db.collection("profiles").findOne({
            "twitch_id": req.session.loggedin.twitch_id
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                res.render("profile\\overview", { title: "Profile Overview", profile: result });
            }
        });
    }
    else {
        res.redirect("/auth/redirect/twitch")
    }
});

// Handle Route: /profile/create/
router.post("/create", function(req, res, next) {
    // Check User is Logged In
    if (req.session.loggedin) {
        // Begin Creating Profile
        req.session.creating = true;
        // Check if Profile is in Progress
        req.db.collection("profiles").findOne({
            twitch_id: req.session.loggedin.twitch_id
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                // Check if Profile is in Progress
                if (result) {
                    res.send({ status: 200 });
                }
                else {
                    // Generate Profile Object
                    req.db.collection("profiles").insertOne({
                        twitch_id: req.session.loggedin.twitch_id,
                        overview: {
                            introduction: null,
                            clip: null,
                            tags: []
                        },
                        body: {
                            categories: {
                                gaming: false,
                                creative: false,
                                socialeating: false,
                                irl: false,
                                talkshow: false,
                                music: false,
                                artist: false,
                                communitymanager: false,
                                developer: false,
                                editors: false,
                                moderator: false,
                                viewer: false
                            },
                            about: null,
                            goals: null,
                            experiences: null,
                            background: null,
                            content: null
                        },
                        social_media: {
                            facebook: null,
                            twitter: null,
                            instagram: null,
                            snapchat: null,
                            youtube: null,
                            steam: null,
                            github: null,
                            deviantart: null,
                            soundcloud: null,
                            googleplus: null,
                            linkedin: null,
                            tumblr: null,
                            patreon: null,
                            askfm: null
                        },
                        communities: {
                            discord: null,
                            subreddit: null,
                            twitch: null,
                            steam: null
                        },
                        features: {
                            trophies: null,
                            player: null,
                            profiles: null,
                            videos: null,
                            teams: null,
                            discussions: null,
                            requests: null
                        },
                        notifications: {
                            twitch: true,
                            reddit: true,
                            discord: true
                        },
                        status: "incomplete",
                        created_at: Date.now(),
                        updated_at: Date.now()
                    }, function(err, result) {
                        // Handle Database Connection Failure
                        if (err) {
                            res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                        }
                        else {
                            // Respond
                            res.send({ status: 200 });
                        }
                    });
                }
            }
        });
        
    }
    else {
        // Respond
        res.send({ status: 403 });
    }
});

// Handle Route: /profile/next/
router.post("/next", function(req, res, next) {
    // Check User is Logged In
    if (req.session.loggedin) {
        // Work Out Profile Step
        if (req.body.page == "overview") {
            // Begin Error Validation
            var errors = [];

            // Check Introduction Length
            if (!req.body.introduction || req.body.introduction.length < 100) {
                errors.push("introduction");
            }

            // Check Number of Tags
            if (!req.body.tags || req.body.tags.length < 3 || req.body.tags.length > 15) {
                errors.push("tags");
            }

            // Check User Owns Clip
            if (req.body.clip) {
                if (req.body.clip.indexOf("https://clips.twitch.tv/") > -1 || req.body.clip.indexOf("http://clips.twitch.tv/") > -1) {
                    helpers.twitchHelix.getClip(req.body.clip.replace("https://clips.twitch.tv/", "").replace("http://clips.twitch.tv/", "")).then(function(api) {
                        if (api && api.data && api.data[0] && api.data[0].broadcaster_id == req.session.loggedin.twitch_id) {
                            if (errors.length === 0) {
                                req.db.collection("profiles").updateOne({
                                    twitch_id: req.session.loggedin.twitch_id
                                }, {
                                    $set: {
                                        "overview.introduction": req.body.introduction,
                                        "overview.clip": req.body.clip,
                                        "overview.tags": req.body.tags,
                                        updated_at: Date.now()
                                    }
                                }, function(err, result) {
                                    if (err) {
                                        res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                                    }
                                    else {
                                        // Respond
                                        res.send({ status: 200 });
                                    }
                                });
                            }
                            else {
                                // Respond
                                res.send({ status: 400, errors: errors });
                            }
                        }
                        else {
                            errors.push("clip");
                            // Respond
                            res.send({ status: 400, errors: errors });
                        }
                    });
                }
                else {
                    errors.push("clip");
                    // Respond
                    res.send({ status: 400, errors: errors });
                }
            }
            else {
                if (errors.length === 0) {
                    req.db.collection("profiles").updateOne({
                        twitch_id: req.session.loggedin.twitch_id
                    }, {
                        $set: {
                            "overview.introduction": req.body.introduction,
                            "overview.tags": req.body.tags,
                            updated_at: Date.now()
                        }
                    }, function(err, result) {
                        if (err) {
                            res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                        }
                        else {
                            // Respond
                            res.send({ status: 200 });
                        }
                    });
                }
                else {
                    // Respond
                    res.send({ status: 400, errors: errors });
                }
            }
        }
        else {
            // Respond
            res.send({ status: 400 });
        }
    }
    else {
        // Respond
        res.send({ status: 403 });
    }
});

module.exports = router;