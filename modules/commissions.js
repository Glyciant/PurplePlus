var cron = require('node-cron'),
    config = require('../config'),
    helpers = require('../helpers'),
    db = require('../db');

var task = cron.schedule('0 0 0 * * *', function() {
  Promise.all([db.users.updateArtCommissions(), db.users.updateDeveloperCommissions()]);
});
