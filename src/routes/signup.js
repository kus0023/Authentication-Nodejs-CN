const router = require('express').Router();

router.get('/', function(req, res){

    return res.render('signup');
})


router.post('/', function(req, res){
    const {name, email, password} = req.body;

    name = name.trim();
    email = email.trim();

    if(! (name && email && password)) {
        console.log('insufficient Data sent');

        res.log.error = true;
        res.log.error_message = 'Name, email, password is required field.'

        return res.render('signin', {
            error_message: 'Name, email, password is required field.'
        });
    }
})

module.exports = router;