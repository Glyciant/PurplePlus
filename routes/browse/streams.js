var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  Promise.all([db.cache.getByTwoos(0), db.cache.getByProfileVotes(0), db.cache.getByRandom(12, ""), db.cache.getByLength(0, "descending"), db.cache.getByViewers(0, "descending", 0, 999999999, 12), db.cache.getByViewers(0, "descending", 0, 999999999, 0)]).then(function(data) {
    var min = Math.min.apply(Math, data[5].map(function(x) { return x.stream.viewers; })),
        max = Math.max.apply(Math, data[5].map(function(x) { return x.stream.viewers; }));
    res.render("streams", { title: "Streams", twoos: data[0], votes: data[1], random: data[2], length: data[3], viewers: data[4], min: min, max: max });
  });
});

router.post("/twoos", function(req, res, next) {
  if (req.body.offset && !isNaN(parseInt(req.body.offset))) {
    db.cache.getByTwoos(parseInt(req.body.offset)).then(function(data) {
      res.render("stream_partial", { data: data });
    });
  }
  else {
    res.send("");
  }
});

router.post("/votes", function(req, res, next) {
  if (req.body.offset && !isNaN(parseInt(req.body.offset))) {
    db.cache.getByProfileVotes(parseInt(req.body.offset)).then(function(data) {
      res.render("stream_partial", { data: data });
    });
  }
  else {
    res.send("");
  }
});

router.post("/random", function(req, res, next) {
  db.cache.getByRandom(12, req.body.ids).then(function(data) {
    res.render("stream_partial", { data: data });
  });
});

router.post("/length", function(req, res, next) {
  if (req.body.offset && !isNaN(parseInt(req.body.offset)) && (req.body.order == "ascending" || req.body.order == "descending")) {
    db.cache.getByLength(parseInt(req.body.offset), req.body.order).then(function(data) {
      res.render("stream_partial", { data: data });
    });
  }
  else {
    res.send("");
  }
});

router.post("/directories", function(req, res, next) {
  db.cache.getDirectories().then(function(result) {
    var data = [];
    for (var directory of result) {
      var index = data.map(function(x) { return x.directory; }).indexOf(directory._id.directory);
      if (index === -1 && directory._id.directory) {
        data.push({
          directory: directory._id.directory,
          viewers: directory._id.viewers,
          streamers: 1
        });
      }
      else if (directory._id.directory) {
        data[index].viewers = data[index].viewers + directory._id.viewers;
        data[index].streamers = data[index].streamers + directory._id.streamers;
      }
    }
    if (req.body.order == "az") {
      data.sort(function(a, b){
        if (a.directory < b.directory) { return -1; }
        if (a.directory > b.directory) { return 1; }
        return 0;
      });
    }
    else if (req.body.order == "viewers") {
      data.sort(function(a, b) {
        return parseFloat(b.viewers) - parseFloat(a.viewers);
      });
    }
    data = data.map(function(x) { return x.directory; });
    res.render("directory_partial", { data: data });
  });
});

router.post("/directory", function(req, res, next) {
  if (req.body.directory) {
    db.cache.getByDirectory(req.body.directory).then(function(streams) {
      var viewers = 0;
      for (var stream of streams) {
        viewers = viewers + stream.stream.viewers;
      }
      res.render("stream_partial", { data: streams, viewers: viewers });
    });
  }
  else {
    res.send("");
  }
});

router.post("/communities", function(req, res, next) {
  var processed = 0
      data = [];
  db.cache.getCommunities().then(function(result) {
    for (var community of result) {
      for (var id of community._id.ids) {
        var index = data.map(function(x) { return x.id; }).indexOf(id);
        if (index === -1 && id) {
          data.push({
            id: id,
            viewers: community._id.viewers
          });
        }
        else if (id) {
          data[index].viewers = data[index].viewers + community._id.viewers;
        }
      }
    }
    result = [];
    data.forEach(function(object) {
      helpers.twitch.getCommunityById(object.id).then(function(api) {
        result.push({
          id: object.id,
          name: api.name,
          image: api.avatar_image_url,
          viewers: object.viewers
        });
        processed = processed + 1;
        if (processed == data.length) {
          if (req.body.order == "az") {
            result.sort(function(a, b){
              if (a.name < b.name) { return -1; }
              if (a.name > b.name) { return 1; }
              return 0;
            });
          }
          else if (req.body.order == "viewers") {
            result.sort(function(a, b) {
              return parseFloat(b.viewers) - parseFloat(a.viewers);
            });
          }
          res.render("community_partial", { data: result });
        }
      });
    });
  });
});

router.post("/community", function(req, res, next) {
  if (req.body.community) {
    db.cache.getByCommunity(req.body.community).then(function(data) {
      res.render("stream_partial", { data: data });
    });
  }
  else {
    res.send("");
  }
});

router.post("/viewers", function(req, res, next) {
  if (req.body.offset && !isNaN(parseInt(req.body.offset)) && (req.body.order == "ascending" || req.body.order == "descending") && req.body.min && !isNaN(parseInt(req.body.min)) && req.body.max && !isNaN(parseInt(req.body.max))) {
    db.cache.getByViewers(parseInt(req.body.offset), req.body.order, parseInt(req.body.min), parseInt(req.body.max), 12).then(function(data) {
      res.render("stream_partial", { data: data });
    });
  }
  else {
    res.send("");
  }
});

module.exports = router;
