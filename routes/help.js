var express = require("express"),
    swig = require("swig"),
    router = express.Router();

router.get("/", function(req, res, next) {
  res.render('help', { title: 'Help Documentation' });
});

router.get("/faq", function(req, res, next) {
  res.render('help_faq', { title: 'Help Documentation: FAQ' });
});

router.get("/browsing", function(req, res, next) {
  res.render('help_browsing', { title: 'Help Documentation: Browsing' });
});

router.get("/profiles", function(req, res, next) {
  res.render('help_profiles', { title: 'Help Documentation: Profiles' });
});

router.get("/twoos", function(req, res, next) {
  res.render('help_twoos', { title: 'Help Documentation: Twoos' });
});

router.get("/requests", function(req, res, next) {
  res.render('help_requests', { title: 'Help Documentation: Advertisement Requests' });
});

router.get("/api", function(req, res, next) {
  res.render('help_api', { title: 'Help Documentation: API' });
});

module.exports = router;
