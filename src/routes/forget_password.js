const router = require('express').Router();
const { validate, ValidationError, Joi } = require('express-validation');

const forgetPasswordController = require('../controllers/forget_pass_controller');

router.get('/', function (req, res) {
    return res.render('forget_password');
})

const forgetPasswordValidation = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
    })
}

router.post('/',
    validate(forgetPasswordValidation, {}, { keyByField: true, abortEarly: false }),
    forgetPasswordController.forgetPasswordPost);


//This will be sent to mail
//user will click on link to reset the password
router.get('/reset', forgetPasswordController.getResetForm);


const resetValidation = {
    body: Joi.object({
        password: Joi.string()
            .required(),
        confirmPassword: Joi.string()
            .min(8)
            .max(30)
            .required(),
        token: Joi.string()
            .required(),
    }),
}
//This will be reset form
router.post('/reset',
    validate(resetValidation, {}, { keyByField: true, abortEarly: false }),
    forgetPasswordController.resetPasswordPost);

module.exports = router;