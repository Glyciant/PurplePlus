var config = {};

config.app = {};
config.reddit = {};
config.twitch = {};
config.discord = {};
config.legacy = {};

config.app.port = 1000;
config.app.base = "http://localhost:" + config.app.port;

config.reddit.auth = {};
config.reddit.auth.id = "";
config.reddit.auth.secret = "";
config.reddit.auth.redirect = config.app.base + "/auth/login/reddit/";

config.reddit.bot = {};
config.reddit.bot.username = "TwitchSubreddit";
config.reddit.bot.password = '';
config.reddit.bot.id = "";
config.reddit.bot.secret = "";

config.twitch.auth = {};
config.twitch.auth.id = "";
config.twitch.auth.secret = "";
config.twitch.auth.redirect = config.app.base + "/auth/login/twitch/";

config.twitch.bot = {};
config.twitch.bot.username = "TwitchSubreddit";
config.twitch.bot.password = "";

config.twitch.community = "7958736b-9fe4-4299-b9d7-6e07d41eb493";

config.discord.auth = {};
config.discord.auth.id = "";
config.discord.auth.secret = "";
config.discord.auth.redirect = config.app.base + "/auth/login/discord/";

config.discord.bot = {};
config.discord.bot.token = "";
config.discord.bot.server = "122111299713892354";
config.discord.bot.roles = {
  "1": "336124797190799363",
  "5": "336124896461586432",
  "10": "336125100065554443",
  "25": "336125198728429568",
  "50": "336125327111749634",
  "75": "336125426122489858",
  "100": "336125556145913857",
  "200": "336126030261649421",
  "300": "336126322835193856",
  "400": "336126664839004161",
  "500": "336126735248654346",
  "600": "336126825161818114",
  "700": "336126945635074048",
  "800": "336127021019037696",
  "900": "336127267665215493",
  "1000": "336127155782025217",
  "streamer_gaming": "336083428325851146",
  "streamer_creative": "336083821823000576",
  "streamer_socialeating": "336090340564140034",
  "streamer_irl": "336086868624146442",
  "streamer_talkshow": "336090465650606080",
  "streamer_music": "336090721360543745",
  "artist": "336091105915568129",
  "developer": "336091183816376320",
  "communitymanager": "336091347608010752",
  "moderator": "336091440461381632",
  "viewer": "336162376380448770",
  "user": "336091519998099457",
  "mod": "122114814775394306",
  "helper": "122115312026910720",
  "wiki": "336082816276234242",
  "staff": "122168349546250241",
  "admin": "122168299143430148",
  "global_mod": "122168328683782146",
  "contributor": "336159400148336641",
  "verified": "347402757214568448",
  "everyone": "122111299713892354"
}

config.legacy.requests = {};
config.legacy.requests.token = "";

module.exports = config;
