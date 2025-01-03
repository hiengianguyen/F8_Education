const newsRouter = require('./news');

function routes(app) {
  app.use('/news', newsRouter);

  app.get('/', (req, res) => {
    res.render('home');
  });

  app.get('/search', (req, res) => {
    res.render('search');
  });
}

module.exports = routes;
