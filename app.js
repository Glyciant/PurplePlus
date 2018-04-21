// Modules
var express = require("express"),
    config = require("./config"),
    helpers = require("./helpers"),
    bodyParser = require("body-parser"),
    app = express(),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    expressMongoDB = require('express-mongo-db'),
    swig = require("swig");

// Express Set Up
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

// Handle Session Variables
app.get("*", function(req, res, next) {
    if (req.session.loggedin) {
        res.locals.loggedin = req.session.loggedin;
    }
    res.locals.creating = req.session.creating;
    next();
});

// Handle All Routes
require("./routes")(app);

// Handle 404 Errors
app.get("*", function(req, res) {
    res.status(404).render("error", { title: "404 Error", code: "404", message: "That page was not found." });
});

// Run Server
var server = app.listen(config.app.port, function() {
    console.log("[SERVER] Listening on: " + config.app.port);
});