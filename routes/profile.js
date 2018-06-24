// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /profile
router.get("/", function(req, res, next) {
    // Check User is Logged In
    if (req.session.loggedin) {
        // Check if Profile Exists
        req.db.collection("profiles").findOne({
            "twitch_id": req.session.loggedin.twitch_id,
            "approval.status": {
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
                    // Show as Creating Profile
                    req.session.creating = true;
                    // Send Result
                    res.render("user\/create\/introduction", { title: "Create Profile" });
                }
            }
        });
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /profile/overview
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
                // Show as Creating Profile
                req.session.creating = true;
                // Send Result
                res.render("user\/create\/overview", { title: "Profile Overview", profile: result });
            }
        });
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /profile/body
router.get("/body", function(req, res, next) {
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
                // Show as Creating Profile
                req.session.creating = true;
                // Send Result
                res.render("user\/create\/body", { title: "Profile Body", profile: result });
            }
        });
    }
    else { 
        // Send Result
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /profile/social
router.get("/social", function(req, res, next) {
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
                // Show as Creating Profile
                req.session.creating = true;
                // Send Result
                res.render("user\/create\/socialmedia", { title: "Social Media", profile: result });
            }
        });
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /profile/communities
router.get("/communities", function(req, res, next) {
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
                // Show as Creating Profile
                req.session.creating = true;
                // Send Result
                res.render("user\/create\/communities", { title: "Communities", profile: result });
            }
        });
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /profile/features
router.get("/features", function(req, res, next) {
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
                // Show as Creating Profile
                req.session.creating = true;
                // Send Result
                res.render("user\/create\/features", { title: "Profile Features", profile: result });
            }
        });
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /profile/confirmation
router.get("/confirmation", function(req, res, next) {
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
                // Send Result
                res.render("user\/create\/confirmation", { title: "Confirmation", profile: result });
            }
        });
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /profile/create
router.post("/create", function(req, res, next) {
    // Check User is Logged In
    if (req.session.loggedin) {
        // Show as Creating Profile
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
                            other: null
                        },
                        social_media: {
                            facebook: null,
                            facebook_url: null,
                            twitter: null,
                            instagram: null,
                            snapchat: null,
                            youtube: null,
                            youtube_url: null,
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
                            twitch_desktop: null,
                            twitch_community: null,
                            steam: null,
                            slack: null
                        },
                        features: {
                            trophies: true,
                            player: true,
                            profiles: true,
                            videos: true,
                            teams: true,
                            discussions: true,
                            contact: true,
                            requests: true,
                            reddit: true,
                            discord: true,
                            social_media: true,
                            communities: true
                        },
                        notifications: {
                            twitch: true,
                            reddit: true,
                            discord: true
                        },
                        approval: {
                            status: "incomplete",
                            timestamp: null,
                            moderator: null,
                            rejection_reason: null,
                            comment: null
                        },
                        created_at: Date.now(),
                        updated_at: Date.now()
                    }, function(err, result) {
                        // Handle Database Connection Failure
                        if (err) {
                            res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                        }
                        else {
                            // Send Result
                            res.send({ status: 200 });
                        }
                    });
                }
            }
        });
    }
    else {
        res.send({ status: 403 });
    }
});

