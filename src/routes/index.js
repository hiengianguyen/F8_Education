const newsRouter = require("./newsRoute");
const coursesRouter = require("./coursesRoute");
const siteRouter = require("./siteRoute");
const meRouter = require("./meRoute");
const authRouter = require("./authRoute");
const homeRouter = require("./homeRoute");

function routes(app) {
  app.use("/news", newsRouter);
  app.use("/courses", coursesRouter);
  app.use("/me", meRouter);
  app.use("/", homeRouter);
  app.use("/", siteRouter);
  app.use("/auth", authRouter);
}

module.exports = routes;
