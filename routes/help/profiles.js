var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    router = express.Router();

router.get("/", function(req, res, next) {
  res.render('error', { title: '503 Error', code: '503', message: 'This feature is not available in the beta build. Sorry!' });
});

module.exports = router;
