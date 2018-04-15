// Modules
var express = require("express"),
    config = require("../../config"),
    restler = require("restler"),
    router = express.Router();

// Handle Route: /auth/logout
router.get("/", function(req, res, next) {
    req.session.destroy();
    res.redirect("/browse/streams");
});

module.exports = router;