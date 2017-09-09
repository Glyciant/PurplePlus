var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    restler = require("restler"),
    router = express.Router();

// Twitch Login
router.get("/twitch/", function(req, res) {
	if (req.query.error != "access_denied") {
		if (req.query.state == req.session.twitch_state) {
			restler.post("https://api.twitch.tv/kraken/oauth2/token", {
				data: {
			    client_id: config.twitch.auth.id,
			    client_secret: config.twitch.auth.secret,
			    grant_type: "authorization_code",
			    redirect_uri: config.twitch.auth.redirect,
			    code: req.query.code
				}
		  }).on("complete", function(data) {
				restler.get("https://api.twitch.tv/kraken/user?oauth_token=" + data.access_token + "&client_id=" + config.twitch.auth.id, {
					"headers": {
						"Accept": "application/vnd.twitchtv.v5+json"
					}
				}).on("complete", function(finaldata) {
					req.session.twitch_state = "";
					req.session.twitch = {};
					req.session.twitch.id = finaldata._id;
					req.session.twitch.name = finaldata.display_name;
          req.session.twitch.username = finaldata.name;
					req.session.twitch.auth = data.access_token;
          if (req.session.return.indexOf("/auth/") > -1) {
            req.session.return = "/browse/streams/";
          }
          db.users.getByTwitchId(finaldata._id).then(function(data) {
            helpers.twitch.getChannelById(finaldata._id).then(function(channel) {
              if (!channel.broadcaster_type) {
                channel.broadcaster_type = "user";
              }
              req.session.loggedin = finaldata.display_name;
              if (!data) {
                db.users.add({
                  reddit_id: null,
                  reddit_name: null,
                  reddit_username: null,
                  twitch_id: finaldata._id,
                  twitch_name: finaldata.display_name,
                  twitch_username: finaldata.name,
                  discord_id: null,
                  discord_name: null,
                  discord_tag: null,
                  logo: finaldata.logo,
                  type: "user",
                  mature: channel.mature,
                  followers: channel.followers,
                  display: {
                    twitch: finaldata.type,
                    profile: "other",
                    subreddit: "user",
                    stream: channel.broadcaster_type
                  },
                  balance: 0,
                  last_login: Date.now(),
                  bookmarks: [],
                  notes: [],
                  transactions: []
                }).then(function() {
                  res.redirect(req.session.return);
                });
              }
              else {
                data.twitch_name = finaldata.display_name;
                data.twitch_username = finaldata.name;
                data.logo = finaldata.logo;
                data.mature = channel.mature,
                data.followers = channel.followers,
                data.last_login = Date.now();
                data.display.twitch = finaldata.type;
                data.display.stream = channel.broadcaster_type;
                Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]);
                db.users.editByTwitchId(data.twitch_id, data).then(function() {
                  res.redirect(req.session.return);
                });
              }
            });
          });
				});
			});
		}
		else {
			res.render("error", { title: "403 Error", code: "403", message: "An invalid state parameter was returned." });
		}
	}
	else {
		res.render("error", { title: "401 Error", code: "401", message: "Access to your account was denied." });
	}
});


