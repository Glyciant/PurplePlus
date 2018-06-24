// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /admin
router.get("/", function(req, res, next) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Set Default Redirect Pages & Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            res.redirect("/admin/users/manager");
        }
        else if (req.session.loggedin.user_types.site == "helper") {
            res.redirect("/admin/profiles/pending");
        }
        else {
            res.render("error", { title: "401 Error", code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /admin/pusher
router.get("/pusher", function(req, res, next) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            res.render("error", { title: "418 Error", code: "418" });
        }
        else {
            res.render("error", { title: "401 Error", code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /admin/:category/:page
router.get("/:category/:page", function(req, res, next) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("admin", { title: "Admin", category: req.params.category, page: req.params.page });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /admin/content/users/manager
router.post("/content/users/manager", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            res.render("admin\/users\/manager");
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/get/users/manager
router.post("/get/users/manager", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            // Check Request Field is Valid
            if ((req.body.field == "reddit_id" || req.body.field == "reddit_username" || req.body.field == "twitch_id" || req.body.field == "twitch_username" || req.body.field == "discord_id") && req.body.query) {
                // Create Database Search Query
                var query = {};
                query[req.body.field] = req.body.query.toLowerCase();
                // Search Database for User
                req.db.collection("users").findOne(query, function(err, result) {
                    // Store Result
                    var user = result;
                    // Handle Database Connection Failure
                    if (err) {
                        res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                    }
                    else {
                        // Check if Result Exists
                        if (result) {
                            // Update Moderation Log
                            req.db.collection("log").insertOne({
                                timestamp: Date.now(),
                                action: "user_view",
                                moderator: req.session.loggedin.twitch_id,
                                user: result.twitch_id,
                                description: "Viewed User Data"
                            }, function(err, result) {
                                // Handle Database Connection Failure
                                if (err) {
                                    res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                                }
                                else {
                                    // Send Result
                                    res.render("admin\/users\/manager_result", { user: user });
                                }
                            });
                        }
                        else {
                            res.render("error_partial", { code: "404", message: "There is no data available for that user." });
                        }
                    }
                });
            }
            else {
                res.render("error_partial", { code: "400", message: "The request was invalid." });
            } 
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to perform this action." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/submit/users/manager
router.post("/submit/users/manager", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            // Check Request Field is Valid
            if (req.body.id && req.body.balance && !isNaN(parseFloat(req.body.balance)) && req.body.user_types && (req.body.user_types.site === "user" || req.body.user_types.site === "moderator" || req.body.user_types.site === "helper") && (req.body.user_types.subreddit === "user" || req.body.user_types.subreddit === "wiki" || req.body.user_types.subreddit === "contributor" || req.body.user_types.subreddit === "bot") && req.body.bans) {
                // Search Database for User
                req.db.collection("users").findOne({
                    twitch_id: req.body.id
                }, function(err, result) {
                    // Handle Database Connection Failure
                    if (err) {
                        res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                    }
                    else {
                        // Check if Result Exists
                        if (result) {
                            // Check for Authorisation to Change Site Admin Permissions
                            if (result.user_types.admin == (req.body.user_types.admin == "true") || req.session.loggedin.user_types.admin) {
                                // Update User's Account Record
                                req.db.collection("users").updateOne({
                                    twitch_id: req.body.id
                                }, {
                                    "$set": {
                                        "user_types.site": req.body.user_types.site,
                                        "user_types.subreddit": req.body.user_types.subreddit,
                                        "balance": parseFloat(req.body.balance),
                                        "user_types.ama": (req.body.user_types.ama == "true"),
                                        "user_types.admin": (req.body.user_types.admin == "true"),
                                        "user_types.beta": (req.body.user_types.beta == "true"),
                                        "bans.profiles": (req.body.bans.profiles == "true"),
                                        "bans.twoos": (req.body.bans.twoos == "true"),
                                        "bans.requests": (req.body.bans.requests == "true")
                                    }
                                }, function(err, result) {
                                    // Handle Database Connection Failure
                                    if (err) {
                                        res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                                    }
                                    else {
                                        // Update Moderation Log
                                        req.db.collection("log").insertOne({
                                            timestamp: Date.now(),
                                            action: "user_edit",
                                            moderator: req.session.loggedin.twitch_id,
                                            user: req.body.id,
                                            description: "Edited User Data"
                                        }, function(err, result) {
                                            // Handle Database Connection Failure
                                            if (err) {
                                                res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                                            }
                                            else {
                                                // Return User to Search Page
                                                res.render("admin\/users\/manager");
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                res.render("error_partial", { code: "401", message: "You are not permitted to perform this action." });
                            }
                        }
                        else {
                            res.render("error_partial", { code: "400", message: "The request was invalid." });
                        }
                    }
                });
            }
            else {
                res.render("error_partial", { code: "400", message: "The request was invalid." });
            }
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to perform this action." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/users/query
router.post("/content/users/query", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/profiles/pending
router.post("/content/profiles/pending", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            // Get Pending Profiles
            req.db.collection("profiles").find({
                "approval.status": "pending"
            }, {
                sort: { updated_at: 1 }
            }, function(err, result) {
                // Handle Database Connection Failure
                if (err) {
                    res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                }
                else {
                    // Convert Result Cursor to Array
                    result.toArray().then(function(profiles) {
                        // Get Corresponding User Data for Each Profile
                        req.db.collection("users").find({
                            twitch_id: { "$in": profiles.map(function(x) { return x.twitch_id; })}  
                        }, function(err, result) {
                            // Handle Database Connection Failure
                            if (err) {
                                res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                            }
                            else {
                                // Convery Result Cursor to Array
                                result.toArray().then(function(users) {
                                    // Group User & Profile Data
                                    var data = [];
                                    for (var user of users) {
                                        data.push({
                                            user: user,
                                            profile: profiles[profiles.map(function(x) { return x.twitch_id; }).indexOf(user.twitch_id)]
                                        });
                                    }
                                    // Send Result
                                    res.render("admin\/profiles\/pending", { profiles: data });
                                });
                            }
                        });
                    });
                }
            });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/submit/profiles/pending/approve
router.post("/submit/profiles/pending/approve", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            // Search for Profile
            req.db.collection("profiles").findOne({
                twitch_id: req.body.id
            }, function(err, result) {
                // Handle Database Connection Failure
                if (err) {
                    res.send({ status: 500, message: "The server could not contact the database. Please try again." });
                }
                else {
                    // Check if Result Exists
                    if (result) {
                        // Update User's Profile Record
                        req.db.collection("profiles").updateOne({
                            twitch_id: req.body.id
                        }, {
                            "$set": {
                                "approval.timestamp": Date.now(),
                                "approval.status": "approved",
                                "approval.moderator": req.session.loggedin.twitch_id
                            }
                        }, function(err, result) {
                            // Handle Database Connection Failure
                            if (err) {
                                res.send({ status: 500, message: "The server could not contact the database. Please try again." });
                            }
                            else {
                                // Update Moderation Log
                                req.db.collection("log").insertOne({
                                    timestamp: Date.now(),
                                    action: "profile_approve",
                                    moderator: req.session.loggedin.twitch_id,
                                    user: req.body.id,
                                    description: "Approved Profile"
                                }, function(err, result) {
                                    // Handle Database Connection Failure
                                    if (err) {
                                        res.send({ status: 500, message: "The server could not contact the database. Please try again." });
                                    }
                                    else {
                                        // Send Result
                                        res.send({ status: 200, message: req.body.name + "'s profile has been approved." });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.send({ status: 401, message: "You are not permitted to perform this action." });
                    }
                }
            });
        }
        else {
            res.send({ status: 401, message: "You are not permitted to perform this action." });
        }
    }
    else {
        res.send({ status: 403, message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/submit/profiles/pending/reject
router.post("/submit/profiles/pending/reject", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            // Search for Profile
            req.db.collection("profiles").findOne({
                twitch_id: req.body.id
            }, function(err, result) {
                // Handle Database Connection Failure
                if (err) {
                    res.send({ status: 500, message: "The server could not contact the database. Please try again." });
                }
                else {
                    // Check if Result Exists & That Requests is Valid
                    if (result && req.body.reason) {
                        // Define Rejection Comment (Even if Null)
                        if (!req.body.comment) {
                            req.body.comment = null;
                        }
                        // Update User's Profile Record
                        req.db.collection("profiles").updateOne({
                            twitch_id: req.body.id
                        }, {
                            "$set": {
                                "approval.timestamp": Date.now(),
                                "approval.status": "rejected",
                                "approval.moderator": req.session.loggedin.twitch_id,
                                "approval.reason": req.body.reason,
                                "approval.comment": req.body.comment
                            }
                        }, function(err, result) {
                            // Handle Database Connection Failure
                            if (err) {
                                res.send({ status: 500, message: "The server could not contact the database. Please try again." });
                            }
                            else {
                                // Update Moderation Log
                                req.db.collection("log").insertOne({
                                    timestamp: Date.now(),
                                    action: "profile_reject",
                                    moderator: req.session.loggedin.twitch_id,
                                    user: req.body.id,
                                    description: "Rejected Profile (" + req.body.reason + ")"
                                }, function(err, result) {
                                    // Handle Database Connection Failure
                                    if (err) {
                                        res.send({ status: 500, message: "The server could not contact the database. Please try again." });
                                    }
                                    else {
                                        // Send Result
                                        res.send({ status: 200, message: req.body.name + "'s profile has been rejected." });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.send({ status: 401, message: "You are not permitted to perform this action." });
                    }
                }
            });
        }
        else {
            res.send({ status: 401, message: "You are not permitted to perform this action." });
        }
    }
    else {
        res.send({ status: 403, message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/profiles/manager
router.post("/content/profiles/manager", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("admin\/profiles\/manager");
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/get/profiles/manager
router.post("/get/profiles/manager", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            // Check That Requests is Valid
            if (req.body.name) {
                // Search for User
                req.db.collection("users").findOne({
                    twitch_username: req.body.name.toLowerCase()
                }, function(err, result) {
                    // Store Result
                    var user = result;
                    // Handle Database Connection Failure
                    if (err) {
                        res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                    }
                    else {
                        // Check That Result Exists
                        if (result) {
                            // Search for Profile
                            req.db.collection("profiles").findOne({
                                twitch_id: user.twitch_id
                            }, function(err, result) {
                                // Store Result
                                var profile = result;
                                // Handle Database Connection Failure
                                if (err) {
                                    res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                                }
                                else {
                                    // Check That Result Exists
                                    if (result) {
                                        // Search for Moderator
                                        req.db.collection("users").findOne({
                                            twitch_id: profile.approval.moderator
                                        }, function(err, result) {
                                            // Store Result
                                            var moderator = result;
                                            // Handle Database Connection Failure
                                            if (err) {
                                                res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                                            }
                                            else {
                                                // Update Moderation Log
                                                req.db.collection("log").insertOne({
                                                    timestamp: Date.now(),
                                                    action: "profile_view",
                                                    moderator: req.session.loggedin.twitch_id,
                                                    user: result.twitch_id,
                                                    description: "Viewed Profile Data"
                                                }, function(err, result) {
                                                    // Handle Database Connection Failure
                                                    if (err) {
                                                        res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                                                    }
                                                    else {
                                                        // Send Result
                                                        res.render("admin\/profiles\/manager_result", { user: user, profile: profile, moderator: moderator });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        res.render("error_partial", { code: "404", message: "There is no data available for that user." });
                                    }
                                }
                            });
                        }
                        else {
                            res.render("error_partial", { code: "404", message: "There is no data available for that user." });
                        }
                    }
                });
            }
            else {
                res.render("error_partial", { code: "400", message: "The request was invalid." });
            }
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to perform this action." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/submit/profiles/manager
router.post("/submit/profiles/manager", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            // Check That Request is Valid
            if (req.body.id && req.body.approval && (req.body.approval.status == "pending" || req.body.approval.status == "approved" || (req.body.approval.status == "rejected") && (req.body.approval.reason == "Lack of Content" || req.body.approval.reason == "Potentially Unsafe Links" || req.body.approval.reason == "Offensive Content" || req.body.approval.reason == "Formatting Errors" || req.body.approval.reason == "Other"))) {
                // Define Rejection Comment (Even if Null)
                if (!req.body.approval.comment || req.body.approval.status == "pending" || req.body.approval.status == "approved") {
                    req.body.approval.comment = null;
                }
                // Define Rejection Reason (Even if Null)
                if (!req.body.approval.comment || req.body.approval.status == "pending" || req.body.approval.status == "approved") {
                    req.body.approval.reason = null;
                }
                // Update Moderation Timestamp
                req.body.approval.timestamp = Date.now();
                // Update Moderator ID
                req.body.approval.moderator = req.session.loggedin.twitch_id;
                // Search for Profile
                req.db.collection("profiles").findOne({
                    twitch_id: req.body.id
                }, function(err, result) {
                    // Handle Database Connection Failure
                    if (err) {
                        res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                    }
                    else {
                        // Check if Result Exists
                        if (result) {
                            // Update User's Profile Record
                            req.db.collection("profiles").updateOne({
                                twitch_id: req.body.id
                            }, {
                                "$set": {
                                    approval: req.body.approval
                                }
                            }, function(err, result) {
                                // Handle Database Connection Failure
                                if (err) {
                                    res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                                }
                                else {
                                    // Update Moderation Log
                                    req.db.collection("log").insertOne({
                                        timestamp: Date.now(),
                                        action: "user_edit",
                                        moderator: req.session.loggedin.twitch_id,
                                        user: req.body.id,
                                        description: "Edited User Data"
                                    }, function(err, result) {
                                        // Handle Database Connection Failure
                                        if (err) {
                                            res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                                        }
                                        else {
                                            // Send Result
                                            res.render("admin\/profiles\/manager");
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            res.render("error_partial", { code: "400", message: "The request was invalid." });
                        }
                    }
                });
            }
            else {
                res.render("error_partial", { code: "400", message: "The request was invalid." });
            }
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to perform this action." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/twoos/nominations
router.post("/content/twoos/nominations", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/twoos/query
router.post("/content/twoos/query", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/twoos/transactions
router.post("/content/twoos/transactions", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/requests/pending
router.post("/content/requests/pending", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/requests/query
router.post("/content/requests/query", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/discord/commands
router.post("/content/discord/commands", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/discord/blacklist
router.post("/content/discord/blacklist", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That is Authorised
        if (req.session.loggedin.user_types.site == "moderator" || req.session.loggedin.user_types.site == "helper") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/administration/links
router.post("/content/administration/links", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/administration/log
router.post("/content/administration/log", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            res.render("admin\/administration\/log");
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/get/administration/log
router.post("/get/administration/log", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That is Authorised
        if (req.session.loggedin.user_types.site == "moderator") {
            // Check That Request is Valid
            if (req.body.after && !isNaN(parseInt(req.body.after))) {
                // Get Most Recent Moderation Actions
                req.db.collection("log").find({}, {
                    limit: 50,
                    skip: parseInt(req.body.after),
                    sort: { timestamp: -1 }
                }, function(err, result) {
                    // Convert Result Cursor to Array
                    result.toArray().then(function(records) {
                        // Get IDs of Moderators
                        var ids = records.map(function(x) { return x.moderator; }).concat(records.map(function(x) { return x.user; }));
                        // Search for Users & Moderators
                        req.db.collection("users").find({
                            twitch_id: {
                                "$in": ids
                            }
                        }, function(err, result) {
                            // Convert Results Cursor to Array
                            result.toArray().then(function(users) {
                                // Group Log, User & Moderator Data
                                var data = [];
                                for (var record of records) {
                                    data.push({
                                        log: record,
                                        moderator: users[users.map(function(x) { return x.twitch_id; }).indexOf(record.moderator)],
                                        user: users[users.map(function(x) { return x.twitch_id; }).indexOf(record.user)]
                                    });
                                }
                                // Send Result
                                res.render("admin\/administration\/log_partial", { records: data });
                            });
                        });
                    });
                });
            }
            else {
                res.render("error_partial", { code: "400", message: "The request was invalid." });
            }
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /admin/content/administration/settings
router.post("/content/administration/settings", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That User is Authorised
        if (req.session.loggedin.user_types.admin === true) {
            res.render("error_partial", { code: "418" });
        }
        else {
            res.render("error_partial", { code: "401", message: "You are not permitted to access this page." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

module.exports = router;