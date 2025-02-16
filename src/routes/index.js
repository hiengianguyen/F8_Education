const newsRouter = require("./news");
const coursesRouter = require("./courses");
const siteRouter = require("./site");
const meRouter = require("./me");
const loginRouter = require("./login");

function routes(app) {
  app.use("/news", newsRouter);
  app.use("/courses", coursesRouter);
  app.use("/me", meRouter);
  app.get("/", siteRouter);
  app.get("/search", siteRouter);
  app.use('/login', loginRouter);
}

module.exports = routes;
