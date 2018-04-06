// Modules
var express = require('express'),
    config = require('./config'),
    helpers = require('./helpers'),
    db = require('./db'),
    bodyParser = require('body-parser'),
    app = express(),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    swig = require('swig');

// Handle All Routes
require('./routes')(app);

// Run Server
var server = app.listen(config.app.port, function() {
    console.log('[SERVER] Listening on: ' + config.app.port);
});