var mongodb = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    assert = require('assert'),
    config = require('./config'),
    url = config.app.db;

var users = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  editByRedditId: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").updateOne({ reddit_id: id }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  editByRedditUsername: (username, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").updateOne({ reddit_username: username }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  editByTwitchId: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").updateOne({ twitch_id: id }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  editByTwitchUsername: (username, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").updateOne({ twitch_username: username }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  editByDiscordId: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").updateOne({ discord_id: id }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  deleteByRedditId: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").deleteOne({ reddit_id: id }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  deleteByTwitchId: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").deleteOne({ twitch_id: id }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  searchApproved: (limit, ids, query) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        if (!ids) { ids = "" }
        if (!query) { query = /.*/ }
        else { query = new RegExp(query.toLowerCase(), "g") }
        db.collection("users").aggregate([{ $match: { twitch_id: { $nin: ids.split(",") }, twitch_username: query, "profile.status": "approved" } }, { $sample: { size: limit } }], function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  query: (query, limit) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find(query, { limit: limit }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getByRedditId: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").findOne({ reddit_id: id }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByRedditUsername: (username) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").findOne({ reddit_username: username }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByTwitchId: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").findOne({ twitch_id: id }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByTwitchIds: (ids) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ twitch_id: { "$in": ids } }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getByTwitchUsername: (username) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").findOne({ twitch_username: username }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByDiscordId: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").findOne({ discord_id: id }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByStatus: (status) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ "profile.status": status }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getAdmins: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ $or: [{ type: "mod" }, { type: "helper" }] }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getBetaTesters: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ beta: true }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getRandomApprovedByType: (type, live) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        var key = "profile.types." + type;
        if (live === true) {
          var match = { "profile.status": "approved", "stream": { $exists: true } };
        }
        else {
          var match = { "profile.status": "approved" };
        }
        match[key] = { $exists: true };
        db.collection("users").aggregate([{ $match: match }, { $sample: { size: 1 } }], function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getSpotlight: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        var now = Date.now();
        db.collection("users").aggregate([{ $match: { "profile.status": "approved", "profile.created": { $gte: (now - 2629746000) } } }, { $limit: 5 }, { $sort: { balance: -1 } }], function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getTwitchOfficials: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ $or: [{ "display.twitch": "staff" }, { "display.twitch": "admin" }, { "display.twitch": "global_mod" }] }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getScheduledStreams: (start, end, limit, offset) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ streams: { $elemMatch: { start: { $lte: end }, end: { $gt: start } } } }, { sort: [[ "balance", "descending" ]], skip: offset, limit: limit }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getAllByTwoos: (offset, limit) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({}, { sort: [[ "balance", "descending" ]], skip: offset, limit: limit }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getAllByProfileVotes: (offset, ids) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        if (ids) {
          db.collection("users").aggregate([ { "$project": { twitch_id: 1, twitch_name: 1, twitch_username: 1, reddit_id: 1, reddit_name: 1, reddit_username: 1, discord_id: 1, discord_name: 1, discord_tag: 1, balance: 1, logo: 1, "profile.status": 1, "profile.votes": 1, length: { "$size": { "$ifNull": ["$profile.votes", []] } } } }, { $match: { twitch_id: { $nin: ids.split(",") } } }, { "$sort": { length: -1 } }, { "$limit": 25 }], function(err, result) {
            assert.equal(null, err);
            db.close();
            if (result) {
              resolve(result);
            }
            else {
              resolve(null);
            }
          });
        }
        else {
          db.collection("users").aggregate([ { "$project": { twitch_id: 1, twitch_name: 1, twitch_username: 1, reddit_id: 1, reddit_name: 1, reddit_username: 1, discord_id: 1, discord_name: 1, discord_tag: 1, balance: 1, logo: 1, "profile.status": 1, "profile.votes": 1, length: { "$size": { "$ifNull": ["$profile.votes", []] } } } }, { "$sort": { length: -1 } }, { "$limit": 25 }], function(err, result) {
            assert.equal(null, err);
            db.close();
            if (result) {
              resolve(result);
            }
            else {
              resolve(null);
            }
          });
        }
      });
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({}, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  updateArtCommissions: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        var now = Date.now();
        db.collection("users").updateOne({ "profile.types.artist.commissions.accepting": true, last_login: { $lt: (now - 2629746000) } }, { $set: { "profile.types.artist.commissions.accepting": false } }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  updateDeveloperCommissions: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        var now = Date.now();
        db.collection("users").updateOne({ "profile.types.developer.commissions.accepting": true, last_login: { $lt: (now - 2629746000) } }, { $set: { "profile.types.developer.commissions.accepting": false } }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  }
};

var cache = {
  addStream: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").updateOne({ twitch_id: id.toString() }, { $set: { stream: object } }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  addHost: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").updateOne({ twitch_id: id.toString() }, { $set: { hosting: object } }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  clear: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").updateMany({}, { $unset: { stream: 1, hosting: 1 } }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByRandom: (limit, ids) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        if (!ids) { ids = "" };
        db.collection("users").aggregate([{ $match: { "stream.stream_type": "live", twitch_id: { $nin: ids.split(",") } } }, { $sample: { size: limit } }], function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByTwoos: (offset) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ "stream.stream_type": "live" }, { sort: [[ "balance", "descending" ]], limit: 12, skip: offset }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getByProfileVotes: (offset) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").aggregate([ { "$match": { "stream.stream_type": "live" } }, { "$project": { stream: 1, balance: 1, "profile.votes": 1, length: { "$size": { "$ifNull": ["$profile.votes", []] } } } }, { "$sort": { length: -1 } }, { "$skip": offset }, { "$limit": 12 }], function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByLength: (offset, order) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ "stream.stream_type": "live" }, { sort: [[ "stream.created_at", order ]], limit: 12, skip: offset }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getDirectories: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").aggregate([{ $match: { "stream.stream_type": "live" } }, { "$group": { "_id": { directory: "$stream.game", viewers: "$stream.viewers" } } }], function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByDirectory: (directory) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ "stream.stream_type": "live", "stream.game": directory }, { sort: [[ "balance", "descending" ]] }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getCommunities: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").aggregate([{ $match: { "stream.stream_type": "live" } }, { "$group": { "_id": { ids: "$stream.community_ids", viewers: "$stream.viewers" } } }], function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByCommunity: (community) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ "stream.stream_type": "live", "stream.community_ids": { "$in": [community] } }, { sort: [[ "balance", "descending" ]] }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getByViewers: (offset, order, min, max, limit) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("users").find({ "stream.stream_type": "live", "stream.viewers": { $gte: min, $lte: max }  }, { sort: [[ "stream.viewers", order ]], limit: limit, skip: offset }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  }
}

var queries = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("queries").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  edit: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("queries").updateOne({ id: id }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("queries").findOne({ id: id }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByRedirect: (redirect) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("queries").findOne({ redirect: redirect }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByUses: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("queries").find({}, { sort: [[ "uses", "descending" ]], limit: 50 }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  }
}

var commands = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("commands").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  edit: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("commands").updateOne({ _id: ObjectID(id) }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("commands").deleteOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("commands").findOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByName: (name) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("commands").findOne({ name: name }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("commands").find({}, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  }
}

var filters = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("filters").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  edit: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("filters").updateOne({ _id: ObjectID(id) }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("filters").deleteOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("filters").findOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByName: (name) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("filters").findOne({ name: name }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("filters").find({}, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  }
}

var logs = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("logs").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  editByMessageId: (channel, message, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("logs").updateOne({ channel_id: channel, message_id: message }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  deleteByChannelId: (channel) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("logs").deleteMany({ channel_id: channel }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByMessageId: (channel, message) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("logs").findOne({ channel_id: channel, message_id: message }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByChannelId: (channel) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("logs").find({ channel_id: channel }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getByUserId: (user) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("logs").find({ discord_id: user }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  getLatest: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("logs").find({}, { sort: [[ "timestamp", "descending" ]], limit: 100 }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
  query: (channel, user, limit) => {
    if (!channel) channel = /.*/
    if (!user) user = /.*/
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("logs").find({ channel_id: channel, discord_id: user }, { sort: [[ "timestamp", "descending" ]], limit: limit }, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  },
};

var links = {
  add: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("links").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  edit: (id, object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("links").updateOne({ _id: ObjectID(id) }, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("links").deleteOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("links").findOne({ _id: ObjectID(id) }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getByShort: (short) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("links").findOne({ short: short }, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("links").find({}, function(err, result) {
          result.toArray().then(function(arrayResult) {
            assert.equal(null, err);
            db.close();
            if (arrayResult) {
              resolve(arrayResult);
            }
            else {
              resolve(null);
            }
          });
        });
      });
    });
  }
}

var settings = {
  generate: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("settings").insertOne(object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  edit: (object) => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("settings").updateOne({}, object, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  },
  get: () => {
    return new Promise((resolve, reject) => {
      mongodb.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("settings").findOne({}, function(err, result) {
          assert.equal(null, err);
          db.close();
          if (result) {
            resolve(result);
          }
          else {
            resolve(null);
          }
        });
      });
    });
  }
};

module.exports = {
  users: users,
  cache, cache,
  queries: queries,
  filters: filters,
  commands, commands,
  logs: logs,
  links: links,
  settings: settings
}
