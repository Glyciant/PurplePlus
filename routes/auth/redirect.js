var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

// Twitch Auth
router.get("/twitch/", function(req, res) {
	var id = config.twitch.auth.id,
			redirect = config.twitch.auth.redirect,
			scopes = "user_read",
			state = Math.floor(Math.random() * 9999999999999999999999999).toString(36).substring(0, 15);

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
	req.session.twitch_state = state;

	res.redirect("https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=" + id + "&state=" + state + "&redirect_uri=" + redirect + "&scope=" + scopes);
});

// Reddit Auth
router.get("/reddit/", function(req, res) {
	var id = config.reddit.auth.id,
			redirect = config.reddit.auth.redirect,
			scopes = "identity",
			state = Math.floor(Math.random() * 9999999999999999999999999).toString(36).substring(0, 15);

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
	req.session.reddit_state = state;

	res.redirect("https://www.reddit.com/api/v1/authorize?client_id=" + id + "&response_type=code&state=" + state + "&redirect_uri=" + redirect + "&duration=permanent&scope=" + scopes);
});

// Discord Auth
router.get("/discord/", function(req, res) {
	var id = config.discord.auth.id,
			redirect = config.discord.auth.redirect,
			scopes = "identify+guilds",
			state = Math.floor(Math.random() * 9999999999999999999999999).toString(36).substring(0, 15);

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
  req.session.discord_state = state;

	res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=" + id + "&scope=" + scopes + "&response_type=code&state=" + state);
});

module.exports = router;
