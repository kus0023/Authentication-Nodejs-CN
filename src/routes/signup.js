const router = require('express').Router();

router.get('/', function(req, res){

    return res.render('signup');
})


module.exports = router;