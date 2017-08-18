var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/:id", function(req, res, next) {
  if (!isNaN(parseInt(req.params.id))) {
    db.queries.getById(parseInt(req.params.id)).then(function(data) {
      if (data) {
        res.json({
          status: 200,
          message: "OK",
          description: "Match Found",
          query_id: data.id,
          redirect: "https://purple.plus" + data.redirect,
          uses: data.uses,
          last_use: data.last_use
        });
      }
      else {
        res.json({
          status: 404,
          message: "Not Found",
          description: "There is no query with the ID " + req.params.id + "."
        });
      }
    });
  }
  else {
    res.json({
      status: 404,
      message: "Not Found",
      description: "There is no query with the ID " + req.params.id + "."
    });
  }
});

module.exports = router;
