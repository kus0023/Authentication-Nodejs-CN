const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');
const { validate, ValidationError, Joi } = require('express-validation');
const jwt = require('jsonwebtoken');

router.get('/', passport.checkAuthentication, function (req, res) {

    const { firstName, secondName, email, _id } = req.user;

    return res.render('home', { firstName, secondName, email, userid: _id });
});

router.get('/verify', function (req, res) {

    return res.render('verify_account')
})

router.get('/verify_account', async function (req, res) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            message: 'Token is not present.'
        });
    }

    try {

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const userDoc = await User.findOne({ email: payload.email });

        if (userDoc) {
            
            await userDoc.updateOne({emailVerified: true});
            return res.status(200).json({ message: "Account verify successfully." })
        } else {
            return res.status(404).json({ message: "Account not found" })
        }

    } catch (error) {
        console.log(error.toString());
        return res.status(500).json({ message: 'Internal server error. Try again later.' })
    }

})

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
    async function (req, res) {

        const { existing_password, new_password, confirm_password } = req.body;

        //Check if new password and confirm password same
        if (new_password != confirm_password) {
            req.flash('message_flash', { type: 'failure', message: 'Password is not matching.', delay: 20000 });
            return res.redirect('back');
        }


        try {
            const userDoc = await User.findById(req.user._id);


            if (userDoc) {

                //check the old password first
                if (!User.isValid(existing_password, userDoc)) {
                    req.flash('message_flash', { type: 'failure', message: 'Incorrect Password', delay: 10000 });
                    return res.redirect('back');
                }

                //check if password is same of new and old one 
                if (User.isValid(new_password, userDoc)) {
                    req.flash('message_flash', { type: 'failure', message: 'New and old password can\'t be same.', delay: 10000 });
                    return res.redirect('back');
                }


                userDoc.password = new_password;
                await userDoc.save();

            }

            req.flash('message_flash', { type: 'success', message: 'Password changed successfully.' });

            return res.redirect('back');
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