const router = require('express').Router();

router.get('/', function(req, res){
    return res.redirect('/signin');
})

router.get('/signin', function(req, res){

    return res.render('signin');
})

router.get('/signup', function(req, res){

    return res.render('signup');
})

router.get('/forget-password', function(req, res){

    return res.render('forget_password');
})

module.exports = router;