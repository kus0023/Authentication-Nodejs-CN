const router = require('express').Router();
const passport = require('passport');
const signoutController = require('../controllers/signout_controller');

router.get('/', passport.checkAuthentication, signoutController.signout);

module.exports = router;