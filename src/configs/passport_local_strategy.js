const passport = require('passport');
const User = require('../models/User');

const LocalStrategy = require('passport-local').Strategy;

const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true //It allow us to pass the request object in call back fn in first param.
}, async function (req, email, password, done) {

    try {

        //Find a user and establish the identity
        const user = await User.findOne({ email: email });

        if (!user || user.password != password) {
            console.log("Invalid username/password");
            return done(null, false, {type:'failure', message: "Invalid username/password"});
        }

        req.flash('success', 'Successfully Logged in.');

        user.password = undefined;
        return done(null, user);

    } catch (error) {
        console.log("Error in Passport: ", error);
        return done(error)
    }

});

passport.use(localStrategy);


//serializing the user to decide which key to keep in cookie
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


//deserializing the user from the key in the cookie.

passport.deserializeUser( async function (id, done) {
    try {

        //Find a user and establish the identity
        const user = await User.findById(id);

        if (!user) {
            console.log("Invalid username/password");
            return done(null, false);
        }

        return done(null, user);

    } catch (error) {
        console.log("Error in Passport: ", error);
    }
});


passport.checkAuthentication = function (req, res, next){

    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function (req, res, next){

    if(req.isAuthenticated()){

        res.locals.user = req.user;
        res.locals.user.password = undefined;
    }
    
    return next();
}

passport.checkAlreadyLoggedIn = function (req, res, next){

    if(!req.isAuthenticated()){
        return next();
    }

    return res.redirect('/');
}

passport.logoutUser = function (req, res, next){

    if(req.isAuthenticated()){
       
        req.logout(function(err) {
            if (err) {
                req.flash('failure', 'Logout Attempt failed.');
                return next(err); 
            }
            req.flash('warning', 'Logged out successfully.');
            return res.redirect('/');
          });
    }
}

module.exports = localStrategy;