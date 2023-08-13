const router = require('express').Router();

router.get('/', function(req, res){

    return res.render('home');
})


module.exports = router;