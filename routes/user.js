// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router(),
    { EmoteFetcher, EmoteParser } = require('twitch-emoticons'),
    twitchEmotes = require('twitchemotes'),
    emotes = twitchEmotes(),
    fetcher = new EmoteFetcher();
    parser = new EmoteParser(fetcher, {
        type: 'markdown',
        match: /:(.+?):/g
    });

// Cache BTTV Emotes
fetcher.fetchBTTVEmotes();

// Handle Route: /user/:username
router.get("/:username/", function(req, res, next) {
    // Get User's Account Record
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
                // Store Result
                var user = result;
                // Get User's Profile Record
                req.db.collection("profiles").findOne({
                    "twitch_id": result.twitch_id
                }, function(err, result) {
                    // Send Result
                    res.redirect("/user/" + req.params.username + "/overview/");
                });
            }
            else {
                res.render("error", { title: "404 Error", code: "404", message: "There was no profile found for " + req.params.username + "." });
            }
        }
    });
    
});

// Handle Routes: /user/:username/:page & /user/:username/:page/edit
router.get("/:username/:page/:edit*?", function(req, res, next) {
    // Get User's Account Record
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
                // Store Result
                var user = result;
                // Get User's Profile Record
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
                            // Store Result
                            var profile = result;
                            // Get Twitch API Data
                            helpers.twitchHelix.getUser(user.twitch_id).then(function(api) {
                                // Work Out Possession Prefix
                                if (api.data[0].display_name.slice(-1) == "s") {
                                    var possession = "'";
                                }
                                else {
                                    var possession = "'s";
                                }
                                // Check That Profile is Approved or That User is Authorised
                                if (result.approval.status == "approved" || (req.session.loggedin && req.session.loggedin.twitch_id == user.twitch_id) || (req.session.loggedin && req.session.loggedin.user_types.site == "moderator") || (req.session.loggedin && req.session.loggedin.user_types.site == "helper")) {
                                    // Check if User is Logged In
                                    if (req.session.loggedin) {
                                        // Get Rating for User
                                        req.db.collection("ratings").findOne({
                                            from_user: req.session.loggedin.twitch_id,
                                            to_user: user.twitch_id
                                        }, function(err, result) {
                                            // Store Result
                                            var rating = result;
                                            // Handle Database Connection Failure
                                            if (err) {
                                                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                                            }
                                            else {
                                                // Get Personal Note for User
                                                req.db.collection("notes").findOne({
                                                    from_user: req.session.loggedin.twitch_id,
                                                    to_user: user.twitch_id
                                                }, function(err, result) {
                                                    // Store Result
                                                    var note = result;
                                                    // Handle Database Connection Failure
                                                    if (err) {
                                                        res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
                                                    }
                                                    else {
                                                        // Send Result
                                                        res.render("user", { title: api.data[0].display_name + possession + " Profile", pagenav: true, user: user, profile: profile, api: api.data[0], page: req.params.page, edit: req.params.edit, rating: rating, note: note });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        // Send Result
                                        res.render("user", { title: api.data[0].display_name + possession + " Profile", pagenav: true, user: user, profile: profile, api: api.data[0], page: req.params.page, edit: req.params.edit });
                                    }
                                }
                                else if (result.approval.status == "incomplete") {
                                    res.render("error", { title: "401 Error", code: "401", message: api.data[0].display_name + possession + " profile is not complete." });
                                }
                                else {
                                    res.render("error", { title: "401 Error", code: "401", message: api.data[0].display_name + possession + " profile has not been approved." });
                                }
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
    // Get Twitch API Data
    Promise.all([helpers.twitchHelix.getUser(req.body.id), helpers.twitchKraken.getChannel(req.body.id)]).then(function(api) {
        // Get User's Profile Record
        req.db.collection("profiles").findOne({
            "twitch_id": req.body.id
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                // Add Twitch & BTTV Emotes
                result.overview.introduction = parser.parse(emotes(result.overview.introduction)).replace(/\s\"\w*\"/, "").replace(/<img src="/, "![](").replace(/" class="twitchemote" alt="(.*)" \/>/, ")");
                // Send Result
                res.render("user\/view\/overview", { overview: result.overview, api: api });
            }
        });
    });
});

// Handle Route: /user/content/body
router.post("/content/body", function(req, res) {
    // Get User's Profile Record
    req.db.collection("profiles").findOne({
        "twitch_id": req.body.id
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Add Twitch & BTTV Emotes
            result.body.about = parser.parse(emotes(result.body.about)).replace(/\s\"\w*\"/, "").replace(/<img src="/, "![](").replace(/" class="twitchemote" alt="(.*)" \/>/, ")");
            result.body.goals = parser.parse(emotes(result.body.goals)).replace(/\s\"\w*\"/, "").replace(/<img src="/, "![](").replace(/" class="twitchemote" alt="(.*)" \/>/, ")");
            result.body.experiences = parser.parse(emotes(result.body.experiences)).replace(/\s\"\w*\"/, "").replace(/<img src="/, "![](").replace(/" class="twitchemote" alt="(.*)" \/>/, ")");
            result.body.background = parser.parse(emotes(result.body.background)).replace(/\s\"\w*\"/, "").replace(/<img src="/, "![](").replace(/" class="twitchemote" alt="(.*)" \/>/, ")");
            if (result.body.other) {
                result.body.other = parser.parse(emotes(result.body.other)).replace(/\s\"\w*\"/, "").replace(/<img src="/, "![](").replace(/" class="twitchemote" alt="(.*)" \/>/, ")");
            }
            // Send Result
            res.render("user\/view\/body", { body: result.body });
        }
    });
});

// Handle Route: /user/content/trophies
router.post("/content/trophies", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/content/socialmedia
router.post("/content/socialmedia", function(req, res) {
    // Get User's Profile Record
    req.db.collection("profiles").findOne({
        "twitch_id": req.body.id
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Get User's Account Record
            req.db.collection("users").findOne({
                "twitch_id": req.body.id
            }, function(err, user) {
                // Handle Database Connection Failure
                if (err) {
                    res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                }
                else {
                    // Send Result
                    res.render("user\/view\/socialmedia", { socialmedia: result.social_media, features: result.features, user: user });
                }
            });
        }
    });
});

// Handle Route: /user/content/communities
router.post("/content/communities", function(req, res) {
    // Get User's Profile Record
    req.db.collection("profiles").findOne({
        "twitch_id": req.body.id
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Send Result
            res.render("user\/view\/communities", { communities: result.communities });
        }
    });
});

// Handle Route: /user/content/streams
router.post("/content/streams", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/content/videos
router.post("/content/videos", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/content/profiles
router.post("/content/profiles", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/content/teams
router.post("/content/teams", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/content/requests
router.post("/content/requests", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/content/form
router.post("/content/form", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/edit/features
router.post("/edit/features", function(req, res) {
    // Get User's Profile Record
    req.db.collection("profiles").findOne({
        "twitch_id": req.body.id
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Send Result
            res.render("user\/edit\/features", { profile: result });
        }
    });
});

// Handle Route: /user/edit/overview
router.post("/edit/overview", function(req, res) {
    // Get User's Profile Record
    req.db.collection("profiles").findOne({
        "twitch_id": req.body.id
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Send Result
            res.render("user\/edit\/overview", { profile: result });
        }
    });
});

// Handle Route: /user/edit/body
router.post("/edit/body", function(req, res) {
    // Get User's Profile Record
    req.db.collection("profiles").findOne({
        "twitch_id": req.body.id
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Send Result
            res.render("user\/edit\/body", { profile: result });
        }
    });
});

// Handle Route: /user/edit/socialmedia
router.post("/edit/socialmedia", function(req, res) {
    // Get User's Profile Record
    req.db.collection("profiles").findOne({
        "twitch_id": req.body.id
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Send Result
            res.render("user\/edit\/socialmedia", { profile: result });
        }
    });
});

// Handle Route: /user/edit/communities
router.post("/edit/communities", function(req, res) {
    // Get User's Profile Record
    req.db.collection("profiles").findOne({
        "twitch_id": req.body.id
    }, function(err, result) {
        // Handle Database Connection Failure
        if (err) {
            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
        }
        else {
            // Send Result
            res.render("user\/edit\/communities", { profile: result });
        }
    });
});

// Handle Route: /user/edit/streams
router.post("/edit/streams", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/edit/profiles
router.post("/edit/profiles", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/edit/teams
router.post("/edit/teams", function(req, res) {
    res.render("error_partial", { code: "418" });
});

// Handle Route: /user/interact/ratings/submit
router.post("/interact/ratings/submit", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That Request is Valid
        if (req.body.id) {
            // Check That User is Authorised
            if (req.body.id != req.session.loggedin.twitch_id) {
                // Check That Request is Valid
                if (req.body.general && !isNaN(parseInt(req.body.general)) && parseInt(req.body.general) >= 1 && parseInt(req.body.general) <= 5 && req.body.quality && !isNaN(parseInt(req.body.quality)) && parseInt(req.body.quality) >= 1 && parseInt(req.body.quality) <= 5 && req.body.humour && !isNaN(parseInt(req.body.humour)) && parseInt(req.body.humour) >= 1 && parseInt(req.body.humour) <= 5 && req.body.uniqueness && !isNaN(parseInt(req.body.uniqueness)) && parseInt(req.body.uniqueness) >= 1 && parseInt(req.body.uniqueness) <= 5) {
                    // Search for Existing Rating
                    req.db.collection("ratings").findOne({
                        from_user: req.session.loggedin.twitch_id,
                        to_user: req.body.id
                    }, function(err, result) {
                        // Handle Database Connection Failure
                        if (err) {
                            res.send({ status: 500 });
                        }
                        else {
                            // Check if Result Exists
                            if (result) {
                                // Update Rating Record
                                req.db.collection("ratings").updateOne({
                                    from_user: req.session.loggedin.twitch_id,
                                    to_user: req.body.id
                                }, {
                                    "$set": {
                                        general: parseInt(req.body.general),
                                        quality: parseInt(req.body.quality),
                                        humour: parseInt(req.body.humour),
                                        uniqueness: parseInt(req.body.uniqueness)
                                    }
                                }, function(err, result) {
                                    // Handle Database Connection Failure
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
                                // Add Rating Record
                                req.db.collection("ratings").insertOne({
                                    from_user: req.session.loggedin.twitch_id,
                                    to_user: req.body.id,
                                    general: parseInt(req.body.general),
                                    quality: parseInt(req.body.quality),
                                    humour: parseInt(req.body.humour),
                                    uniqueness: parseInt(req.body.uniqueness)
                                }, function(err, result) {
                                    // Handle Database Connection Failure
                                    if (err) {
                                        res.send({ status: 500 });
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
                    res.send({ status: 400 });
                }
            }
            else {
                res.send({ status: 401 });
            }
        }
        else {
            res.send({ status: 400 });
        }
    }
    else {
        res.send({ status: 403 });
    }
});

// Handle Route: /user/interact/ratings/delete
router.post("/interact/ratings/delete", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That Request is Valid
        if (req.body.id) {
            // Check That User is Authorised
            if (req.body.id != req.session.loggedin.twitch_id) {
                // Remove Ratings Record
                req.db.collection("ratings").deleteOne({
                    from_user: req.session.loggedin.twitch_id,
                    to_user: req.body.id
                }, function(err, result) {
                    // Handle Database Connection Failure
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
            res.send({ status: 401 });
        }
    }
    else {
        res.send({ status: 403 });
    }
});

// Handle Route: /user/interact/bookmarks
router.post("/interact/bookmarks", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That Request is Valid
        if (req.body.id) {
            // Check That User is Authorised
            if (req.body.id != req.session.loggedin.twitch_id) {
                // Search for Existing Bookmark
                req.db.collection("bookmarks").findOne({
                    from_user: req.session.loggedin.twitch_id,
                    to_user: req.body.id
                }, function(err, result) {
                    // Handle Database Connection Failure
                    if (err) {
                        res.send({ status: 500 });
                    }
                    else {
                        // Check if Result Exists
                        if (result) {
                            // Remove Bookmark Record
                            req.db.collection("bookmarks").deleteOne({
                                from_user: req.session.loggedin.twitch_id,
                                to_user: req.body.id
                            }, function(err, result) {
                                // Handle Database Connection Failure
                                if (err) {
                                    res.send({ status: 500 });
                                }
                                else {
                                    // Send Result
                                    res.send({ status: 200, message: "Your bookmark has been removed." });
                                }
                            });
                        }
                        else {
                            // Add Bookmark Record
                            req.db.collection("bookmarks").insertOne({
                                from_user: req.session.loggedin.twitch_id,
                                to_user: req.body.id
                            }, function(err, result) {
                                // Handle Database Connection Failure
                                if (err) {
                                    res.send({ status: 500 });
                                }
                                else {
                                    // Send Result
                                    res.send({ status: 200, message: "Your bookmark has been added." });
                                }
                            });
                        }
                    }
                    
                });
            }
            else {
                res.send({ status: 400 });
            }
        }
        else {
            res.send({ status: 401 });
        }
    }
    else {
        res.send({ status: 403 });
    }
});

// Handle Route: /user/interact/notes
router.post("/interact/notes", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That Request is Valid
        if (req.body.id) {
            // Check That User is Authorised
            if (req.body.id != req.session.loggedin.twitch_id) {
                // Search for Existing Note
                req.db.collection("notes").findOne({
                    from_user: req.session.loggedin.twitch_id,
                    to_user: req.body.id
                }, function(err, result) {
                    // Handle Database Connection Failure
                    if (err) {
                        res.send({ status: 500 });
                    }
                    else {
                        // Check for Existing Record
                        if (result) {
                            // Check if Request Contains New Note
                            if (!req.body.note) {
                                // Remove Note Record
                                req.db.collection("notes").deleteOne({
                                    from_user: req.session.loggedin.twitch_id,
                                    to_user: req.body.id
                                }, function(err, result) {
                                    // Handle Database Connection Failure
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
                                // Update Note Record
                                req.db.collection("notes").updateOne({
                                    from_user: req.session.loggedin.twitch_id,
                                    to_user: req.body.id
                                }, {
                                    "$set": {
                                        note: req.body.note
                                    }
                                }, function(err, result) {
                                    // Handle Database Connection Failure
                                    if (err) {
                                        res.send({ status: 500 });
                                    }
                                    else {
                                        // Send Result
                                        res.send({ status: 200 });
                                    }
                                });
                            }
                            
                        }
                        else {
                            // Add Note Record
                            req.db.collection("notes").insertOne({
                                from_user: req.session.loggedin.twitch_id,
                                to_user: req.body.id,
                                note: req.body.note
                            }, function(err, result) {
                                // Handle Database Connection Failure
                                if (err) {
                                    res.send({ status: 500 });
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
                res.send({ status: 400 });
            }
        }
        else {
            res.send({ status: 401 });
        }
    }
    else {
        res.send({ status: 403 });
    }
});

module.exports = router;