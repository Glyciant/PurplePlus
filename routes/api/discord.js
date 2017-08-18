var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/commands", function(req, res, next) {
  db.commands.getAll().then(function(data) {
    data.forEach(function(x) { delete x._id });
    res.json({
      status: 200,
      message: "OK",
      description: "Match Found",
      commands: data
    });
  });
});

router.get("/commands/:name", function(req, res, next) {
  db.commands.getByName(req.params.name).then(function(data) {
    if (data) {
      res.json({
        status: 200,
        message: "OK",
        description: "Match Found",
        name: data.name,
        response: data.response,
        enabled: data.enabled,
        restricted: data.restricted,
        restrictions: data.restrictions
      });
    }
    else {
      res.json({
        status: 404,
        message: "Not Found",
        description: "There is no Discord command with the code " + req.params.short + "."
      });
    }
  });
});

module.exports = router;
