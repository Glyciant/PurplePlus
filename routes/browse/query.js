var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    url = require("url"),
    router = express.Router();

router.get("/", function(req, res, next) {
  var data = {};

  if (req.query.types) {
    types = req.query.types.split(",");
    data.types = {};
    if (types.indexOf("streamer_gaming") > -1) {
      data.types.streamer_gaming = true;
    }
    if (types.indexOf("streamer_creative") > -1) {
      data.types.streamer_creative = true;
    }
    if (types.indexOf("streamer_irl") > -1) {
      data.types.streamer_irl = true;
    }
    if (types.indexOf("streamer_socialeating") > -1) {
      data.types.streamer_socialeating = true;
    }
    if (types.indexOf("streamer_talkshow") > -1) {
      data.types.streamer_talkshow = true;
    }
    if (types.indexOf("streamer_music") > -1) {
      data.types.streamer_music = true;
    }
    if (types.indexOf("artist") > -1) {
      data.types.artist = true;
    }
    if (types.indexOf("developer") > -1) {
      data.types.developer = true;
    }
    if (types.indexOf("communitymanager") > -1) {
      data.types.communitymanager = true;
    }
    if (types.indexOf("moderator") > -1) {
      data.types.moderator = true;
    }
    if (types.indexOf("viewer") > -1) {
      data.types.viewer = true;
    }
    if (types.indexOf("other") > -1) {
      data.types.other = true;
    }
  }

  if (req.query.types_method) {
    data.types_method = req.query.types_method;
  }

  if (req.query.streamer_gaming_genres) {
    var genres = req.query.streamer_gaming_genres.split(",");
    data.streamer_gaming_genres = {};
    if (genres.indexOf("action") > -1) {
      data.streamer_gaming_genres.action = true;
    }
    if (genres.indexOf("adventure") > -1) {
      data.streamer_gaming_genres.adventure = true;
    }
    if (genres.indexOf("horror") > -1) {
      data.streamer_gaming_genres.horror = true;
    }
    if (genres.indexOf("roleplaying") > -1) {
      data.streamer_gaming_genres.roleplaying = true;
    }
    if (genres.indexOf("simulation") > -1) {
      data.streamer_gaming_genres.simulation = true;
    }
    if (genres.indexOf("strategy") > -1) {
      data.streamer_gaming_genres.strategy = true;
    }
    if (genres.indexOf("survival") > -1) {
      data.streamer_gaming_genres.survival = true;
    }
    if (genres.indexOf("other") > -1) {
      data.streamer_gaming_genres.other = true;
    }
  }

  if (req.query.streamer_gaming_genres_method) {
    data.streamer_gaming_genres_method = req.query.streamer_gaming_genres_method;
  }

  if (req.query.streamer_creative_activities) {
    var activities = req.query.streamer_creative_activities.split(",");
    data.streamer_creative_activities = {};
    if (activities.indexOf("cooking") > -1) {
      data.streamer_creative_activities.cooking = true;
    }
    if (activities.indexOf("drawing") > -1) {
      data.streamer_creative_activities.drawing = true;
    }
    if (activities.indexOf("painting") > -1) {
      data.streamer_creative_activities.painting = true;
    }
    if (activities.indexOf("programming") > -1) {
      data.streamer_creative_activities.programming = true;
    }
    if (activities.indexOf("editing") > -1) {
      data.streamer_creative_activities.editing = true;
    }
    if (activities.indexOf("other") > -1) {
      data.streamer_creative_activities.other = true;
    }
  }

  if (req.query.streamer_creative_activities_method) {
    data.streamer_creative_activities_method = req.query.streamer_creative_activities_method;
  }

  if (req.query.artist_commissions_accepts && req.query.artist_commissions_charges && req.query.artist_commissions_currently) {
    data.artist_commissions = {};
    data.artist_commissions.accepts = req.query.artist_commissions_accepts;
    data.artist_commissions.charges = req.query.artist_commissions_charges;
    data.artist_commissions.currently = req.query.artist_commissions_currently;
  }

  if (req.query.developer_commissions_accepts && req.query.developer_commissions_charges && req.query.developer_commissions_currently) {
    data.developer_commissions = {};
    data.developer_commissions.accepts = req.query.developer_commissions_accepts;
    data.developer_commissions.charges = req.query.developer_commissions_charges;
    data.developer_commissions.currently = req.query.developer_commissions_currently;
  }

  if (req.query.moderator_requests_accepts) {
    data.moderator_requests = {};
    data.moderator_requests.accepts = req.query.moderator_requests_accepts;
  }

  if (req.query.viewer_preferences) {
    var preferences = req.query.viewer_preferences.split(",");
    data.viewer_preferences = {};
    if (preferences.indexOf("action") > -1) {
      data.viewer_preferences.action = true;
    }
    if (preferences.indexOf("adventure") > -1) {
      data.viewer_preferences.adventure = true;
    }
    if (preferences.indexOf("roleplaying") > -1) {
      data.viewer_preferences.roleplaying = true;
    }
    if (preferences.indexOf("simulation") > -1) {
      data.viewer_preferences.simulation = true;
    }
    if (preferences.indexOf("strategy") > -1) {
      data.viewer_preferences.strategy = true;
    }
    if (preferences.indexOf("survival") > -1) {
      data.viewer_preferences.survival = true;
    }
    if (preferences.indexOf("horror") > -1) {
      data.viewer_preferences.horror = true;
    }
    if (preferences.indexOf("music") > -1) {
      data.viewer_preferences.music = true;
    }
    if (preferences.indexOf("cooking") > -1) {
      data.viewer_preferences.cooking = true;
    }
    if (preferences.indexOf("drawing") > -1) {
      data.viewer_preferences.drawing = true;
    }
    if (preferences.indexOf("painting") > -1) {
      data.viewer_preferences.painting = true;
    }
    if (preferences.indexOf("programming") > -1) {
      data.viewer_preferences.programming = true;
    }
    if (preferences.indexOf("editing") > -1) {
      data.viewer_preferences.editing = true;
    }
    if (preferences.indexOf("talkshow") > -1) {
      data.viewer_preferences.talkshow = true;
    }
    if (preferences.indexOf("irl") > -1) {
      data.viewer_preferences.irl = true;
    }
    if (preferences.indexOf("socialeating") > -1) {
      data.viewer_preferences.socialeating = true;
    }
  }

  if (req.query.viewer_family) {
    data.viewer_family = req.query.viewer_family;
  }

  if (req.query.viewer_preferences_method) {
    data.viewer_preferences_method = req.query.viewer_preferences_method;
  }

  if (req.query.overview_keywords) {
    data.overview_keywords = req.query.overview_keywords;
  }
  if (req.query.streamer_gaming_keywords) {
    data.streamer_gaming_keywords = req.query.streamer_gaming_keywords;
  }
  if (req.query.streamer_creative_keywords) {
    data.streamer_creative_keywords = req.query.streamer_creative_keywords;
  }
  if (req.query.streamer_irl_keywords) {
    data.streamer_irl_keywords = req.query.streamer_irl_keywords;
  }
  if (req.query.streamer_socialeating_keywords) {
    data.streamer_socialeating_keywords = req.query.streamer_socialeating_keywords;
  }
  if (req.query.streamer_talkshow_keywords) {
    data.streamer_talkshow_keywords = req.query.streamer_talkshow_keywords;
  }
  if (req.query.streamer_music_keywords) {
    data.streamer_music_keywords = req.query.streamer_music_keywords;
  }
  if (req.query.artist_keywords) {
    data.artist_keywords = req.query.artist_keywords;
  }
  if (req.query.developer_keywords) {
    data.developer_keywords = req.query.developer_keywords;
  }
  if (req.query.communitymanager_keywords) {
    data.communitymanager_keywords = req.query.communitymanager_keywords;
  }
  if (req.query.moderator_keywords) {
    data.moderator_keywords = req.query.moderator_keywords;
  }
  if (req.query.viewer_keywords) {
    data.viewer_keywords = req.query.viewer_keywords;
  }
  if (req.query.other_keywords) {
    data.other_keywords = req.query.other_keywords;
  }

  if (req.query.tags) {
    data.tags = req.query.tags;
  }
  if (req.query.tags_method) {
    data.tags_method = req.query.tags_method;
  }

  if (req.query.description) {
    data.description = req.query.description;
  }

  db.queries.getByUses().then(function(trending) {
    res.render("query", { title: "Query", data: data, trending: trending });
  });
});

