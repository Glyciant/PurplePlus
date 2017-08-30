var cron = require('node-cron'),
    restler = require('restler'),
    config = require('../config'),
    helpers = require('../helpers'),
    db = require('../db');

var task = cron.schedule('0 0 0 1 * *', function() {
  db.users.getSpotlight().then(function(profiles) {
    restler.get('https://www.reddit.com/r/Twitch/search.json?q=&restrict_sr=on&sort=top&t=month&limit=5').on("complete", function(top) {
      top = top.data.children;
      restler.get('https://www.reddit.com/r/Twitch/search.json?q=flair%3Aad&restrict_sr=on&sort=top&t=month').on("complete", function(ads) {
        ads = ads.data.children;
        restler.get('https://www.reddit.com/r/Twitch/search.json?q=flair%3Aama+OR+flair%3Aama-closed&sort=relevance&restrict_sr=on&t=month').on("complete", function(amas) {
          amas = amas.data.children;
          var submission = `Greetings /r/Twitch, [](#HeyGuys)

Welcome to this month's /r/Twitch summary! In these posts, we take some time to look back on some of the highlights of the past month on the subreddit. Without further ado, let's get started!

*****

### Top 5 Posts

These are the posts that have received the most upvotes and were posted within the past month:

`;
          var i = 1;
          for (var post of top) {
            submission = submission + i + ". [" + post.data.title + "](" + post.data.url + ") - " + post.data.link_flair_text + " by /u/" + post.data.author + " (" + post.data.score + " Votes)." + `

`;
            i++;
          }
          if (ads.length > 0) {
            submission = submission + `*****

### Advertisement Requests

We have had ` + ads.length + ` advertisement request`;
            if (ads.length !== 1) {
              submission = submission + "s";
            }
            submission = submission + ` this month. An advertisement request is a post submitted to the /r/Twitch Mod Team for approval in order to promote a third-party product or service. Check them out!

`;
            for (var post of ads) {
              submission = submission + "- [" + post.data.title + "](" + post.data.url + ") - " + " By /u/" + post.data.author + " (" + post.data.score + " Votes)." + `

`;
            }
          }
          if (amas.length > 0) {
            submission = submission + `*****

### AMAs

We have had ` + amas.length + ` AMA`;
            if (amas.length !== 1) {
              submission = submission + "s";
            }
            submission = submission + ` this month. AMAs are a great way to get involved with the community, and we'd highly recommend taking a look at them!

`;
            for (var post of amas) {
              submission = submission + "- [" + post.data.title + "](" + post.data.url + ") - " + " By /u/" + post.data.author + " (" + post.data.score + " Votes)." + `

`;
            }
          }
          if (profiles.length > 0) {
            submission = submission + `*****

### Purple+ Profiles & Twoos Spotlight

For this section, we have taken all of the approved profiles submitted to Purple+ within the past month, then chosen the top 5 Twoos leaders from that selection. Make sure to check them out!

`;
            for (var user of profiles) {
              submission = submission + `####` + user.twitch_name + `

**Twitch Channel:** https://twitch.tv/` + user.twitch_username + `

**Purple+ Profile:** https://purple.plus/user/` + user.twitch_username + `

**Twoos:** ` + user.balance + `

**Description:** ` + user.profile.overview.introduction + `

`;
            }
          }
          submission = submission + `*****

Thank you for continuing to join us on the /r/Twitch Subreddit. Your contributions are what make it such a good place. We look forward to seeing what happens next month!

\\- /r/Twitch Mod Team
`
          var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
              d = new Date();
          helpers.reddit.post("/r/Twitch Monthly Summary - " + months[d.getMonth() - 1] + "!", submission);
        });
      });
    });
  });
});
