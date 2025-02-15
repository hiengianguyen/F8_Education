const path = require("path");
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const methodOverride = require('method-override')
const app = express();
const port = 3001;
const route = require("./routes");
const db = require("./config/db");
const SortMiddleware = require("./apps/middleware/SortMiddleware");
// const { exec } = require('child_process');

//Connect to DB
db.connect();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride('_method'))

app.use(SortMiddleware);

// //Http logger
// app.use(morgan('combined'));

//template engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : "default";
        const icons = {
          default: "fa-solid fa-sort",
          asc: "fa-solid fa-arrow-down-wide-short",
          desc: "fa-solid fa-arrow-down-short-wide",
        };
        const types = {
          default: "desc",
          asc: "desc",
          desc: "asc",
        };
        const icon = icons[sortType];
        const type = types[sortType];

        return `<a href="?_sort&column=${field}&type=${type}">
        <span class="${icon}"></span>
        </a>`;

        
    },
  }
})

);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

route(app);

//127.0.0.1 localhost
app.listen(port, async() =>
  {
      var server = `http://localhost:${port}`;
      console.log(`App is listening at ${server}`);
      // exec(`start ${server}`);
  }
);
