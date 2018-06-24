// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /dashboard
router.get("/", function(req, res, next) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // TODO: CHANGE THIS TO /PREFERENCES ONCE THE PAGE IS DONE
        res.redirect("/dashboard/account/link/");
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /dashboard/:category/:page
router.get("/:category/:page", function(req, res, next) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Search for User
        req.db.collection("users").findOne({
            "twitch_id": req.session.loggedin.twitch_id
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                // Send Result
                res.render("dashboard", { title: "Dashboard", category: req.params.category, page: req.params.page });
            }
        })
    }
    else {
        // Send User to Login
        res.redirect("/auth/redirect/twitch");
    }
});

// Handle Route: /dashboard/content/account/link
router.post("/content/account/link", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Search for User
        req.db.collection("users").findOne({
            "twitch_id": req.session.loggedin.twitch_id
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                // Send Result
                res.render("dashboard\\account\\link", { user: result });
            }
        });
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/account/schedule
router.post("/content/account/schedule", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("error_partial", { code: "418" });
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/account/preferences
router.post("/content/account/preferences", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("error_partial", { code: "418" });
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/profiles/bookmarks
router.post("/content/profiles/bookmarks", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("dashboard\\profiles\\bookmarks");
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/profiles/ratings
router.post("/content/profiles/ratings", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("dashboard\\profiles\\ratings");
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/get/profiles
router.post("/get/profiles", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        // Check That Request is Valid
        if ((req.body.type == "bookmarks" || req.body.type == "ratings") && req.body.after && !isNaN(parseInt(req.body.after))) {
            // Search for Records
            req.db.collection(req.body.type).find({
                "from_user": req.session.loggedin.twitch_id
            }, {
                limit: 100,
                skip: parseInt(req.body.after)
            }, function(err, result) {
                // Handle Database Connection Failure
                if (err) {
                    res.render("error_partial", { code: "500", message: "The server could not contact the database. Please try again." });
                }
                else {
                    // Check if Result Exists
                    if (result) {
                        // Convert Result Cursor to Array
                        result.toArray().then(function(results) {
                            // Get IDs of Users
                            var ids = "?id=" + results[0].to_user;
                            for (var id of results) {
                                ids += "&id=" + id.to_user
                            }
                            // Get Twitch API Data
                            helpers.twitchHelix.getUsers(ids).then(function(api) {
                                // Group API & Ratings (Where Appropriate)
                                var data = [];
                                for (var result of results) {
                                    if (req.body.type == "bookmarks") {
                                        data.push({
                                            api: api.data[api.data.map(function(x) { return x.id; }).indexOf(result.to_user)]
                                        });
                                    }
                                    else {
                                        data.push({
                                            api: api.data[api.data.map(function(x) { return x.id; }).indexOf(result.to_user)],
                                            ratings: result
                                        });
                                    }
                                }
                                // Send Result
                                if (req.body.type == "bookmarks") {
                                    res.render("dashboard\\profiles\\bookmarks_partial", { bookmarks: data });
                                }
                                else {
                                    res.render("dashboard\\profiles\\ratings_partial", { ratings: data });
                                }
                            });
                        });
                    }
                    else {
                        res.render("error_partial", { message: "You do not have any " + req.body.type + "." });
                    }
                }
            });
        }
        else {
            res.render("error_partial", { code: "400", message: "The request was invalid." });
        }
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/twoos/nominations
router.post("/content/twoos/nominations", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("error_partial", { code: "418" });
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/twoos/submissions
router.post("/content/twoos/submissions", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("error_partial", { code: "418" });
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/twoos/transactions
router.post("/content/twoos/transactions", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("error_partial", { code: "418" });
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/requests/view
router.post("/content/requests/view", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("error_partial", { code: "418" });
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

// Handle Route: /dashboard/content/requests/submit
router.post("/content/requests/submit", function(req, res) {
    // Check That User is Logged In
    if (req.session.loggedin) {
        res.render("error_partial", { code: "418" });
    }
    else {
        res.render("error_partial", { code: "403", message: "You do not appear to be logged in." });
    }
});

module.exports = router;