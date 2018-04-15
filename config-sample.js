// Define Config Object
var config = {};

// Define Config Sub-Objects
config.app = {};
config.twitch = {};

// Define App Data
config.app.port = 8080;
config.app.base = "http://localhost:" + config.app.port;
config.app.db = "mongodb://127.0.0.1:27017/betaPurplePlus"; // MongoDB Connection String
config.app.secret = "";

// Define Twitch Authentication Data
config.twitch.auth = {};
config.twitch.auth.id = ""; // Twitch Client ID
config.twitch.auth.secret = ""; // Twitch Client Secret
config.twitch.auth.redirect = config.app.base + "/auth/login/twitch";

// Export Config
module.exports = config;