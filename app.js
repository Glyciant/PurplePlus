// Modules
var express = require("express"),
    config = require("./config"),
    helpers = require("./helpers"),
    bodyParser = require("body-parser"),
    app = express(),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    expressMongoDB = require('express-mongo-db'),
    swig = require("swig"),
    marked = require('swig-marked');

// Express & Swig Set Up
app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "\\views\\partials");
app.use(express.static(__dirname + "\\static"));
app.use(expressMongoDB(config.app.db));
app.use(cookieParser());
app.use(session({
    secret: config.app.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view cache", false);
swig.setDefaults({
    cache: false
});
marked.useFilter(swig);
marked.useTag(swig);
marked.configure({
    gfm: false,
    tables: false,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: false,
    smartypants: false
});

// Handle Session Variables
app.get("*", function(req, res, next) {
    // Check if User is Logged In
    if (req.session.loggedin) {
        res.locals.loggedin = req.session.loggedin;
    }
    // Check if User is Creating a Profile
    res.locals.creating = req.session.creating;
    // Proceed
    next();
});

app.post("*", function(req, res, next) {
    // Check if User is Logged In
    if (req.session.loggedin) {
        res.locals.loggedin = req.session.loggedin;
    }
    // Proceed
    next();
});

// Handle All Routes
require("./routes")(app);

// Handle 404 Errors
app.get("*", function(req, res) {
    res.render("error", { title: "404 Error", code: "404", message: "That page was not found." });
});

// Run Server
var server = app.listen(config.app.port, function() {
    console.log("[SERVER] Listening on: " + config.app.port);
});