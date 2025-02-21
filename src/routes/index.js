const newsRouter = require("./newsRoute");
const coursesRouter = require("./coursesRoute");
const siteRouter = require("./siteRoute");
const meRouter = require("./meRoute");
const loginRouter = require("./loginRoute");
const authRouter = require("./authRoute");

function routes(app) {
  app.use("/news", newsRouter);
  app.use("/courses", coursesRouter);
  app.use("/me", meRouter);
  app.get("/", siteRouter);
  app.get("/search", siteRouter);
  app.use('/login', loginRouter);
  app.use('/auth', authRouter);
}

module.exports = routes;