router.get("/result", function(req, res, next) {
  if (req.session.query && req.session.query.done) {
    var data = req.session.query.data,
        id = req.session.query.id,
        public_query = req.session.query.public;
    delete req.session.query;
    res.render("query_result", { title: "Query Result", data: data, id: id, public: public_query });
  }
  else {
    res.redirect("/browse/query");
  }
});

router.get("/:id", function(req, res, next) {
  db.queries.getById(parseInt(req.params.id)).then(function(data) {
    if (data) {
      res.redirect(data.redirect);
    }
    else {
      res.redirect("/browse/query");
    }
  });
});

router.post("/tag", function(req, res, next) {
  if (req.body.tag) {
    var redirect = "http://localhost:1000/browse/query?types=streamer_gaming,streamer_creative,streamer_irl,streamer_socialeating,streamer_talkshow,streamer_music,artist,developer,communitymanager,moderator,viewer,other&streamer_gaming_genres=action,adventure,horror,roleplaying,simulation,strategy,survival,other&streamer_gaming_genres_method=one&streamer_creative_activities=cooking,drawing,painting,programming,editing,other&streamer_creative_activities_method=one&artist_commissions_accepts=any&artist_commissions_charges=any&artist_commissions_currently=any&developer_commissions_accepts=any&developer_commissions_charges=any&developer_commissions_currently=any&moderator_requests_accepts=any&viewer_preferences=action,adventure,roleplaying,simulation,strategy,survival,horror,music,cooking,drawing,painting,programming,editing,talkshow,irl,socialeating&streamer_viewer_preferences_method=one&tags=" + req.body.tag;
    res.send({ message: "success", redirect: redirect });
  }
  else {
    res.send({ message: "unknown" });
  }
});

