const newsRouter = require("./newsRoute");
const coursesRouter = require("./coursesRoute");
const siteRouter = require("./siteRoute");
const meRouter = require("./meRoute");
const loginRouter = require("./loginRoute");

function routes(app) {
  app.use("/news", newsRouter);
  app.use("/courses", coursesRouter);
  app.use("/me", meRouter);
  app.get("/", siteRouter);
  app.get("/search", siteRouter);
  app.use('/login', loginRouter);
}

module.exports = routes;
