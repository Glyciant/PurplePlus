// Modules
var express = require("express"),
    config = require("../../config"),
    restler = require("restler"),
    router = express.Router();

// Handle Route: /auth/logout
router.get("/", function(req, res, next) {
    // Destroy Session Data
    req.session.destroy();
    // Redirect to Landing Page
    res.redirect("/");
});

module.exports = router;