var cron = require('node-cron'),
    config = require('../config'),
    helpers = require('../helpers'),
    db = require('../db');

var task = cron.schedule('0 */5 * * * *', function() {
	db.cache.clear().then(function() {
    db.users.getByStatus("approved").then(function(data) {
      var users = data.map(function(x) { return x.twitch_id }),
          results = [];
  		while (users.length > 0) {
  			results.push(users.splice(0, 100));
  		}
      results.forEach(function(user) {
        user = user.join(",");
  			Promise.all([helpers.twitch.getStreams(user), helpers.twitch.getHosting(user)]).then(function(streams) {
          streams[0].streams.forEach(function(stream) {
            db.cache.addStream(stream.channel._id, stream).then(function() {
              var community = false;
              for (var i in stream.community_ids) {
                if (stream.community_ids[i] == config.twitch.community) {
                  community = true;
                }
              }
              if (community === true) {
                if (stream.stream_type == "live") {
                  db.users.getByTwitchId(stream.channel._id.toString()).then(function(user) {
                    user.transactions.push({
                      timestamp: Date.now(),
                      title: "Streaming to the Community",
                      type: "Streaming to the Community",
                      old: parseFloat(user.balance),
                      new: parseFloat((parseFloat(user.balance) + 0.05).toFixed(2)),
                      difference: 0.05,
                      description: null
                    });
                    user.balance = parseFloat((parseFloat(user.balance) + 0.05).toFixed(2));
                    Promise.all([helpers.reddit.setFlair(user, null), helpers.discord.setRole(user)]).then(function(response) {
                      db.users.editByTwitchId(user.twitch_id, user);
                    });
                  });
                }
              }
            });
          });
          streams[1].hosts.forEach(function(host) {
            if (host.target_id) {
              db.cache.addHost(host.host_id, {
                id: host.target_id,
                name: host.target_display_name,
                username: host.target_login
              });
            }
          });
  			});
  		})
    });
  });
});
