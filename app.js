const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { validate, ValidationError, Joi } = require('express-validation');

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
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

//flash messages
app.use(flash());
app.use(require('./src/configs/midlewares').flashMiddleware);

//Initialize all the strategy of passport
passport.use(require('./src/configs/passport_local_strategy'));
app.use(passport.initialize());
app.use(passport.session());

//setting up the user in req if authenticated.
app.use(passport.setAuthenticatedUser)



//EJS config
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "src", "views"));

//Serving static files
app.use(express.static('./src/static'))

app.use('/', require('./src/routes'));


//Global validation error handler function.
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {

        err.details.body.forEach(field => {
            req.flash('message_flash', { type: 'failure', message: field.message, delay: 30000 });
        })
        return res.redirect('back')
    }

    // console.log(typeof err, err);
   req.flash('message_flash', { type: 'failure', message: 'Something went wrong.'});
        
    return res.redirect('back');
})

app.listen(PORT, () => {
    console.log("Server started on Port:", PORT);
});

