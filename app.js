// App.js Setup
var express = require('express'),
		db = require('./db'),
		config = require('./config'),
		bodyParser = require('body-parser'),
		app = express(),
		session = require('express-session'),
		cookieParser = require('cookie-parser'),
		swig = require('swig');
		marked = require('swig-marked'),
		tmi = require('tmi.js'),
		tmiOptions = {
			options: {
	        debug: true
	    },
	    connection: {
	        reconnect: true
	    },
	    identity: {
	        username: config.twitch.bot.username,
	        password: config.twitch.bot.password
	    },
	    channels: ["#" + config.twitch.bot.username.toLowerCase()]
		},
		bot = new tmi.Client(tmiOptions),
    discord = require('discord.js'),
    client = new discord.Client(),
		helpers = require('./helpers')(client, bot),
		discord = require("./modules/discord")(client);

// Import Modules
require('./modules/discord');
require('./modules/streams');
require('./modules/comments');
require('./modules/posts');
require('./modules/commissions');
require('./modules/spotlights');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/pub'));
app.use(cookieParser());
app.use(session({
  secret: "None",
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view cache', false);
swig.setDefaults({cache: false});
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

app.locals = {

};

app.get('*', function(req, res, next) {
	res.locals.nightmode = req.session.nightmode;
	if (req.session.loggedin) {
		res.locals.loggedin = req.session.loggedin;
		if (req.session.twitch) {
			res.locals.twitch = req.session.twitch;
			db.users.getByTwitchId(req.session.twitch.id).then(function(data) {
				if (data.reddit_id) {
					req.session.reddit = {};
					req.session.reddit.id = data.reddit_id;
					req.session.reddit.name = data.reddit_name;
					req.session.reddit.username = data.reddit_username;
				}
				if (data.discord_id) {
					req.session.discord = {};
					req.session.discord.id = data.discord_id;
					req.session.discord.name = data.discord_name;
					req.session.discord.username = data.discord_username;
				}
				req.session.type = data.type;
				req.session.admin = data.admin;
				req.session.bans = data.bans;
				res.locals.reddit = {};
				res.locals.reddit.id = data.reddit_id;
				res.locals.reddit.name = data.reddit_name;
				res.locals.reddit.username = data.reddit_username;
				res.locals.discord = {};
				res.locals.discord.id = data.discord_id;
				res.locals.discord.name = data.discord_name;
				res.locals.discord.username = data.discord_username;
				res.locals.type = data.type;
				res.locals.admin = data.admin;
				res.locals.bans = data.bans;
				if (data.profile && data.profile.status == "approved" && data.profile.types && (data.profile.types.streamer_gaming || data.profile.types.streamer_creative || data.profile.types.streamer_irl || data.profile.types.streamer_socialeating || data.profile.types.talkshow || data.profile.types.music)) {
					req.session.home = true;
					res.locals.home = true;
					req.session.streamer = true;
					res.locals.streamer = true;
				}
				if (data.profile && data.profile.status == "approved" && data.profile.types && data.profile.types.viewer) {
					req.session.home = true;
					res.locals.home = true;
					req.session.viewer = true;
					res.locals.viewer = true;
				}
				next();
			});
		}
	}
	else {
		next();
	}
});

require('./routes')(app);

app.post('/error/user', function(req, res) {
	db.cache.getByRandom(1).then(function(data) {
    res.send(data[0].stream);
  });
});

app.post('/missing', function(req, res) {
	res.render("missing_partial", { message: req.body.message });
});

app.post('/nightmode', function(req, res) {
	if (req.session.nightmode === true) {
		delete req.session.nightmode;
	}
	else {
		req.session.nightmode = true;
	}
	res.send({ message: "success" });
});

app.get('/todo', function(req, res) {
	res.send({
		new: [
			"Discord blacklist filters.",
			"/r/Twitch spotlight posts.",
			"Help documentation.",
			"Automatically unset staff/admin/global moderator flairs when they change job.",
		],
		edits: [
			"Change for(var x in y) to for(var a of b) for extra reliability."
		],
		bugs: [
			"Boolean values in database are saved as strings."
		]
	});
});

app.get('*', function(req, res) {
	res.render('error', { title: '404 Error', code: '404', message: 'That page was not found.' });
});

app.use(function(err, req, res, next) {
  console.log(err);
  res.render('error', { title: '500 Error', code: '500', message: 'Internal server error. No further information available.' });
});

var server = app.listen(config.app.port, function() {
	db.settings.get().then(function(data) {
		if (!data) {
			db.settings.generate({
				logs: false,
				search: true,
				verify: false
			});
		}
	});
	console.log('[DASHBOARD] Ready (' + config.app.port + ')');
});
