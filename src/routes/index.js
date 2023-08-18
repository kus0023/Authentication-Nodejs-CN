const router = require('express').Router();


router.use('/', require('./home'))

router.use('/signin', require('./signin.js'))

router.use('/signup', require('./signup'))

router.use('/forget-password', require('./forget_password'))

router.use('/logout', require('./signout'))

module.exports = router;