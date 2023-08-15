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

/*********************Google Authentication*************************/
//User will call it.
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));


//Google will call it
router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/signin', failureFlash: true,
        successFlash: true
    }),
    function (request, response) {
        // Successful authentication, redirect home.

        response.redirect('/');
    });

module.exports = router;