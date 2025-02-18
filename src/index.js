const path = require("path");
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const methodOverride = require("method-override");
const app = express();
const route = require("./routes");
const db = require("./config/db");
const sortMiddleware = require("./apps/middleware/SortMiddleware");

require("dotenv").config();
const port = process.env.PORT || 3001;

//Connect to DB
db.connect();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//Static file
app.use(express.static(path.join(__dirname, "public")));

//Method override
app.use(methodOverride("_method"));

//Custom middleware
app.use(sortMiddleware);

// //Http logger
// app.use(morgan('combined'));

//template engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: require("./helpers/handlebars"),
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
