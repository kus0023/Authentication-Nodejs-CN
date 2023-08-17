const router = require('express').Router();
const { validate, ValidationError, Joi } = require('express-validation');

const signupController = require('../controllers/signup_controller');

router.get('/', signupController.getRegistrationPage);


//For validation of data
const registerValidation = {
    body: Joi.object({
        firstName: Joi.string()
            .not().empty()
            .required(),
        secondName: Joi.string()
            .not().empty()
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(8)
            .max(30)
            .required(),
        confirmPassword: Joi.string()
            .min(8)
            .max(30)
            .required(),
    }),
}

router.post('/',
    validate(registerValidation, {}, { keyByField: true, abortEarly: false }),
    signupController.registerUser);

module.exports = router;