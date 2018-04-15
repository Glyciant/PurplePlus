module.exports = function(app) {
  app.use('/',  require('./routes/index'));
  app.use('/auth/redirect',  require('./routes/auth/redirect'));
  app.use('/auth/login',  require('./routes/auth/login'));
  app.use('/auth/logout',  require('./routes/auth/logout'));
}