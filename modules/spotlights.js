var cron = require('node-cron'),
    config = require('../config'),
    helpers = require('../helpers'),
    db = require('../db');

// var task = cron.schedule('0 0 0 * * *', function() {
// var task = cron.schedule('0 */1 * * * *', function() {
//   db.users.getSpotlight().then(function(data) {
//     var promises = [],
//         users = [];
//     for (var i in data) {
//       promises.push(helpers.twitch.getChannelById(data[i].twitch_id));
//     }
//     Promise.all(promises).then(function(data) {
//       for (var i in data) {
//         users.push({ username: data[i].name, logo: data[i].logo });
//       }
//       users.forEach(function(user) {
//         helpers.reddit.uploadImage(user.logo, "TEST" + user.username);
//       });
//     });
//   });
// });
