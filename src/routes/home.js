const router = require('express').Router();
const passport = require('passport');
const { validate, ValidationError, Joi } = require('express-validation');

const homeController = require('../controllers/home_controller');

router.get('/', passport.checkAuthentication, homeController.getHomePage);

router.get('/verify', homeController.getVerifyAccountPage);

router.get('/verify_account', homeController.verifyAccountFromMail);

const resetPasswordValidate = {
    body: Joi.object({
        existing_password: Joi.string()
            .required(),
        new_password: Joi.string()
            .min(8)
            .max(30)
            .required(),
        confirm_password: Joi.string()
            .min(8)
            .max(30)
            .required(),
    }),
}

router.post('/reset-password',
    validate(resetPasswordValidate, {}, { keyByField: true, abortEarly: false }),
    passport.checkAuthentication,
    homeController.resetPasswordFromHome);


module.exports = router;