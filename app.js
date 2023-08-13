const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');

require('dotenv').config()

//Connect to db first
const db = require('./src/configs/mongodb');


const PORT = 8000;
const app = express();



// app.use(require('serve-static')(__dirname + '/../../public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRETE,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

//Initialize all the strategy of passport
passport.use(require('./src/configs/passport_local_strategy'));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "src", "views"));

app.use('/', require('./src/routes'));

app.listen(PORT, () => {
    console.log("Server started on Port:", PORT);
});
