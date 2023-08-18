const authMailer = require('../mailers/auth_mailer');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { MongooseError } = require('mongoose');

const queue = require('../configs/kue_config');
require('../delayed_jobs/mail.worker');

exports.getRegistrationPage = function (req, res) {

    return res.render('signup');
}

exports.registerUser = async function (req, res) {

    //check if password and confirm password is same
    if(req.body.password != req.body.confirmPassword){

        req.flash('message_flash', { type: 'failure', message: 'Password is not matching.', delay: 20000 });
        return res.redirect('back');
    }

    //Create the user

    //if success then send to login page with success
    //if failure then send back with error

    const { firstName, secondName, email, password } = req.body;

    try {
        //send a confirmation mail with token to verify account
        const token = jwt.sign({
            email
        }, process.env.JWT_SECRET, {algorithm: 'HS512', expiresIn: "100d"});

        const fullUrl = `${req.protocol}://${req.headers.host}/verify_account?token=${token}`

        const userDoc = await User.create({ firstName, secondName, email, password });
        
        //Send mail with link to activate the account
        let job = queue.create('account created emails', {
            to: email,
            firstName: userDoc.firstName,
            verificationUrl: fullUrl
        }).save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(job.id, "Created in queue", queue.name);
            }
        });

        req.flash('message_flash', {
            type: 'success',
            message: 'Mail sent. Please verify your account',
            delay: 30000
        });

        req.flash('message_flash', {
            type: 'success',
            message: 'Registration completed for email: ' + email
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
}