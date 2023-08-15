const router = require('express').Router();

const passport = require('passport');

router.get('/', passport.checkAuthentication, function(req, res){
    
    return res.render('home');
})


module.exports = router;