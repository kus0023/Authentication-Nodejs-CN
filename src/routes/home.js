const router = require('express').Router();

const passport = require('passport');

const User = require('../models/User');

router.get('/', passport.checkAuthentication, function(req, res){

    const {firstName, secondName, email, _id} = req.user;
    
    return res.render('home', {firstName, secondName, email, userid: _id});
})

router.post('/reset-password', passport.checkAuthentication, function(req, res){

    try {
        console.log(req.user);
    } catch (error) {
        
    }

})


module.exports = router;