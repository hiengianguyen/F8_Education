const newsRouter = require('./news');
const coursesRouter = require('./courses');
const siteRouter = require('./site');

function routes(app) {
  app.use('/news', newsRouter);
  app.use('/course', coursesRouter);

  app.get('/', siteRouter);

  app.get('/search', siteRouter);
}

module.exports = routes;
