module.exports = function(app) {
  app.use('/', require('./routes/index'));
  app.use('/about', require('./routes/about'));
  app.use('/admin', require('./routes/admin'));
  app.use('/auth/redirect', require('./routes/auth/redirect'));
  app.use('/auth/link', require('./routes/auth/link'));
  app.use('/auth/login', require('./routes/auth/login'));
  app.use('/auth/logout', require('./routes/auth/logout'));
  app.use('/auth/unlink', require('./routes/auth/unlink'));
  app.use('/beta', require('./routes/beta'));
  app.use('/browse/home', require('./routes/browse/home'));
  app.use('/browse/leaderboards', require('./routes/browse/leaderboards'));
  app.use('/browse/query', require('./routes/browse/query'));
  app.use('/browse/schedule', require('./routes/browse/schedule'));
  app.use('/browse/search', require('./routes/browse/search'));
  app.use('/browse/spotlight', require('./routes/browse/spotlight'));
  app.use('/browse/streams', require('./routes/browse/streams'));
  app.use('/browse/surf', require('./routes/browse/surf'));
  app.use('/dashboard', require('./routes/dashboard'));
  app.use('/help', require('./routes/help'));
  app.use('/messages', require('./routes/messages'));
  app.use('/profile', require('./routes/profile'));
  app.use('/user', require('./routes/user'));
  app.use('/watch', require('./routes/watch'));
}