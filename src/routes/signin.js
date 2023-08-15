const router = require('express').Router();
const passport = require('passport');
const { validate, ValidationError, Joi } = require('express-validation');

router.get('/', function (req, res) {

    return res.render('signin');
})

//For validation of data
const loginValidation = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .regex(/[a-zA-Z0-9]{3,30}/)
            .required(),
    }),
}


router.post('/',
    validate(loginValidation, {}, { keyByField: true, abortEarly: false }),
    passport.authenticate('local', {
        failureRedirect: '/signin', failureFlash: true,
        successRedirect: '/', successFlash: true
    }),
)


module.exports = router;