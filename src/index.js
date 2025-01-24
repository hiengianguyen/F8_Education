const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const app = express();
const port = 3001;
const route = require('./routes');
const db = require('./config/db');

//Connect to DB
db.connect();


app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// //Http logger
// app.use(morgan('combined'));

//template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

route(app);

//127.0.0.1 localhost
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
