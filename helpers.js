var config = require('./config'),
    db = require('./db'),
    restler = require('restler');

module.exports = function(client, bot) {
  var twitch = {
    getIdByUsername: function(username) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/users?login=' + username + '&client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getChannelById: function(id) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/channels/' + id + '?client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getChannelEventsById: function(id) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/channels/' + id + '/events?client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getChannelTeamsById: function(id) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/channels/' + id + '/teams?client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getChannelVideosById: function(id) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/channels/' + id + '/videos?limit=3&client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getStreamById: function(id) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/streams/' + id + '?client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getCommunityById: function(id) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/communities/' + id + '?client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getStreams: function(ids) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/streams/?channel=' + ids + '&client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getClipBySlug: function(slug) {
      return new Promise(function(resolve, reject) {
        restler.get('https://api.twitch.tv/kraken/clips/' + slug + '?client_id=' + config.twitch.auth.id, {
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json'
          }
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getModeratedChannels: function(username) {
      return new Promise(function(resolve, reject) {
        restler.get('https://twitchstuff.3v.fi/modlookup/api/user/' + username + '?limit=1').on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getHosting: function(ids) {
      return new Promise(function(resolve, reject) {
        restler.get('https://tmi.twitch.tv/hosts?include_logins=1&host=' + ids).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    whisper: function(username, message) {
      return new Promise(function(resolve, reject) {
        bot.whisper(username, message).then(function() {
          resolve("success");
        });
      });
    }
  }

  var legacy = {
    getBalance: function(username) {
      return new Promise(function(resolve, reject) {
        restler.get('http://twoos.twitchdb.tv/api/balance/' + username).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getRequests: function(id) {
      return new Promise(function(resolve, reject) {
        restler.get('https://requests-preview.cactus.lol/api/requests/r/' + id + "?api_token=" + config.legacy.requests.token, {
          "Accept": "application/json"
        }).on('complete', function(data) {
          resolve(data);
        });
      });
    },
    getIntro: function(id) {
      return new Promise(function(resolve, reject) {
        restler.get('http://twitchdb.tv/twoos?id=' + id).on('complete', function(data) {
          resolve(data);
        });
      });
    }
  }

  var reddit = {
    setFlair: function(user, text) {
      return new Promise(function(resolve, reject) {
        if (user && user.reddit_id) {
          restler.post('https://www.reddit.com/api/v1/access_token', {
            username: config.reddit.bot.id,
            password: config.reddit.bot.secret,
            data: {
              grant_type: "password",
              username: config.reddit.bot.username,
              password: config.reddit.bot.password,
            }
          }).on("complete", function(data) {
            restler.get('https://oauth.reddit.com/r/Twitch/api/flairlist.json?name=' + user.reddit_name, {
              accessToken: data.access_token
            }).on("complete", function(api) {
              if (api.users && api.users[0].user.toLowerCase() == user.reddit_name.toLowerCase()) {
                var flair = {
                  api_type: "json",
                  css_class: "",
                  name: user.reddit_name,
                  text: api.users[0].flair_text
                };
                if (typeof(text) == "string") {
                  flair.text = text;
                }
                if (!flair.text) {
                  flair.text = "Twitch.tv/" + user.twitch_name;
                }
                var badges = [];
                if (user.type == "mod") {
                  badges.push("modflair");
                }
                else if (user.type == "helper") {
                  badges.push("helperflair");
                }
                if (user.display.twitch == "staff") {
                  badges.push("staffflair");
                }
                else if (user.display.twitch == "admin") {
                  badges.push("adminflair");
                }
                else if (user.display.twitch == "global_mod") {
                  badges.push("gmodflair");
                }
                if (user.display.ama === true) {
                  badges.push("amaflair");
                }
                if (user.display.subreddit == "wiki") {
                  badges.push("wikiflair");
                }
                else if (user.display.subreddit == "contributor") {
                  badges.push("contributorflair");
                }
                else if (user.display.subreddit == "bot") {
                  badges.push("botflair");
                }
                if (user.profile && user.profile.status == "approved") {
                  if (user.display.profile == "artist") {
                    badges.push("artistflair");
                  }
                  else if (user.display.profile == "communitymanager") {
                    badges.push("managerflair");
                  }
                  else if (user.display.profile == "developer") {
                    badges.push("developerflair");
                  }
                  else if (user.display.profile == "other") {
                    badges.push("introflair");
                  }
                  else if (user.display.profile == "moderator") {
                    badges.push("moderatorflair");
                  }
                  else if (user.display.profile == "streamer_creative") {
                    badges.push("creativeflair");
                  }
                  else if (user.display.profile == "streamer_gaming") {
                    badges.push("gamingflair");
                  }
                  else if (user.display.profile == "streamer_irl") {
                    badges.push("irlflair");
                  }
                  else if (user.display.profile == "streamer_music") {
                    badges.push("musicflair");
                  }
                  else if (user.display.profile == "streamer_eating") {
                    badges.push("eatingflair");
                  }
                  else if (user.display.profile == "streamer_talkshow") {
                    badges.push("talkshowflair");
                  }
                  else if (user.display.profile == "viewer") {
                    badges.push("viewerflair");
                  }
                }
                if (user.balance >= 1000) {
                  badges.push("bits-1000");
                }
                else if (user.balance >= 900) {
                  badges.push("bits-900");
                }
                else if (user.balance >= 800) {
                  badges.push("bits-800");
                }
                else if (user.balance >= 700) {
                  badges.push("bits-700");
                }
                else if (user.balance >= 600) {
                  badges.push("bits-600");
                }
                else if (user.balance >= 500) {
                  badges.push("bits-500");
                }
                else if (user.balance >= 400) {
                  badges.push("bits-400");
                }
                else if (user.balance >= 300) {
                  badges.push("bits-300");
                }
                else if (user.balance >= 200) {
                  badges.push("bits-200");
                }
                else if (user.balance >= 100) {
                  badges.push("bits-100");
                }
                else if (user.balance >= 75) {
                  badges.push("bits-75");
                }
                else if (user.balance >= 50) {
                  badges.push("bits-50");
                }
                else if (user.balance >= 25) {
                  badges.push("bits-25");
                }
                else if (user.balance >= 10) {
                  badges.push("bits-10");
                }
                else if (user.balance >= 5) {
                  badges.push("bits-5");
                }
                else if (user.balance >= 1) {
                  badges.push("bits-1");
                }
                var badges = badges.slice(0, 3),
                    css;
                if (badges.length == 1) {
                  css = badges[0];
                }
                else if (badges.length == 2) {
                  css = badges[0] + "--" + badges[1];
                }
                else if (badges.length == 3) {
                  css = badges[0] + "--" + badges[1] + "---" + badges[2];
                }
                flair.css_class = css;
                var reddit_data = {
                  api_type: "json",
                  css_class: api.users[0].flair_css_class,
                  name: api.users[0].user,
                  text: api.users[0].flair_text
                };
                if (JSON.stringify(flair) != JSON.stringify(reddit_data)) {
                  restler.post('https://oauth.reddit.com/r/Twitch/api/flair', {
                    accessToken: data.access_token,
                    data: flair
                  }).on("complete", function(result) {
                    if (result.json.errors.length === 0) {
                      resolve({ message: "success" });
                    }
                    else {
                      resolve({ message: "unknown_error" });
                    }
                  });
                }
                else {
                  resolve({ message: "success" });
                }
              }
              else {
                resolve({ message: "no_match" });
              }
            });
          });
        }
        else {
          resolve({ message: "not_found" });
        }
      });
    },
    getFlair: function(user) {
      return new Promise(function(resolve, reject) {
        if (user && user.reddit_id) {
          restler.post('https://www.reddit.com/api/v1/access_token', {
            username: config.reddit.bot.id,
            password: config.reddit.bot.secret,
            data: {
              grant_type: "password",
              username: config.reddit.bot.username,
              password: config.reddit.bot.password,
            }
          }).on("complete", function(data) {
            restler.get('https://oauth.reddit.com/r/Twitch/api/flairlist.json?name=' + user.reddit_name, {
              accessToken: data.access_token
            }).on("complete", function(api) {
              resolve({ message: "success", data: api })
            });
          });
        }
        else {
          resolve({ message: "not_found" });
        }
      });
    },
    getMacros: function() {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          restler.get('https://oauth.reddit.com/r/Twitch/wiki/toolbox', {
            accessToken: data.access_token
          }).on("complete", function(api) {
            resolve({ message: "success", data: api })
          });
        });
      });
    },
    setLinkFlair: (link, css, text) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var flair = {
            api_type: "json",
            css_class: css,
            link: link,
            text: text
          };
          restler.post('https://oauth.reddit.com/r/Twitch/api/flair', {
            accessToken: data.access_token,
            data: flair
          }).on("complete", function(result) {
            if (result.json.errors.length === 0) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    getLinkFlairs: () => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          restler.get('https://oauth.reddit.com/r/Twitch/api/link_flair', {
            accessToken: data.access_token
          }).on("complete", function(result) {
            if (result) {
  						resolve({ message: "success", data: result });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    comment: (post, comment) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var submit = {
            api_type: "json",
            text: comment,
            thing_id: post
          };
          restler.post('https://oauth.reddit.com/api/comment', {
            accessToken: data.access_token,
            data: submit
          }).on("complete", function(result) {
            if (result.json.errors.length === 0) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    delete: (submission) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var submit = {
            id: submission
          };
          restler.post('https://oauth.reddit.com/api/del', {
            accessToken: data.access_token,
            data: submit
          }).on("complete", function(result) {
            if (result === {}) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    distinguish: (submission) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var submit = {
            api_type: "json",
            id: submission,
            how: "yes"
          };
          restler.post('https://oauth.reddit.com/api/distinguish', {
            accessToken: data.access_token,
            data: submit
          }).on("complete", function(result) {
            if (result.json.errors.length === 0) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    approve: (submission) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var submit = {
            id: submission
          };
          restler.post('https://oauth.reddit.com/api/approve', {
            accessToken: data.access_token,
            data: submit
          }).on("complete", function(result) {
            if (result === {}) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    remove: (submission) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var submit = {
            id: submission,
            spam: false
          };
          restler.post('https://oauth.reddit.com/api/remove', {
            accessToken: data.access_token,
            data: submit
          }).on("complete", function(result) {
            if (result === {}) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    lock: (submission) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var submit = {
            id: submission
          };
          restler.post('https://oauth.reddit.com/api/lock', {
            accessToken: data.access_token,
            data: submit
          }).on("complete", function(result) {
            if (result === {}) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    report: (submission, reason) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var submit = {
            api_type: "json",
            thing_id: submission,
            other_reason: reason
          };
          restler.post('https://oauth.reddit.com/api/report', {
            accessToken: data.access_token,
            data: submit
          }).on("complete", function(result) {
            if (result.json.errors.length === 0) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    },
    message: (username, subject, message) => {
      return new Promise(function(resolve, reject) {
        restler.post('https://www.reddit.com/api/v1/access_token', {
          username: config.reddit.bot.id,
          password: config.reddit.bot.secret,
          data: {
            grant_type: "password",
            username: config.reddit.bot.username,
            password: config.reddit.bot.password,
          }
        }).on("complete", function(data) {
          var submit = {
            api_type: "json",
            subject: subject,
            text: message,
            to: username
          };
          restler.post('https://oauth.reddit.com/api/compose', {
            accessToken: data.access_token,
            data: submit
          }).on("complete", function(result) {
            if (result) {
  						resolve({ message: "success" });
            }
            else {
  						resolve({ message: "unknown_error" });
  					}
          });
        });
      });
    }
  }

  var discord = {
    setRole: (user) => {
      return new Promise(function(resolve, reject) {
        if (user && user.discord_id) {
          var keys = Object.keys(config.discord.bot.roles),
              exists = [];
          for (var i in keys) {
            exists.push(config.discord.bot.roles[keys[i]]);
          }
          var guild = client.guilds.get(config.discord.bot.server),
    					member = guild.members.get(user.discord_id);
          if (member) {
            var roles = [];
            if (user.type == "mod") {
              roles.push(config.discord.bot.roles["mod"]);
            }
            else if (user.type == "helper") {
              roles.push(config.discord.bot.roles["helper"]);
            }
            if (user.display.twitch == "staff") {
              roles.push(config.discord.bot.roles["staff"]);
            }
            else if (user.display.twitch == "admin") {
              roles.push(config.discord.bot.roles["admin"]);
            }
            else if (user.display.twitch == "global_mod") {
              roles.push(config.discord.bot.roles["global_mod"]);
            }
            if (user.display.subreddit == "wiki") {
              roles.push(config.discord.bot.roles["wiki"]);
            }
            else if (user.display.subreddit == "contributor") {
              roles.push(config.discord.bot.roles["contributor"]);
            }
            if (user.profile && user.profile.status == "approved") {
              roles.push(config.discord.bot.roles["user"]);
              if (user.display.profile == "artist") {
                roles.push(config.discord.bot.roles["artist"]);
              }
              else if (user.display.profile == "communitymanager") {
                roles.push(config.discord.bot.roles["communitymanager"]);
              }
              else if (user.display.profile == "developer") {
                roles.push(config.discord.bot.roles["developer"]);
              }
              else if (user.display.profile == "moderator") {
                roles.push(config.discord.bot.roles["moderator"]);
              }
              else if (user.display.profile == "streamer_creative") {
                roles.push(config.discord.bot.roles["streamer_creative"]);
              }
              else if (user.display.profile == "streamer_gaming") {
                roles.push(config.discord.bot.roles["streamer_gaming"]);
              }
              else if (user.display.profile == "streamer_irl") {
                roles.push(config.discord.bot.roles["streamer_irl"]);
              }
              else if (user.display.profile == "streamer_music") {
                roles.push(config.discord.bot.roles["streamer_music"]);
              }
              else if (user.display.profile == "streamer_eating") {
                roles.push(config.discord.bot.roles["streamer_eating"]);
              }
              else if (user.display.profile == "streamer_talkshow") {
                roles.push(config.discord.bot.roles["streamer_talkshow"]);
              }
              else if (user.display.profile == "viewer") {
                roles.push(config.discord.bot.roles["viewer"]);
              }
            }
            if (user.balance >= 1000) {
              roles.push(config.discord.bot.roles["1000"]);
            }
            else if (user.balance >= 900) {
              roles.push(config.discord.bot.roles["900"]);
            }
            else if (user.balance >= 800) {
              roles.push(config.discord.bot.roles["800"]);
            }
            else if (user.balance >= 700) {
              roles.push(config.discord.bot.roles["700"]);
            }
            else if (user.balance >= 600) {
              roles.push(config.discord.bot.roles["600"]);
            }
            else if (user.balance >= 500) {
              roles.push(config.discord.bot.roles["500"]);
            }
            else if (user.balance >= 400) {
              roles.push(config.discord.bot.roles["400"]);
            }
            else if (user.balance >= 300) {
              roles.push(config.discord.bot.roles["300"]);
            }
            else if (user.balance >= 200) {
              roles.push(config.discord.bot.roles["200"]);
            }
            else if (user.balance >= 100) {
              roles.push(config.discord.bot.roles["100"]);
            }
            else if (user.balance >= 75) {
              roles.push(config.discord.bot.roles["75"]);
            }
            else if (user.balance >= 50) {
              roles.push(config.discord.bot.roles["50"]);
            }
            else if (user.balance >= 25) {
              roles.push(config.discord.bot.roles["25"]);
            }
            else if (user.balance >= 10) {
              roles.push(config.discord.bot.roles["10"]);
            }
            else if (user.balance >= 5) {
              roles.push(config.discord.bot.roles["5"]);
            }
            else if (user.balance >= 1) {
              roles.push(config.discord.bot.roles["1"]);
            }
            var existing = member.roles.map(function(x) { return x.id }),
                match = [];
            for (var i in existing) {
              for (var j in roles) {
                if (existing[i] == roles[j]) {
                  match.push(roles[j]);
                }
              }
            }
            if (roles.sort().toString() != match.sort().toString()) {
              member.removeRoles(exists).then(function() {
                member.addRoles(roles).then(function() {
                  resolve({ message: "success" });
                }).catch(function(err) {
                  discord.setRole(user);
                });
              }).catch(function(err) {
                discord.setRole(user);
              });
            }
            else {
              resolve({ message: "success" });
            }
          }
          else {
            resolve({ message: "no_server" });
          }
        }
        else {
          resolve({ message: "not_found" });
        }
      });
    },
    inServer: (user) => {
      return new Promise(function(resolve, reject) {
        if (user && user.discord_id) {
          var guild = client.guilds.get(config.discord.bot.server),
              member = guild.members.get(user.discord_id);
          if (member) {
            resolve({ message: "success", server: true });
          }
          else {
            resolve({ message: "success", server: false });
          }
        }
        else {
          resolve({ message: "not_found" });
        }
      });
    },
    message: (id, message) => {
      return new Promise(function(resolve, reject) {
        var guild = client.guilds.get(config.discord.bot.server),
            member = guild.members.get(id);
        if (member) {
          member.createDM().then(function(channel) {
            if (channel) {
              channel.send(message);
              resolve({ message: "success" });
            }
            else {
              resolve({ message: "unknown" });
            }
          });
        }
        else {
          resolve({ message: "not_found" });
        }
      });
    },
    verify: (verify) => {
      return new Promise(function(resolve, reject) {
        var guild = client.guilds.get(config.discord.bot.server),
            role = guild.roles.get(config.discord.bot.roles["everyone"]);
        if (role) {
          if (verify) {
            role.setPermissions([ "CHANGE_NICKNAME", "READ_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "CONNECT" ]);
            resolve({ message: "success" });
          }
          else {
            role.setPermissions([ "CHANGE_NICKNAME", "READ_MESSAGES", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "CONNECT", "SPEAK", "USE_VAD" ]);
            resolve({ message: "success" });
          }
        }
        else {
          resolve({ message: "not_found" });
        }
      });
    }
  }

  module.exports = {
    twitch: twitch,
    legacy: legacy,
    reddit: reddit,
    discord: discord
  };

  client.login(config.discord.bot.token);
  bot.connect();

  return client;
}
