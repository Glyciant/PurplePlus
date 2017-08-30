var cron = require('node-cron'),
    restler = require('restler'),
    config = require('../config'),
    helpers = require('../helpers'),
    distance = require('jaro-winkler'),
	  stopword = require('stopword')
    db = require('../db');

cron.schedule('*/3 * * * * *', function() {
  db.settings.get().then(function(data) {
    if (data.search === true) {
      restler.post('https://www.reddit.com/api/v1/access_token', {
        username: config.reddit.bot.id,
        password: config.reddit.bot.secret,
        data: {
          grant_type: "password",
          username: config.reddit.bot.username,
          password: config.reddit.bot.password,
        }
      }).on("complete", function(auth) {
        restler.get('https://reddit.com/r/Twitch/new.json?limit=1&after=t3_6qglzr').on("complete", function(data) {
          if (data.data && data.data.children && data.data.children[0] && data.data.children[0].data) {
            if (processed.indexOf(data.data.children[0].data.id) === -1) {
              processed.push(data.data.children[0].data.id);
              restler.get(data.data.children[0].data.url.replace("www.reddit.com", "oauth.reddit.com") + ".json", {
                accessToken: auth.access_token
              }).on("complete", function(exists) {
                if (exists && exists[1] && exists[1].data && exists[1].data && exists[1].data.children) {
                  for (var comment of exists[1].data.children) {
                    if (comment.data.author == config.reddit.bot.username) {
                      return;
                    }
                  }
                  db.users.getByRedditUsername(data.data.children[0].data.author.toLowerCase()).then(function(user) {
                    if (!user || (user.type == "user" && user.display.twitch == "user" && user.display.subreddit == "user")) {
                      var re = new RegExp(" ", "g"),
                          title = data.data.children[0].data.title.replace(re, "+");
                      restler.get('https://www.reddit.com/r/Twitch/search.json?q=' + title + '&restrict_sr=on&limit=100&sort=new&t=all').on("complete", function(search) {
                        if (search && search.data && search.data.children) {
                          var results = search.data.children,
                              j = 0,
                              posts = [];

                          for (var result of results) {
                            if (data.data.children[0].data.id != result.data.id) {
                              var difference = distance(stopword.removeStopwords(data.data.children[0].data.title.replace(/[^\w\s]/gi, '').split(" ")).join(" "), stopword.removeStopwords(result.data.title.replace(/[^\w\s]/gi, '').split(" ")).join(" "), { caseSensitive: false });
                              if (difference >= 0.75 && result.data.num_comments > 0 && result.data.selftext_html) {
                                posts.push({ title: result.data.title, link: result.data.url, distance: difference });
                              }
                            }
                          }
                          if (posts.length > 0) {
                            posts.sort(function(a, b) {
                              return parseFloat(a.distance) - parseFloat(b.distance);
                            });
                            posts.reverse();
                            posts.splice(5);
                            var comment = `Greetings ` + data.data.children[0].data.author + `,
    As part of an attempt to cut back on the number of repetitive threads on /r/Twitch, we are trying to provide a short list of posts from Reddit's search function that may help you. The search found the following results for you:
    `
                            for (var post of posts) {
                              comment = comment + `- [` + post.title + `](` + post.link + `) (` + Math.round(post.distance  * 100) +  `% Relevancy Chance)
    `
                            }
                            comment = comment + `
    We hope these links will be helpful. If so, consider deleting your post to reduce spam on the subreddit. If the suggested links are irrelvant to your question, feel free to ignore this comment and continue as you were. You may want to also upvote or downvote this comment to give the subreddit moderators an indication of how well the bot is doing!
    *I'm a bot and this action was performed automatically. [Also, we recommend looking at the /r/Twitch Wiki for answers to frequently asked questions.](https://www.reddit.com/r/Twitch/wiki/) If you have any questions or concerns, please contact the subreddit moderators via [modmail](https://www.reddit.com/message/compose?to=%2Fr%2FTwitch).*`
                            helpers.reddit.comment("t3_" + data.data.children[0].data.id, comment).then(function() {
                              restler.get('https://www.reddit.com/user/' + config.reddit.bot.username  + "/comments.json?limit=1&sort=new").on('complete', function(account) {
                                helpers.reddit.distinguish("t1_" + account.data.children[0].data.id).then(function() {
                                  helpers.reddit.report("t3_" + data.data.children[0].data.id, "Possible Repetitive Thread");
                                });
                              });
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
      });
    }
  });
});

cron.schedule('0 */10 * * * *', function() {
  restler.get('https://www.reddit.com/user/' + config.reddit.bot.username  + "/comments.json?limit=100&sort=new").on('complete', function(data) {
    if (data && data.data && data.data.children) {
      data.data.children.forEach(function(comment) {
        if (comment.data.score < -2) {
          helpers.reddit.delete("t1_" + comment.data.id);
        }
      });
    }
  });
});
