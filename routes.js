module.exports = function(app) {
  app.use('/',  require('./routes/index'));
  app.use('/accounts',  require('./routes/accounts'));
  app.use('/auth/redirect',  require('./routes/auth/redirect'));
  app.use('/auth/link',  require('./routes/auth/link'));
  app.use('/auth/login',  require('./routes/auth/login'));
  app.use('/auth/logout',  require('./routes/auth/logout'));
  app.use('/auth/unlink',  require('./routes/auth/unlink'));
  app.use('/profile',  require('./routes/profile'));
  app.use('/user',  require('./routes/user'));
}