router.post("/submit", function(req, res, next) {
  var query = [],
      i = [],
      overview = [],
      streamer_gaming = [],
      streamer_creative = [],
      streamer_irl = [],
      streamer_socialeating = [],
      streamer_talkshow = [],
      streamer_music = [],
      artist = [],
      developer = [],
      communitymanager = [],
      moderator = [],
      viewer = [],
      other = [],
      link = {};

  if (req.body.types) {
    link.types = [];
    if (req.body.types.streamer_gaming == "true") {
      streamer_gaming.push({ "profile.types.streamer_gaming": { $exists: true } });
      link.types.push("streamer_gaming");
    }
    if (req.body.types.streamer_creative == "true") {
      streamer_creative.push({ "profile.types.streamer_creative": { $exists: true } });
      link.types.push("streamer_creative");
    }
    if (req.body.types.streamer_irl == "true") {
      streamer_irl.push({ "profile.types.streamer_irl": { $exists: true } });
      link.types.push("streamer_irl");
    }
    if (req.body.types.streamer_socialeating == "true") {
      streamer_socialeating.push({ "profile.types.streamer_socialeating": { $exists: true } });
      link.types.push("streamer_socialeating");
    }
    if (req.body.types.streamer_talkshow == "true") {
      streamer_talkshow.push({ "profile.types.streamer_talkshow": { $exists: true } });
      link.types.push("streamer_talkshow");
    }
    if (req.body.types.streamer_music == "true") {
      streamer_music.push({ "profile.types.streamer_music": { $exists: true } });
      link.types.push("streamer_music");
    }
    if (req.body.types.artist == "true") {
      artist.push({ "profile.types.artist": { $exists: true } });
      link.types.push("artist");
    }
    if (req.body.types.developer == "true") {
      developer.push({ "profile.types.developer": { $exists: true } });
      link.types.push("developer");
    }
    if (req.body.types.communitymanager == "true") {
      communitymanager.push({ "profile.types.communitymanager": { $exists: true } });
      link.types.push("communitymanager");
    }
    if (req.body.types.moderator == "true") {
      moderator.push({ "profile.types.moderator": { $exists: true } });
      link.types.push("moderator");
    }
    if (req.body.types.viewer == "true") {
      viewer.push({ "profile.types.viewer": { $exists: true } });
      link.types.push("viewer");
    }
    if (req.body.types.other == "true") {
      other.push({ "profile.types.other": { $exists: true } });
      link.types.push("other");
    }
    if (i[0]) {
      if (req.body.types.method == "one") {
        query.push({ "$or": i });
        link.types_method = "one";
      }
      else {
        query.push({ "$and": i });
        link.types_method = "all";
      }
    }
    link.types = link.types.join();

    if (req.body.attributes) {
      i = [];
      if (req.body.attributes.streamer_gaming) {
        link.streamer_gaming_genres = [];
        if (req.body.attributes.streamer_gaming.genres.action == "true") {
          i.push({ "profile.types.streamer_gaming.genres.action": "true" });
          link.streamer_gaming_genres.push("action");
        }
        if (req.body.attributes.streamer_gaming.genres.adventure == "true") {
          i.push({ "profile.types.streamer_gaming.genres.adventure": "true" });
          link.streamer_gaming_genres.push("adventure");
        }
        if (req.body.attributes.streamer_gaming.genres.horror == "true") {
          i.push({ "profile.types.streamer_gaming.genres.horror": "true" });
          link.streamer_gaming_genres.push("horror");
        }
        if (req.body.attributes.streamer_gaming.genres.roleplaying == "true") {
          i.push({ "profile.types.streamer_gaming.genres.roleplaying": "true" });
          link.streamer_gaming_genres.push("roleplaying");
        }
        if (req.body.attributes.streamer_gaming.genres.simulation == "true") {
          i.push({ "profile.types.streamer_gaming.genres.simulation": "true" });
          link.streamer_gaming_genres.push("simulation");
        }
        if (req.body.attributes.streamer_gaming.genres.strategy == "true") {
          i.push({ "profile.types.streamer_gaming.genres.strategy": "true" });
          link.streamer_gaming_genres.push("strategy");
        }
        if (req.body.attributes.streamer_gaming.genres.survival == "true") {
          i.push({ "profile.types.streamer_gaming.genres.survival": "true" });
          link.streamer_gaming_genres.push("survival");
        }
        if (req.body.attributes.streamer_gaming.genres.other == "true") {
          i.push({ "profile.types.streamer_gaming.genres.other": "true" });
          link.streamer_gaming_genres.push("other");
        }
        if (i[0]) {
          if (req.body.attributes.streamer_gaming.genres.method == "one") {
            streamer_gaming.push({ "$or": i });
            link.streamer_gaming_genres_method = "one";
          }
          else {
            streamer_gaming.push({ "$and": i });
            link.streamer_gaming_genres_method = "all";
          }
        }
        link.streamer_gaming_genres = link.streamer_gaming_genres.join();
      }

      i = [];
      if (req.body.attributes.streamer_creative) {
        link.streamer_creative_activities = [];
        if (req.body.attributes.streamer_creative.activities.cooking == "true") {
          i.push({ "profile.types.streamer_creative.activities.cooking": "true" });
          link.streamer_creative_activities.push("cooking");
        }
        if (req.body.attributes.streamer_creative.activities.drawing == "true") {
          i.push({ "profile.types.streamer_creative.activities.drawing": "true" });
          link.streamer_creative_activities.push("drawing");
        }
        if (req.body.attributes.streamer_creative.activities.music == "true") {
          i.push({ "profile.types.streamer_creative.activities.music": "true" });
          link.streamer_creative_activities.push("music");
        }
        if (req.body.attributes.streamer_creative.activities.painting == "true") {
          i.push({ "profile.types.streamer_creative.activities.painting": "true" });
          link.streamer_creative_activities.push("painting");
        }
        if (req.body.attributes.streamer_creative.activities.programming == "true") {
          i.push({ "profile.types.streamer_creative.activities.programming": "true" });
          link.streamer_creative_activities.push("programming");
        }
        if (req.body.attributes.streamer_creative.activities.editing == "true") {
          i.push({ "profile.types.streamer_creative.activities.editing": "true" });
          link.streamer_creative_activities.push("editing");
        }
        if (req.body.attributes.streamer_creative.activities.other == "true") {
          i.push({ "profile.types.streamer_creative.activities.other": "true" });
          link.streamer_creative_activities.push("other");
        }
        if (i[0]) {
          if (req.body.attributes.streamer_creative.activities.method == "one") {
            streamer_creative.push({ "$or": i });
            link.streamer_creative_activities_method = "one";
          }
          else {
            streamer_creative.push({ "$and": i });
            link.streamer_creative_activities_method = "all";
          }
        }
        link.streamer_creative_activities = link.streamer_creative_activities.join();
      }

      i = [];
      if (req.body.attributes.artist) {
        if (req.body.attributes.artist.accepts == "yes") {
          i.push({ "profile.types.artist.commissions": { $exists: true } });
          link.artist_commissions_accepts = "yes";
        }
        else if (req.body.attributes.artist.accepts == "no") {
          i.push({ "profile.types.artist.commissions": { $exists: false } });
          link.artist_commissions_accepts = "no";
        }
        else {
          link.artist_commissions_accepts = "any";
        }
        if (req.body.attributes.artist.charges == "yes") {
          i.push({ "profile.types.artist.commissions.charge": { $ne: "" } });
          link.artist_commissions_charges = "yes";
        }
        else if (req.body.attributes.artist.charges == "no") {
          i.push({ "profile.types.artist.commissions.charge": "" });
          link.artist_commissions_charges = "no";
        }
        else {
          link.artist_commissions_charges = "any";
        }
        if (req.body.attributes.artist.currently == "yes") {
          i.push({ "profile.types.artist.commissions.accepting": "true" });
          link.artist_commissions_currently = "yes";
        }
        else if (req.body.attributes.artist.currently == "no") {
          i.push({ "profile.types.artist.commissions.accepting": "false" });
          link.artist_commissions_currently = "no";
        }
        else {
          link.artist_commissions_currently = "any";
        }

        if (i[0]) {
          artist.push({ "$and": i });
        }
      }

      i = [];
      if (req.body.attributes.developer) {
        if (req.body.attributes.developer.accepts == "yes") {
          i.push({ "profile.types.developer.commissions": { $exists: true } });
          link.developer_commissions_accepts = "yes";
        }
        else if (req.body.attributes.developer.accepts == "no") {
          i.push({ "profile.types.developer.commissions": { $exists: false } });
          link.developer_commissions_accepts = "no";
        }
        else {
          link.developer_commissions_accepts = "any";
        }
        if (req.body.attributes.developer.charges == "yes") {
          i.push({ "profile.types.developer.commissions.charge": { $ne: "" } });
          link.developer_commissions_charges = "yes";
        }
        else if (req.body.attributes.developer.charges == "no") {
          i.push({ "profile.types.developer.commissions.charge": "" });
          link.developer_commissions_charges = "no";
        }
        else {
          link.developer_commissions_charges = "any";
        }
        if (req.body.attributes.developer.currently == "yes") {
          i.push({ "profile.types.developer.commissions.accepting": "true" });
          link.developer_commissions_currently = "yes";
        }
        else if (req.body.attributes.developer.currently == "no") {
          i.push({ "profile.types.developer.commissions.accepting": "false" });
          link.developer_commissions_currently = "no";
        }
        else {
          link.developer_commissions_currently = "any";
        }

        if (i[0]) {
          developer.push({ "$and": i });
        }
      }

      i = [];
      if (req.body.attributes.moderator) {
        if (req.body.attributes.moderator.accepts == "yes") {
          i.push({ "profile.types.moderator.requests": { $exists: true } });
          link.moderator_requests_accepts = "yes";
        }
        else if (req.body.attributes.moderator.accepts == "no") {
          i.push({ "profile.types.moderator.requests": { $exists: false } });
          link.moderator_requests_accepts = "no";
        }
        else {
          link.moderator_requests_accepts = "any";
        }

        if (i[0]) {
          moderator.push({ "$and": i });
        }
      }

      i = [];
      if (req.body.attributes.viewer) {
        link.viewer_preferences = [];
        if (req.body.attributes.viewer.preferences.action == "true") {
          i.push({ "profile.types.viewer.streams.action": "true" });
          link.viewer_preferences.push("action");
        }
        if (req.body.attributes.viewer.preferences.adventure == "true") {
          i.push({ "profile.types.viewer.streams.adventure": "true" });
          link.viewer_preferences.push("adventure");
        }
        if (req.body.attributes.viewer.preferences.roleplaying == "true") {
          i.push({ "profile.types.viewer.streams.roleplaying": "true" });
          link.viewer_preferences.push("roleplaying");
        }
        if (req.body.attributes.viewer.preferences.simulation == "true") {
          i.push({ "profile.types.viewer.streams.simulation": "true" });
          link.viewer_preferences.push("simulation");
        }
        if (req.body.attributes.viewer.preferences.strategy == "true") {
          i.push({ "profile.types.viewer.streams.strategy": "true" });
          link.viewer_preferences.push("strategy");
        }
        if (req.body.attributes.viewer.preferences.survival == "true") {
          i.push({ "profile.types.viewer.streams.survival": "true" });
          link.viewer_preferences.push("survival");
        }
        if (req.body.attributes.viewer.preferences.horror == "true") {
          i.push({ "profile.types.viewer.streams.horror": "true" });
          link.viewer_preferences.push("horror");
        }
        if (req.body.attributes.viewer.preferences.music == "true") {
          i.push({ "profile.types.viewer.streams.music": "true" });
          link.viewer_preferences.push("music");
        }
        if (req.body.attributes.viewer.preferences.cooking == "true") {
          i.push({ "profile.types.viewer.streams.cooking": "true" });
          link.viewer_preferences.push("cooking");
        }
        if (req.body.attributes.viewer.preferences.drawing == "true") {
          i.push({ "profile.types.viewer.streams.drawing": "true" });
          link.viewer_preferences.push("drawing");
        }
        if (req.body.attributes.viewer.preferences.painting == "true") {
          i.push({ "profile.types.viewer.streams.painting": "true" });
          link.viewer_preferences.push("painting");
        }
        if (req.body.attributes.viewer.preferences.programming == "true") {
          i.push({ "profile.types.viewer.streams.programming": "true" });
          link.viewer_preferences.push("programming");
        }
        if (req.body.attributes.viewer.preferences.editing == "true") {
          i.push({ "profile.types.viewer.streams.editing": "true" });
          link.viewer_preferences.push("editing");
        }
        if (req.body.attributes.viewer.preferences.talkshow == "true") {
          i.push({ "profile.types.viewer.streams.talkshow": "true" });
          link.viewer_preferences.push("talkshow");
        }
        if (req.body.attributes.viewer.preferences.irl == "true") {
          i.push({ "profile.types.viewer.streams.irl": "true" });
          link.viewer_preferences.push("irl");
        }
        if (req.body.attributes.viewer.preferences.socialeating == "true") {
          i.push({ "profile.types.viewer.streams.socialeating": "true" });
          link.viewer_preferences.push("socialeating");
        }

        if (i[0]) {
          if (req.body.attributes.viewer.preferences.method == "one") {
            viewer.push({ "$or": i });
            link.viewer_preferences_method = "one";
          }
          else {
            viewer.push({ "$and": i });
            link.viewer_preferences_method = "all";
          }
        }
        link.viewer_preferences = link.viewer_preferences.join();
      }

      i = [];
      if (req.body.attributes.overview && req.body.attributes.overview.keywords) {
        link.overview_keywords = [];
        for (var word of req.body.attributes.overview.keywords) {
          i.push({ $or: [ { "profile.overview.about": { $regex: word } }, { "profile.overview.goals": { $regex: word } }, { "profile.overview.background": { $regex: word } } ] });
          link.overview_keywords.push(word);
        }
        if (i[0]) {
          overview.push({ "$or": i });
        }
        link.overview_keywords = link.overview_keywords.join();
      }

      i = [];
      if (req.body.attributes.streamer_gaming && req.body.attributes.streamer_gaming.keywords) {
        link.streamer_gaming_keywords = [];
        for (var word of req.body.attributes.streamer_gaming.keywords) {
          i.push({ $or: [ { "profile.types.streamer_gaming.goals": { $regex: word } }, { "profile.types.streamer_gaming.schedule": { $regex: word } } ] });
          link.streamer_gaming_keywords.push(word);
        }
        if (i[0]) {
          streamer_gaming.push({ "$or": i });
        }
        link.streamer_gaming_keywords = link.streamer_gaming_keywords.join();
      }

      i = [];
      if (req.body.attributes.streamer_creative && req.body.attributes.streamer_creative.keywords) {
        link.streamer_creative_keywords = [];
        for (var word of req.body.attributes.streamer_creative.keywords) {
          i.push({ $or: [ { "profile.types.streamer_creative.goals": { $regex: word } }, { "profile.types.streamer_creative.schedule": { $regex: word } } ] });
          link.streamer_creative_keywords.push(word);
        }
        if (i[0]) {
          streamer_creative.push({ "$or": i });
        }
        link.streamer_creative_keywords = link.streamer_creative_keywords.join();
      }

      i = [];
      if (req.body.attributes.streamer_irl && req.body.attributes.streamer_irl.keywords) {
        link.streamer_irl_keywords = [];
        for (var word of req.body.attributes.streamer_irl.keywords) {
          i.push({ $or: [ { "profile.types.streamer_irl.goals": { $regex: word } }, { "profile.types.streamer_irl.schedule": { $regex: word } }, { "profile.types.streamer_irl.activities": { $regex: word } } ] });
          link.streamer_irl_keywords.push(word);
        }
        if (i[0]) {
          streamer_irl.push({ "$or": i });
        }
        link.streamer_irl_keywords = link.streamer_irl_keywords.join();
      }

      i = [];
      if (req.body.attributes.streamer_socialeating && req.body.attributes.streamer_socialeating.keywords) {
        link.streamer_socialeating_keywords = [];
        for (var word of req.body.attributes.streamer_socialeating.keywords) {
          i.push({ $or: [ { "profile.types.streamer_socialeating.goals": { $regex: word } }, { "profile.types.streamer_socialeating.schedule": { $regex: word } } ] });
          link.streamer_socialeating_keywords.push(word);
        }
        if (i[0]) {
          streamer_socialeating.push({ "$or": i });
        }
        link.streamer_socialeating_keywords = link.streamer_socialeating_keywords.join();
      }

      i = [];
      if (req.body.attributes.streamer_talkshow && req.body.attributes.streamer_talkshow.keywords) {
        link.streamer_talkshow_keywords = [];
        for (var word of req.body.attributes.streamer_talkshow.keywords) {
          i.push({ $or: [ { "profile.types.streamer_talkshow.goals": { $regex: word } }, { "profile.types.streamer_talkshow.schedule": { $regex: word } }, { "profile.types.streamer_talkshow.discussions": { $regex: word } }, { "profile.types.streamer_talkshow.guests": { $regex: word } } ] });
          link.streamer_talkshow_keywords.push(word);
        }
        if (i[0]) {
          streamer_talkshow.push({ "$or": i });
        }
        link.streamer_talkshow_keywords = link.streamer_talkshow_keywords.join();
      }

      i = [];
      if (req.body.attributes.streamer_music && req.body.attributes.streamer_music.keywords) {
        link.streamer_music_keywords = [];
        for (var word of req.body.attributes.streamer_music.keywords) {
          i.push({ $or: [ { "profile.types.streamer_music.goals": { $regex: word } }, { "profile.types.streamer_music.schedule": { $regex: word } } ] });
          link.streamer_music_keywords.push(word);
        }
        if (i[0]) {
          streamer_music.push({ "$or": i });
        }
        link.streamer_music_keywords = link.streamer_music_keywords.join();
      }

      i = [];
      if (req.body.attributes.artist && req.body.attributes.artist.keywords) {
        link.artist_keywords = [];
        for (var word of req.body.attributes.artist.keywords) {
          i.push({ $or: [ { "profile.types.artist.examples": { $regex: word } }, { "profile.types.artist.attraction": { $regex: word } }, { "profile.types.artist.commissions.services": { $regex: word } }, { "profile.types.artist.commissions.contact": { $regex: word } }, { "profile.types.artist.commissions.charge": { $regex: word } } ] });
          link.artist_keywords.push(word);
        }
        if (i[0]) {
          artist.push({ "$or": i });
        }
        link.artist_keywords = link.artist_keywords.join();
      }

      i = [];
      if (req.body.attributes.developer && req.body.attributes.developer.keywords) {
        link.developer_keywords = [];
        for (var word of req.body.attributes.developer.keywords) {
          i.push({ $or: [ { "profile.types.developer.examples": { $regex: word } }, { "profile.types.developer.attraction": { $regex: word } }, { "profile.types.developer.commissions.services": { $regex: word } }, { "profile.types.developer.commissions.contact": { $regex: word } }, { "profile.types.developer.commissions.charge": { $regex: word } } ] });
          link.developer_keywords.push(word);
        }
        if (i[0]) {
          developer.push({ "$or": i });
        }
        link.developer_keywords = link.developer_keywords.join();
      }

      i = [];
      if (req.body.attributes.communitymanager && req.body.attributes.communitymanager.keywords) {
        link.communitymanager_keywords = [];
        for (var word of req.body.attributes.communitymanager.keywords) {
          i.push({ $or: [ { "profile.types.communitymanager.examples": { $regex: word } }, { "profile.types.communitymanager.attraction": { $regex: word } } ] });
          link.communitymanager_keywords.push(word);
        }
        if (i[0]) {
          communitymanager.push({ "$or": i });
        }
        link.communitymanager_keywords = link.communitymanager_keywords.join();
      }

      i = [];
      if (req.body.attributes.moderator && req.body.attributes.moderator.keywords) {
        link.moderator_keywords = [];
        for (var word of req.body.attributes.moderator.keywords) {
          i.push({ $or: [ { "profile.types.moderator.experience": { $regex: word } }, { "profile.types.moderator.attraction": { $regex: word } } ] });
          link.moderator_keywords.push(word);
        }
        if (i[0]) {
          moderator.push({ "$or": i });
        }
        link.moderator_keywords = link.moderator_keywords.join();
      }

      i = [];
      if (req.body.attributes.viewer) {
        if (req.body.attributes.viewer.keywords) {
          link.viewer_keywords = [];
          for (var word of req.body.attributes.viewer.keywords) {
            i.push({ $or: [ { "profile.types.viewer.experience": { $regex: word } }, { "profile.types.viewer.streamers": { $regex: word } } ] });
            link.viewer_keywords.push(word);
          }
          if (i[0]) {
            viewer.push({ "$or": i });
          }
          link.viewer_keywords = link.viewer_keywords.join();
        }
        if (req.body.attributes.viewer.family == "true") {
          viewer.push({ "profile.types.viewer.family": "true" });
          link.viewer_family = true;
        }
      }

      i = [];
      if (req.body.attributes.other && req.body.attributes.other.keywords) {
        link.other_keywords = [];
        for (var word of req.body.attributes.other.keywords) {
          i.push({ $or: [ { "profile.types.other": { $regex: word } } ] });
          link.other_keywords.push(word);
        }
        if (i[0]) {
          other.push({ "$or": i });
        }
        link.other_keywords = link.other_keywords.join();
      }
    }

    if (req.body.tags.tags) {
      link.tags = [];
      i = [];
      for (var tag of req.body.tags.tags) {
        if (tag !== "") {
          i.push({ "profile.tags": { $in: [tag] } });
          link.tags.push(tag);
        }
      }
      if (i[0]) {
        if (req.body.tags.method == "one") {
          query.push({ "$or": i });
          link.tags_method = "one";
        }
        else {
          query.push({ "$and": i });
          link.tags_method = "all";
        }
      }
      link.tags = link.tags.join();
    }

    if (req.body.description) {
      link.description = req.body.description;
    }

    if (streamer_gaming[0]) {
      i.push({ "$and": streamer_gaming });
    }
    if (streamer_creative[0]) {
      i.push({ "$and": streamer_creative });
    }
    if (streamer_irl[0]) {
      i.push({ "$and": streamer_irl });
    }
    if (streamer_socialeating[0]) {
      i.push({ "$and": streamer_socialeating });
    }
    if (streamer_talkshow[0]) {
      i.push({ "$and": streamer_talkshow });
    }
    if (streamer_music[0]) {
      i.push({ "$and": streamer_music });
    }
    if (artist[0]) {
      i.push({ "$and": artist });
    }
    if (developer[0]) {
      i.push({ "$and": developer });
    }
    if (communitymanager[0]) {
      i.push({ "$and": communitymanager });
    }
    if (moderator[0]) {
      i.push({ "$and": moderator });
    }
    if (viewer[0]) {
      i.push({ "$and": viewer });
    }
    if (other[0]) {
      i.push({ "$and": other });
    }
    if (req.body.types.method == "one") {
      query.push({ "$or": i });
    }
    else {
      query.push({ "$and": i });
    }
    query.push({ "$and": overview });
    query.push({ "profile.status": "approved" });

    db.users.query({ "$and": query }, 0).then(function(data) {
      var id = Date.now();
      req.session.query = {
        id: id,
        done: true,
        data: data,
        public: req.body.public,
        url: url.format({
          pathname:"/browse/query",
          query: link
        })
      };
      req.session.query.url = req.session.query.url.replace(/%2C/g, ",");
      if (req.body.public == "true") {
        var description = req.body.description;
        if (description) {
          db.queries.getByRedirect(req.session.query.url).then(function(data) {
            if (!data) {
              db.queries.add({
                description: description,
                id: id,
                redirect: req.session.query.url,
                uses: 1,
                last_use: id
              }).then(function() {
                res.send({ message: "success" });
              });
            }
            else {
              data.uses = data.uses + 1;
              data.last_use = id;
              db.queries.edit(data.id, data).then(function() {
                res.send({ message: "success" });
              });
            }
          });
        }
        else {
          res.send({ message: "unknown" });
        }
      }
      else {
        res.send({ message: "success" });
      }
    });
  }
  else {
    res.send({ message: "unknown" });
  }
});

module.exports = router;
