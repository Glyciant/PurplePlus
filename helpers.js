// Modules
var config = require("./config"),
    restler = require("restler");

// Twitch Helix Functions
var twitchHelix = {
    // Get User By ID
    getUser: function(id) {
        return new Promise(function(resolve, reject) {
            // Make Request
            restler.get("https://api.twitch.tv/helix/users?id=" + id, {
                headers: {
                    "User-Agent": "Purple+",
                    "Client-ID": config.twitch.auth.id
                }
            }).on("complete", function(api) {
                // Complete Promise
                resolve(api);
            });
        });
    },
    // Get Users by IDs
    getUsers: function(ids) {
        return new Promise(function(resolve, reject) {
            // Make Request
            restler.get("https://api.twitch.tv/helix/users" + ids, {
                headers: {
                    "User-Agent": "Purple+",
                    "Client-ID": config.twitch.auth.id
                }
            }).on("complete", function(api) {
                // Complete Promise
                resolve(api);
            });
        });
    },
    // Get Clip by Slug
    getClip: function(slug) {
        return new Promise(function(resolve, reject) {
            // Make Request
            restler.get('https://api.twitch.tv/helix/clips/?id=' + slug, {
                headers: {
                    "User-Agent": "Purple+",
                    "Client-ID": config.twitch.auth.id
                }
            }).on('complete', function(data) {
                // Complete Promise
                resolve(data);
            });
        });
    }
};

// Twitch Kraken Functions
// TODO: Remove this when Twitch Finish Helix
var twitchKraken = {
    // Get User By ID
    getChannel: function(id) {
        return new Promise(function(resolve, reject) {
            // Make Request
            restler.get("https://api.twitch.tv/kraken/channels/" + id, {
                headers: {
                    "Accept": "application/vnd.twitchtv.v5+json",
                    "User-Agent": "Purple+",
                    "Client-ID": config.twitch.auth.id
                }
            }).on("complete", function(api) {
                // Complete Promise
                resolve(api);
            });
        });
    }
}

module.exports = {
    twitchHelix: twitchHelix,
    twitchKraken: twitchKraken
};