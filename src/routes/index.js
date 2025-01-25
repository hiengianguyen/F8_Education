const newsRouter = require("./news");
const coursesRouter = require("./courses");
const siteRouter = require("./site");
const meRouter = require("./me");

function routes(app) {
  app.use("/news", newsRouter);
  app.use("/course", coursesRouter);
  app.use("/me", meRouter);
  app.get("/", siteRouter);

  app.get("/search", siteRouter);
}

module.exports = routes;
