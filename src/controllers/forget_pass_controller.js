const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const authMailer = require('../mailers/auth_mailer');

const queue = require('../configs/kue_config');
require('../delayed_jobs/mail.worker');

exports.forgetPasswordPost = async function (req, res) {

    //create a token with short expiry and send mail
    //notify user to check mail and reset the password.
    //In any case redirect back to login page.

    const email = req.body.email;

    try {

        const userDoc = await User.findOne({ email });
        if (!userDoc) {

            req.flash('message_flash', {
                type: 'failure',
                message: 'Account not found with this email: ' + email,
            });

            return res.redirect('back');
        }

        //If email is not verified then notify user to first verify the email.
        if(!userDoc.emailVerified){
            req.flash('message_flash', {
                type: 'failure',
                message: 'Please verify your email first. Link shared over email.',
            });

            return res.redirect('back');
        }

        const token = jwt.sign({
            email
        }, process.env.JWT_SECRET, { algorithm: 'HS512', expiresIn: "5 minutes" });

        const fullUrl = `${req.protocol}://${req.headers.host}/forget-password/reset?token=${token}`

        //send mail with request URL
        let job = queue.create('forget password emails', {
            to: email,
            resetUrl: fullUrl
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
            message: 'Mail sent with password reset link. Please check your email',
            delay: 30000
        });



        return res.redirect('/signin');

    } catch (error) {

        console.log(error);

        req.flash('message_flash', {
            type: 'failure',
            message: 'Something went wrong. Please try again later',
            delay: 30000
        });

        return res.redirect('/signin');

    }

}


exports.getResetForm = async function (req, res) {

    //check if link is expired by checking JWT token
    //if good then render form to update password
    //otherwise send json response with error detail.

    try {

        const { token } = req.query;

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        let email = payload.email;

        return res.render('reset_password', { token });

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.log("Reset Token has expired.");

            return res.status(400).json({
                message: "Link is expired."
            })
        }

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }

}

exports.resetPasswordPost = async function (req, res) {
    //first check for token expiry
    //if not exipered then extract the email and update the user's password.
    //also check for password and confirmPassword
    //check if password and confirm password is same
    if (req.body.password != req.body.confirmPassword) {

        req.flash('message_flash', { type: 'failure', message: 'Password is not matching.', delay: 20000 });
        return res.redirect('back');
    }



    try {

        const { token, password } = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        let email = payload.email;

        const userDoc = await User.findOne({ email });

        if (!userDoc) {

            req.flash('message_flash', {
                type: 'failure',
                message: 'Account not found with this email: ' + email,
            });

            return res.redirect('back');
        }

        userDoc.password = password;

        await userDoc.save();

        req.flash('message_flash', {
            type: 'success',
            message: 'Password changed successfully.',
        });

        //send a mail to user after changing the password
        let job = queue.create('password reset emails', {
            to: email,
            firstName: userDoc.firstName
        }).save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(job.id, "Created in queue", queue.name);
            }
        });

        return res.redirect('/signin');

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.log("Reset Token has expired.");

            return res.status(400).json({
                message: "Link is expired."
            })
        }

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}