// Reddit Login
router.get("/reddit/", function(req, res) {
	if (req.query.error != "access_denied") {
		if (req.query.state == req.session.reddit_state) {
			restler.post("https://www.reddit.com/api/v1/access_token", {
				username: config.reddit.auth.id,
				password: config.reddit.auth.secret,
				data: {
					code: req.query.code,
					grant_type: "authorization_code",
					redirect_uri: config.reddit.auth.redirect
				}
			}).on("complete", function(data) {
				restler.get("https://oauth.reddit.com/api/v1/me", {
					"headers": {
						"User-Agent": "Purple+",
						"Authorization": "bearer " + data.access_token
					}
				}).on("complete", function(finaldata) {
          db.users.getByRedditId(finaldata.id).then(function(reddit) {
            if (!reddit) {
              req.session.reddit_state = "";
              req.session.reddit = {};
              req.session.reddit.id = finaldata.id;
              req.session.reddit.name = finaldata.name;
              req.session.reddit.username = finaldata.name.toLowerCase();
              req.session.reddit.auth = data.access_token;
              if (req.session.return.indexOf("/auth/") > -1) {
                req.session.return = "/browse/streams/";
              }
              if (req.session.twitch) {
                db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
                  if (data) {
                    helpers.legacy.getBalance(finaldata.name).then(function(legacy) {
                      var balance;
                      if (legacy.status === 200) {
                        balance = legacy.balance;
                      }
                      else {
                        balance = 0;
                      }
                      data.reddit_id = finaldata.id;
                      data.reddit_name = finaldata.name;
                      data.reddit_username = finaldata.name.toLowerCase();
                      if (!data.transactions) {
                        data.transactions = [];
                      }
                      data.transactions.push({
                        timestamp: Date.now(),
                        title: "Linked Reddit Account",
                        type: "Other",
                        old: parseFloat(data.balance),
                        new: parseFloat((parseFloat(data.balance) + balance).toFixed(2)),
                        difference: parseFloat((parseFloat(data.balance) + balance).toFixed(2)) - parseFloat(data.balance),
                        description: null
                      });
                      data.balance = parseFloat((parseFloat(data.balance) + balance).toFixed(2));
                      helpers.legacy.getRequests(finaldata.id).then(function(requests) {
                        if (requests.requests && requests.requests[0]) {
                          if (!data.requests) {
                            data.requests = [];
                          }
                          for (var request of requests.requests) {
                            if (data.requests.map(function(x) { return x.legacy_id; }).indexOf(request.id) === -1) {
                              if (request.deleted_at === null) {
                                var d = new Date(request.updated_at),
                                    request = {
                                      legacy_id: request.id,
                                      timestamp: d.getTime(),
                                      status: "",
                                      data: {},
                                      upvotes: [],
                                      downvotes: [],
                                      comments: []
                                    }
                                if (request.approval_id === 0) {
                                  request.status = "pending";
                                }
                                if (request.approval_id === 1) {
                                  request.status = "approved";
                                }
                                if (request.approval_id === 2) {
                                  request.status = "rejected";
                                }
                                if (request.votes && requests.votes[0]) {
                                  for (var vote of request.votes) {
                                    if (vote.result === 1) {
                                      request.upvotes.push(vote.user_id)
                                    }
                                    else {
                                      request.downvotes.push(vote.user_id)
                                    }
                                  }
                                }
                                if (request.comments && request.comments[0]) {
                                  for (var comment of request.comments) {
                                    if (comment.deleted_at === null) {
                                      var comment = {
                                        timestamp: comment.updated_at,
                                        submitter: "Legacy Comment",
                                        comment: comment.comment
                                      };
                                      if (comment.public === 0) {
                                        comment.type = "private";
                                      }
                                      else {
                                        comment.type = "public";
                                      }
                                      request.comments.push(comment);
                                    }
                                  }
                                }
                                if (request.body) {
                                  var body = JSON.parse(request.body);
                                  if (request.type_id === 1) {
                                    request.type = "video";
                                    request.data.name = body.name;
                                    request.data.url = body.url;
                                    if (data.owner === 1) {
                                      request.data.owner = true;
                                    }
                                    else {
                                      request.data.owner = false;
                                    }
                                    request.data.description = body.description;
                                  }
                                  else if (request.type_id === 2) {
                                    request.type = "web";
                                    request.data.name = body.name;
                                    request.data.url = body.url;
                                    request.data.description = body.description;
                                    request.data.data = body.user_data;
                                    if (body.api == "1") {
                                      request.data.api = true;
                                      request.data.api_data = {};
                                      request.data.api_data.store = body.api_data;
                                      request.data.api_data.scopes = body.api_scopes;
                                      request.data.api_data.scopes_description = body.api_scopes_description;
                                    }
                                    else {
                                      request.data.api = false;
                                    }
                                    if (body.tos == "1") {
                                      request.data.tos = true;
                                      request.data.tos_url = body.tos_url;
                                    }
                                    else {
                                      request.data.tos = false;
                                    }
                                    if (body.source == "1") {
                                      request.data.source = true;
                                      request.data.source_url = body.source_url;
                                    }
                                    else {
                                      request.data.source = false;
                                    }
                                    if (body.beta == "1") {
                                      request.data.beta = true;
                                      request.data.beta_changes = body.beta_description;
                                    }
                                    else {
                                      request.data.beta = false;
                                    }
                                  }
                                  else if (request.type_id === 3) {
                                    request.type = "desktop";
                                    request.data.name = body.name;
                                    request.data.url = body.url;
                                    request.data.description = body.description;
                                    request.data.data = body.user_data;
                                    if (body.api == "1") {
                                      request.data.api = true;
                                      request.data.api_data = {};
                                      request.data.api_data.store = body.api_data;
                                      request.data.api_data.scopes = body.api_scopes;
                                      request.data.api_data.scopes_description = body.api_scopes_description;
                                    }
                                    else {
                                      request.data.api = false;
                                    }
                                    if (body.tos == "1") {
                                      request.data.tos = true;
                                      request.data.tos_url = body.tos_url;
                                    }
                                    else {
                                      request.data.tos = false;
                                    }
                                    if (body.source == "1") {
                                      request.data.source = true;
                                      request.data.source_url = body.source_url;
                                    }
                                    else {
                                      request.data.source = false;
                                    }
                                    if (body.beta == "1") {
                                      request.data.beta = true;
                                      request.data.beta_changes = body.beta_description;
                                    }
                                    else {
                                      request.data.beta = false;
                                    }
                                  }
                                  else if (request.type_id === 5) {
                                    request.type = "ama";
                                    request.data.name = body.name;
                                    request.data.product = body.product_name;
                                    if (body.permissions == "1") {
                                      request.data.permission = true;
                                    }
                                    else {
                                      request.data.permission = false;
                                    }
                                    if (body.tos == "1") {
                                      request.data.tos = true;
                                      request.data.tos_url = body.tos_url;
                                    }
                                    else {
                                      request.data.tos = false;
                                    }
                                    request.data.data = body.user_data;
                                    var d = new Date(body.date);
                                    request.data.date = d.getTime();
                                    request.data.days = body.days;
                                  }
                                  else if (request.type_id === 6) {
                                    request.type = "other";
                                    request.data.name = body.name;
                                    request.data.description = body.description;
                                  }
                                }
                              }
                              if (Object.keys(request.data).length !== 0) {
                                data.requests.push(request);
                              }
                            }
                          }
                        }
                        Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
                          db.users.editByTwitchId(data.twitch_id, data).then(function() {
                            res.redirect(req.session.return);
                          });
                        });
                      });
                    });
                  }
                  else {
                    res.render("error", { title: "400 Error", code: "400", message: "Your accounts could not be linked together." });
                  }
                });
              }
              else {
                res.render("error", { title: "400 Error", code: "400", message: "Your accounts could not be linked together." });
              }
            }
            else {
              res.render("error", { title: "403 Error", code: "403", message: "This Reddit account is already linked to another Twitch account." });
            }
          });
				});
			});
		}
		else {
			res.render("error", { title: "403 Error", code: "403", message: "An invalid state parameter was returned." });
		}
	}
	else {
		res.render("error", { title: "401 Error", code: "401", message: "Access to your account was denied." });
	}
});

