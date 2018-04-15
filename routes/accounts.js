// Modules
var express = require("express"),
    swig = require("swig"),
    config = require("../config"),
    helpers = require("../helpers"),
    router = express.Router();

// Handle Route: /accounts/
router.get("/", function(req, res, next) {
    // Check User is Logged In
    if (req.session.loggedin) {
        req.db.collection("users").findOne({
            "twitch_id": req.session.loggedin.twitch_id
        }, function(err, result) {
            // Handle Database Connection Failure
            if (err) {
                res.render("error", { title: "500 Error", code: "500", message: "The server could not contact the database. Please try again." });
            }
            else {
                res.render("accounts", { title: "Link Accounts", user: result })
            }
        })
    }
    else {
        res.redirect("/auth/redirect/twitch")
    }
});

module.exports = router;