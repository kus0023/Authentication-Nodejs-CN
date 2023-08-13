const router = require('express').Router();

router.get('/', function(req, res){

    return res.render('forget_password');
})

module.exports = router;