// Handle Route: /profile/save
router.post("/save", function(req, res, next) {
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

            // Check if Clip is Included
            if (req.body.clip) {
                // Check for Valid Clip URL
                if (req.body.clip.indexOf("https://clips.twitch.tv/") > -1 || req.body.clip.indexOf("http://clips.twitch.tv/") > -1) {
                    // Get Twitch API Data
                    helpers.twitchHelix.getClip(req.body.clip.replace("https://clips.twitch.tv/", "").replace("http://clips.twitch.tv/", "")).then(function(api) {
                        // Check if User owns Clip
                        if (api && api.data && api.data[0] && api.data[0].broadcaster_id == req.session.loggedin.twitch_id) {
                            // Check for Errors
                            if (errors.length === 0) {
                                // Set New Approval Status of Profile
                                var status = "incomplete";
                                if (!req.session.creating) {
                                    status = "pending";
                                }
                                // Update User's Profile Record
                                req.db.collection("profiles").updateOne({
                                    twitch_id: req.session.loggedin.twitch_id
                                }, {
                                    $set: {
                                        "overview.introduction": req.body.introduction,
                                        "overview.clip": req.body.clip,
                                        "overview.tags": req.body.tags,
                                        "approval.status": status,
                                        updated_at: Date.now()
                                    }
                                }, function(err, result) {
                                    // Handle Database Connection Errors
                                    if (err) {
                                        res.send({ status: 500 });
                                    }
                                    else {
                                        // Send Result
                                        res.send({ status: 200 });
                                    }
                                });
                            }
                            else {
                                res.send({ status: 400, errors: errors });
                            }
                        }
                        else {
                            // Add Error Reason
                            errors.push("clip");
                            res.send({ status: 400, errors: errors });
                        }
                    });
                }
                else {
                    // Add Error Reason
                    errors.push("clip");
                    res.send({ status: 400, errors: errors });
                }
            }
            else {
                // Check for Errors
                if (errors.length === 0) {
                    // Set New Approval Status of Profile
                    var status = "incomplete";
                    if (!req.session.creating) {
                        status = "pending";
                    }
                    // Update User's Profile Record
                    req.db.collection("profiles").updateOne({
                        twitch_id: req.session.loggedin.twitch_id
                    }, {
                        $set: {
                            "overview.introduction": req.body.introduction,
                            "overview.clip": req.body.clip,
                            "overview.tags": req.body.tags,
                            "approval.status": status,
                            updated_at: Date.now()
                        }
                    }, function(err, result) {
                        // Handle Database Connection Errors
                        if (err) {
                            res.send({ status: 500 });
                        }
                        else {
                            // Send Result
                            res.send({ status: 200 });
                        }
                    });
                }
                else {
                    res.send({ status: 400, errors: errors });
                }
            }
        }
        else if (req.body.page == "body") {
            // Begin Error Validation
            var errors = [];

            // Check About Me Length
            if (!req.body.about || req.body.about.length < 100) {
                errors.push("about");
            }

            // Check My Goals Length
            if (!req.body.goals || req.body.goals.length < 100) {
                errors.push("goals");
            }

            // Check My Experiences Length
            if (!req.body.experiences || req.body.experiences.length < 100) {
                errors.push("experiences");
            }

            // Check My Background Length
            if (!req.body.background || req.body.background.length < 100) {
                errors.push("background");
            }

            // Check for Other Section
            if (!req.body.other || req.body.other.length === 0) {
                req.body.other = null;
            }

            // Check for Categories
            if (!req.body.categories || Object.values(req.body.categories).indexOf("true") === -1) {
                errors.push("categories");
            }
            else {
                // Convert Categories to Boolean
                req.body.categories.gaming = (req.body.categories.gaming == "true");
                req.body.categories.creative = (req.body.categories.creative == "true");
                req.body.categories.socialeating = (req.body.categories.socialeating == "true");
                req.body.categories.irl = (req.body.categories.irl == "true");
                req.body.categories.talkshow = (req.body.categories.talkshow == "true");
                req.body.categories.music = (req.body.categories.music == "true");
                req.body.categories.artist = (req.body.categories.artist == "true");
                req.body.categories.communitymanager = (req.body.categories.communitymanager == "true");
                req.body.categories.developer = (req.body.categories.developer == "true");
                req.body.categories.editor = (req.body.categories.editor == "true");
                req.body.categories.moderator = (req.body.categories.moderator == "true");
                req.body.categories.viewer = (req.body.categories.viewer == "true");
            }

            // Check for Errors
            if (errors.length === 0) {
                // Set New Approval Status of Profile
                var status = "incomplete";
                if (!req.session.creating) {
                    status = "pending";
                }
                // Update User's Profile Record
                req.db.collection("profiles").updateOne({
                    twitch_id: req.session.loggedin.twitch_id
                }, {
                    $set: {
                        "body.categories.gaming": req.body.categories.gaming,
                        "body.categories.creative": req.body.categories.creative,
                        "body.categories.socialeating": req.body.categories.socialeating,
                        "body.categories.irl": req.body.categories.irl,
                        "body.categories.talkshow": req.body.categories.talkshow,
                        "body.categories.music": req.body.categories.music,
                        "body.categories.artist": req.body.categories.artist,
                        "body.categories.communitymanager": req.body.categories.communitymanager,
                        "body.categories.developer": req.body.categories.developer,
                        "body.categories.editor": req.body.categories.editor,
                        "body.categories.moderator": req.body.categories.moderator,
                        "body.categories.viewer": req.body.categories.viewer,
                        "body.about": req.body.about,
                        "body.goals": req.body.goals,
                        "body.experiences": req.body.experiences,
                        "body.background": req.body.background,
                        "body.other": req.body.other,
                        "approval.status": status,
                        updated_at: Date.now()
                    }
                }, function(err, result) {
                    // Handle Database Connection Failures
                    if (err) {
                        res.send({ status: 500 });
                    }
                    else {
                        // Send Result
                        res.send({ status: 200 });
                    }
                });
            }
            else {
                res.send({ status: 400, errors: errors });
            }
        }
        else if (req.body.page == "socialmedia") {
            // Check for Facebook
            if (!req.body.facebook || (req.body.facebook_url.indexOf("http://")  === -1 && req.body.facebook_url.indexOf("https://")  === -1) || req.body.facebook_url.indexOf("facebook.com/") === -1) {
                req.body.facebook = null;
            }

            // Check for Facebook URL
            if (!req.body.facebook_url || (req.body.facebook_url.indexOf("http://")  === -1 && req.body.facebook_url.indexOf("https://")  === -1) || req.body.facebook_url.indexOf("facebook.com/") === -1) {
                req.body.facebook_url = null;
            }

            // Check for Twitter
            if (!req.body.twitter) {
                req.body.twitter = null;
            }

            // Check for Instagram
            if (!req.body.instagram) {
                req.body.instagram = null;
            }

            // Check for YouTube
            if (!req.body.youtube || (req.body.youtube_url.indexOf("http://")  === -1 && req.body.youtube_url.indexOf("https://")  === -1) || req.body.youtube_url.indexOf("youtube.com/") === -1) {
                req.body.youtube = null;
            }

            // Check for YouTube URL
            if (!req.body.youtube_url || (req.body.youtube_url.indexOf("http://")  === -1 && req.body.youtube_url.indexOf("https://")  === -1) || req.body.youtube_url.indexOf("youtube.com/") === -1) {
                req.body.youtube_url = null;
            }

            // Check for Snapchat
            if (!req.body.snapchat) {
                req.body.snapchat = null;
            }

            // Check for Steam
            if (!req.body.steam) {
                req.body.steam = null;
            }

            // Check for GitHub
            if (!req.body.github) {
                req.body.github = null;
            }

            // Check for Deviantart
            if (!req.body.deviantart) {
                req.body.deviantart = null;
            }

            // Check for Soundcloud
            if (!req.body.soundcloud) {
                req.body.soundcloud = null;
            }

            // Check for Google+
            if (!req.body.googleplus) {
                req.body.googleplus = null;
            }

            // Check for LinkedIn
            if (!req.body.linkedin) {
                req.body.linkedin = null;
            }

            // Check for Tumblr
            if (!req.body.tumblr) {
                req.body.tumblr = null;
            }

            // Check for LinkedIn
            if (!req.body.patreon) {
                req.body.patreon = null;
            }

            // Check for AskFM
            if (!req.body.askfm) {
                req.body.askfm = null;
            }

            // Check for Missing Facebook Data
            if ((req.body.facebook && !req.body.facebook_url) || (!req.body.facebook && req.body.facebook_url)) {
                req.body.facebook = null;
                req.body.facebook_url = null;
            }

            // Check for Missing YouTube Data
            if ((req.body.youtube && !req.body.youtube_url) || (!req.body.youtube && req.body.youtube_url)) {
                req.body.youtube = null;
                req.body.youtube_url = null;
            }

            // Remove Page from Request Body
            delete req.body.page;

            // Update User's Profile Record
            req.db.collection("profiles").updateOne({
                twitch_id: req.session.loggedin.twitch_id
            }, {
                $set: {
                    social_media: req.body,
                    updated_at: Date.now()
                }
            }, function(err, result) {
                // Handle Database Connection Failures
                if (err) {
                    res.send({ status: 500 });
                }
                else {
                    // Send Result
                    res.send({ status: 200 });
                }
            });
        }
        else if (req.body.page == "communities") {
            // Check for Twitch Desktop Server Invite
            if (!req.body.twitch_desktop || (req.body.twitch_desktop.indexOf("http://")  === -1 && req.body.twitch_desktop.indexOf("https://")  === -1) || req.body.twitch_desktop.indexOf("invite.twitch.tv/") === -1) {
                req.body.twitch_desktop = null;
            }

            // Check for Twitch Community
            if (!req.body.twitch_community || (req.body.twitch_community.indexOf("http://")  === -1 && req.body.twitch_community.indexOf("https://")  === -1) || req.body.twitch_community.indexOf("twitch.tv/communities/") === -1) {
                req.body.twitch_community = null;
            }

            // Check for Subreddit
            if (!req.body.subreddit || (req.body.subreddit.indexOf("http://")  === -1 && req.body.subreddit.indexOf("https://")  === -1) || req.body.subreddit.indexOf("reddit.com/r/") === -1) {
                req.body.subreddit = null;
            }

            // Check for Discord Server Invite
            if (!req.body.discord || (req.body.discord.indexOf("http://")  === -1 && req.body.discord.indexOf("https://")  === -1) || req.body.discord.indexOf("discord.gg/") === -1) {
                req.body.discord = null;
            }

            // Check for Slack Server Invite
            if (!req.body.slack || (req.body.slack.indexOf("http://")  === -1 && req.body.slack.indexOf("https://")  === -1) || req.body.slack.indexOf("join.slack.com/") === -1) {
                req.body.slack = null;
            }

            // Check for Steam Group Invite
            if (!req.body.steam || (req.body.steam.indexOf("http://")  === -1 && req.body.steam.indexOf("https://")  === -1) || req.body.steam.indexOf("steamcommunity.com/groups/") === -1) {
                req.body.steam = null;
            }

            // Remove Page from Request Body
            delete req.body.page;

            // Update Database
            req.db.collection("profiles").updateOne({
                twitch_id: req.session.loggedin.twitch_id
            }, {
                $set: {
                    communities: req.body,
                    updated_at: Date.now()
                }
            }, function(err, result) {
                // Handle Database Connection Failures
                if (err) {
                    res.send({ status: 500 });
                }
                else {
                    // Send Result
                    res.send({ status: 200 });
                }
            });
        }
        else if (req.body.page == "features") {
            // Convert all Data to Boolean
            req.body.trophies = (req.body.trophies == "true");
            req.body.player = (req.body.player == "true");
            req.body.videos = (req.body.videos == "true");
            req.body.requests = (req.body.requests == "true");
            req.body.reddit = (req.body.reddit == "true");
            req.body.discord = (req.body.discord == "true");
            req.body.social_media = (req.body.social_media == "true");
            req.body.communities = (req.body.communities == "true");
            req.body.teams = (req.body.teams == "true");
            req.body.profiles = (req.body.profiles == "true");
            req.body.discussions = (req.body.discussions == "true");
            req.body.contact = (req.body.contact == "true");
            req.body.notifications.twitch = (req.body.notifications.twitch == "true");
            req.body.notifications.reddit = (req.body.notifications.reddit == "true");
            req.body.notifications.discord = (req.body.notifications.discord == "true");
            
            // Remove Page from Request Body
            delete req.body.page;

            // Store Notifications Settings Separately
            var notifications = req.body.notifications;

            // Remove Notifications from Request Body
            delete req.body.notifications;

            // Update User's Profile Record
            req.db.collection("profiles").updateOne({
                twitch_id: req.session.loggedin.twitch_id
            }, {
                $set: {
                    features: req.body,
                    notifications: notifications,
                    updated_at: Date.now()
                }
            }, function(err, result) {
                // Handle Database Connection Failures
                if (err) {
                    res.send({ status: 500 });
                }
                else {
                    // Send Result
                    res.send({ status: 200 });
                }
            });
        }
        else if (req.body.page == "confirmation") {
            // Update User's Profile Record
            req.db.collection("profiles").updateOne({
                twitch_id: req.session.loggedin.twitch_id
            }, {
                $set: {
                    "approval.status": "pending",
                    updated_at: Date.now()
                }
            }, function(err, result) {
                // Handle Database Connection Failures
                if (err) {
                    res.send({ status: 500 });
                }
                else {
                    // Send Result
                    res.send({ status: 200 });
                }
            });
        }
        else {
            res.send({ status: 400 });
        }
    }
    else {
        res.send({ status: 403 });
    }
});

module.exports = router;