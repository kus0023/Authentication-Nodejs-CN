const router = require('express').Router();
const { validate, ValidationError, Joi } = require('express-validation');

const User = require('../models/User');
const { MongooseError } = require('mongoose');

router.get('/', function (req, res) {

    return res.render('signup');
})


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
            .regex(/[a-zA-Z0-9]{3,30}/)
            .required(),
    }),
}

router.post('/',
    validate(registerValidation, {}, { keyByField: true, abortEarly: false }),
    async function (req, res) {

        //Create the user

        //if success then send to login page with success
        //if failure then send back with error

        const { firstName, secondName, email, password } = req.body;

        try {
            const userDoc = await User.create({ firstName, secondName, email, password });
            req.flash('message_flash', {
                type: 'success',
                message: 'Registration completed for email: '+email
            });
            return res.redirect('/signin');

        } catch (error) {

            //Handling for any conflicts
            if (error instanceof MongooseError) {
                console.log(error.message);

                req.flash('message_flash', {
                    type: 'faliure',
                    message: error.message
                });

                return res.redirect('back')
            }

            console.log(error);

            req.flash('message_flash', {
                type: 'faliure',
                message: 'Something went wrong'
            });

            return res.redirect('back')

        }
    })

module.exports = router;