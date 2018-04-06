var config = {};

config.app = {};

config.app.port = 8080;
config.app.base = "http://localhost:" + config.app.port;
config.app.db = "mongodb://127.0.0.1:27017/Purple+V2"; // MongoDB Connection String

module.exports = config;