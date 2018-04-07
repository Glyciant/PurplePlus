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


// Express Set Up
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '\\views\\partials');
app.use(express.static(__dirname + '\\static'));
app.use(cookieParser());
app.use(session({
  secret: "None",
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view cache', false);
swig.setDefaults({
    cache: false
});

// Handle All Routes
require('./routes')(app);

// Run Server
var server = app.listen(config.app.port, function() {
    console.log('[SERVER] Listening on: ' + config.app.port);
});