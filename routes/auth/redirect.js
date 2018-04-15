// Modules
var express = require("express"),
    config = require("../../config"),
    router = express.Router();

// Handle Route: /auth/redirect/twitch
router.get("/twitch", function(req, res, next) {
    // Define Twitch Auth Data
    var id = config.twitch.auth.id,
        redirect = config.twitch.auth.redirect,
        scopes = "user_read",
        state = Math.floor(Math.random() * 9999999999999999999999999).toString(36).substring(0, 15);

    // Set Redirect URL
    if (req.query.return) {
        req.session.return = "/profile";
    }
    else if (!req.session.return) {
        if (req.headers.referer && req.headers.referer.indexOf(config.app.base) > -1) {
            req.session.return = req.headers.referer;
        }
        else {
            req.session.return = "/browse/streams";
        }
    }

    // Set State String
    req.session.twitch_state = state;

    // Redirect to Twitch Auth
    res.redirect("https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=" + id + "&state=" + state + "&redirect_uri=" + redirect + "&scope=" + scopes + "&force_verify=true");
});

module.exports = router;