const path = require("path");
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const methodOverride = require("method-override");
const app = express();
const route = require("./routes");
const db = require("./config/db");
const sortMiddleware = require("./apps/middleware/SortMiddleware");
const session = require("express-session");
const Handlebars = require("handlebars");

require("dotenv").config();
const port = process.env.PORT || 3001;

//Connect to DB
db.connect();

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());

//Method override
app.use(methodOverride("_method"));

//Static file
app.use(express.static(path.join(__dirname, "public")));

//Custom middleware
app.use(sortMiddleware);

// Session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

app.use((req, res, next) => {
  Handlebars.registerPartial("fullName", "{{fullName}}");
  Handlebars.registerPartial("avatar", "{{avatar}}");
  Handlebars.registerPartial("role", "{{role}}");
  next();
});

app.use(express.static(path.join(__dirname, "utils")));

app.use((req, res, next) => {
  const homepageWhenNotLoginRoutes = ["/", "/auth/sign-in", "/auth/sign-up"];
  res.locals.isHomepageWhenNotLogin = homepageWhenNotLoginRoutes.includes(
    req.path
  );
  next();
});

// //Http logger
// app.use(morgan('combined'));

//template engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: require("./helpers/handlebars")
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

//Route init
route(app);

//127.0.0.1 localhost
app.listen(port, async () => {
  var server = `http://localhost:${port}`;
  console.log(`App is listening at ${server}`);
});
