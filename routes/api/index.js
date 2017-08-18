var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("*", function(req, res, next) {
  res.json({
    status: 400,
    message: "Bad Request",
    description: "The endpoint you have used does not exist."
  });
});

module.exports = router;
