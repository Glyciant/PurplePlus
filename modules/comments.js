var cron = require('node-cron'),
    restler = require('restler'),
    config = require('../config'),
    helpers = require('../helpers'),
    db = require('../db');

// Check Reddit API for nominations
var last_comment;
cron.schedule('*/3 * * * * *', function() {
	restler.get('https://www.reddit.com/' + config.app.subreddit + '/comments.json?limit=1').on("complete", function(data) {
    if (data.kind) {
  		if (last_comment != data.data.children[0].data.id) {
  			last_comment = data.data.children[0].data.id;
  			if (data.data.children[0].data.body.split(" ")[0] == "!nominate" || data.data.children[0].data.body.split("\n")[0] == "!nominate") {
          db.users.getByRedditUsername(data.data.children[0].data.author.toLowerCase()).then(function(nominator_data) {
            if (nominator_data.bans && nominator_data.bans.nominations === true) {
              return;
            }
            var parent = data.data.children[0].data.link_url.toString() + data.data.children[0].data.parent_id.replace("t1_", "").replace("t3_", "").toString() + ".json",
                url,
                user;
  					restler.get(parent).on("complete", function(parent) {
              if (data.data.children[0].data.parent_id.includes("t1_")) {
                user = parent[1].data.children[0].data.author;
              }
              else {
                user = parent[0].data.children[0].data.author;
              }
              db.users.getByRedditUsername(user.toLowerCase()).then(function(user) {
                if (user && user.reddit_name) {
                  if (user.reddit_name !== data.data.children[0].data.author) {
                    if (data.data.children[0].data.parent_id.includes("t1_")) {
                      url = data.data.children[0].data.link_permalink + parent[1].data.children[0].data.id;
                    }
                    else {
                      url = parent[0].data.children[0].data.url;
                    }
                    var nomination = {
                      nominator_name: data.data.children[0].data.author,
                      nomination_id: Date.now(),
                      nomination_url: url,
                      status: "pending"
                    }
                    if (!user.nominations) {
                      user.nominations = [];
                    }
                    if (user.nominations.map(function(x) { return x.nomination_url }).indexOf(nomination.nomination_url) === -1) {
                      user.nominations.push(nomination);
                      user.transactions.push({
                        timestamp: Date.now(),
                        title: "Nomination",
                        type: "Nomination",
                        old: parseFloat(user.balance),
                        new: parseFloat((parseFloat(user.balance) + 1).toFixed(2)),
                        difference: 1,
                        description: "Nomination for " + url
                      });
                      user.balance = parseFloat((parseFloat(user.balance) + 1).toFixed(2));
                      Promise.all([helpers.reddit.setFlair(user, null), helpers.discord.setRole(user)]).then(function(response) {
                        db.users.editByRedditId(user.reddit_id, user).then(function() {
                          user = nominator_data;
                          if (user && user.reddit_name) {
                            user.transactions.push({
                              timestamp: Date.now(),
                              title: "Nominating Submission",
                              type: "Nominating Submission",
                              old: parseFloat(user.balance),
                              new: parseFloat((parseFloat(user.balance) + 0.1).toFixed(2)),
                              difference: 0.1,
                              description: "Nominating " + url
                            });
                            user.balance = parseFloat((parseFloat(user.balance) + 0.1).toFixed(2));
                            Promise.all([helpers.reddit.setFlair(user, null), helpers.discord.setRole(user)]).then(function(response) {
                              db.users.editByRedditId(user.reddit_id, user);
                            });
                          }
                        });
                      });
                    }
                  }
                }
              });
              if (data.data.children[0].data.parent_id.includes("t3_")) {
                if (parent[0].data.children[0].data.link_flair_css_class == "question") {
  								helpers.reddit.setLinkFlair("t3_" + parent[0].data.children[0].data.id, "question-resolved", "Question [Resolved]");
  							}
  							if (parent[0].data.children[0].data.link_flair_css_class == "techsupport") {
  								helpers.reddit.setLinkFlair("t3_" + parent[0].data.children[0].data.id, "techsupport-resolved", "Tech Support [Resolved]");
  							}
              }
            });
          });
        }
  		}
    }
	});
});
