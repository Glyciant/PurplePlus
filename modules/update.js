var cron = require('node-cron'),
    config = require('../config'),
    helpers = require('../helpers'),
    db = require('../db');

var task = cron.schedule('0 0 0 * * *', function() {
  Promise.all([db.users.updateArtCommissions(), db.users.updateDeveloperCommissions()]);

  db.users.getTwitchOfficials().then(function(data) {
    data.forEach(function(user) {
      helpers.twitch.getUserById(user.twitch_id).then(function(api) {
        if (api.type !== user.display.twitch) {
          user.display.twitch = api.type;
          Promise.all([helpers.reddit.setFlair(user, null), helpers.discord.setRole(user)]);
          db.users.editByTwitchId(user.twitch_id, user);
        }
      });
    });
  });
});
