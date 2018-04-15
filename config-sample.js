// Define Config Object
var config = {};

// Define Config Sub-Objects
config.app = {};
config.twitch = {};
config.reddit = {};
config.discord = {};

// Define App Data
config.app.port = 8080;
config.app.base = "http://localhost:" + config.app.port;
config.app.db = "mongodb://127.0.0.1:27017/betaPurplePlus"; // MongoDB Connection String
config.app.secret = "";

// Define Twitch Authentication Data
config.twitch.auth = {};
config.twitch.auth.id = ""; // Twitch Client ID
config.twitch.auth.secret = ""; // Twitch Client Secret
config.twitch.auth.redirect = config.app.base + "/auth/login/";

// Define Reddit Authentication Data
config.reddit.auth = {};
config.reddit.auth.id = ""; // Reddit Client ID
config.reddit.auth.secret = ""; // Reddit Client Secret
config.reddit.auth.redirect = config.app.base + "/auth/link/reddit/";

// Define Discord Authentication Data
config.discord.auth = {};
config.discord.auth.id = ""; // Discord Client ID
config.discord.auth.secret = ""; // Discord Client Secret
config.discord.auth.redirect = config.app.base + "/auth/link/discord/";

// Export Config
module.exports = config;