// Discord Login
router.get("/discord/", function(req, res) {
	if (req.query.state == req.session.discord_state) {
		restler.post("https://discordapp.com/api/oauth2/token", {
			data: {
		    client_id: config.discord.auth.id,
		    client_secret: config.discord.auth.secret,
		    grant_type: "authorization_code",
		    redirect_uri: config.discord.auth.redirect,
		    code: req.query.code
			}
	  }).on("complete", function(data) {
			restler.get("https://discordapp.com/api/users/@me", {
				"headers": {
					"Authorization": "Bearer " + data.access_token
				}
			}).on("complete", function(finaldata) {
        db.users.getByDiscordId(finaldata.id).then(function(discord) {
          if (!discord) {
            req.session.discord_state = "";
            if (req.session.return.indexOf("/auth/") > -1) {
              req.session.return = "/browse/streams/";
            }
            if (req.session.twitch) {
              db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
                if (!data) {
                  res.render("error", { title: "400 Error", code: "400", message: "There doesn't appear to be a Reddit account connected." });
                }
                else {
                  data.discord_id = finaldata.id;
                  data.discord_name = finaldata.username;
                  data.discord_tag = finaldata.discriminator;
                  helpers.discord.inServer(data).then(function(server) {
                    if (server.server === true) {
                      if (!data.transactions) {
                        data.transactions = [];
                      }
                      data.transactions.push({
                        timestamp: Date.now(),
                        title: "Joining the Discord Server",
                        type: "Other",
                        old: parseFloat(data.balance),
                        new: parseFloat((parseFloat(data.balance) + 1).toFixed(2)),
                        difference: 1,
                        description: null
                      });
                      data.discord = true;
                      data.balance = parseFloat((parseFloat(data.balance) + 1).toFixed(2));
                      Promise.all([helpers.reddit.setFlair(data, null), helpers.discord.setRole(data)]).then(function(response) {
                        db.users.editByTwitchId(data.twitch_id, data).then(function() {
                          res.redirect(req.session.return);
                        });
                      });
                    }
                    else {
                      db.users.editByTwitchId(data.twitch_id, data).then(function() {
                        res.redirect(req.session.return);
                      });
                    }
                  });
                }
              });
            }
            else {
              res.render("error", { title: "401 Error", code: "401", message: "You do not appear to be logged in." });
            }
          }
          else {
            res.render("error", { title: "403 Error", code: "403", message: "This Discord account is already linked to another Twitch account." });
          }
        });
			});
		});
	}
	else {
		res.render("error", { title: "403 Error", code: "403", message: "An invalid state parameter was returned." });
	}
});


module.exports = router;
