const router = require('express').Router();
const passport = require('passport');

router.get('/', function(req, res){

    return res.render('signin');
})

router.post('/', passport.authenticate('local', { failureRedirect: '/signin' }), function(req, res){

    return res.render('home', {userid: req.user.id});
})


module.exports = router;