var express = require("express"),
    swig = require("swig"),
    config = require("../../config"),
    helpers = require("../../helpers"),
    db = require("../../db"),
    restler = require("restler"),
    router = express.Router();

router.get("/", function(req, res) {
	req.session.destroy();
	res.redirect("/browse/spotlight");
});

module.exports = router;
