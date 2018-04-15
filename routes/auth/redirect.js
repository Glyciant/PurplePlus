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
    if (!req.session.return) {
        if (req.headers.referer && req.headers.referer.indexOf(config.app.base) > -1) {
            req.session.return = req.headers.referer;
        }
        else {
            req.session.return = "/profile/";
        }
    }

    // Set State String
    req.session.twitch_state = state;

    // Redirect to Twitch Auth
    res.redirect("https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=" + id + "&state=" + state + "&redirect_uri=" + redirect + "&scope=" + scopes + "&force_verify=true");
});

// Handle Route: /auth/redirect/reddit
router.get("/reddit", function(req, res, next) {
    // Define Reddit Auth Data
    var id = config.reddit.auth.id,
        redirect = config.reddit.auth.redirect,
        scopes = "identity",
        state = Math.floor(Math.random() * 9999999999999999999999999).toString(36).substring(0, 15);

    // Set Redirect URL
    if (!req.session.return) {
        if (req.headers.referer && req.headers.referer.indexOf(config.app.base) > -1) {
            req.session.return = req.headers.referer;
        }
        else {
            req.session.return = "/profile/";
        }
    }

    // Set State String
    req.session.reddit_state = state;

    // Redirect to Reddit Auth
    res.redirect("https://www.reddit.com/api/v1/authorize?client_id=" + id + "&response_type=code&state=" + state + "&redirect_uri=" + redirect + "&duration=permanent&scope=" + scopes);
});

// Handle Route: /auth/redirect/discord
router.get("/discord", function(req, res, next) {
    // Define Discord Auth Data
    var id = config.discord.auth.id,
        redirect = config.discord.auth.redirect,
        scopes = "identify+guilds",
        state = Math.floor(Math.random() * 9999999999999999999999999).toString(36).substring(0, 15);

    // Set Redirect URL
    if (!req.session.return) {
        if (req.headers.referer && req.headers.referer.indexOf(config.app.base) > -1) {
            req.session.return = req.headers.referer;
        }
        else {
            req.session.return = "/profile/";
        }
    }

    // Set State String
    req.session.discord_state = state;

    // Redirect to Discord Auth
    res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=" + id + "&response_type=code&state=" + state + "&redirect_uri=" + redirect + "&scope=" + scopes);
});

module.exports = router;