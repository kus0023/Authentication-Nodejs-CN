const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.checkAuthentication,function(req, res){
    req.logOut();
    req.flash('message_flash', {type: 'success', message: 'Logged out'})
    return res.redirect('/signin');
});

module.exports = router;