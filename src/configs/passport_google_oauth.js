let GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User');

const googleAuth = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/signin/auth/google/callback",
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, cb) {

    let googleRes = profile._json;

    let googleUser = {
        email: googleRes.email,
        password: googleRes.sub,
        emailVerified: googleRes.email_verified,
        firstName: googleRes.given_name,
        secondName: googleRes.family_name
    };

    try {
        
        let userDoc = await User.findOne({email: googleUser.email});
        
        if(!userDoc){
            //then create
            console.log('User not found creating the new user');
            userDoc = await User.create(googleUser);
            console.log('user created successfully.');
        }
        req.flash('message_flash', {type: 'success', message: 'Google login success'});

        cb(null, userDoc);
    } catch (error) {
        console.log(error);
        req.flash('message_flash', {type: 'failure', message: 'Google login attempt failed.'});

        cb(null, false);
    }

  }
);

//serializing the user to decide which key to keep in cookie
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


//deserializing the user from the key in the cookie.

passport.deserializeUser(async function (id, done) {
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


module.exports = googleAuth;