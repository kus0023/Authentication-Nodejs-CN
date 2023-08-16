const nodemailer = require('../configs/nodemailer_config');



//EXAMPLE MAILER
exports.exampleMail = async (mailData) => {

    let htmlString = nodemailer.renderTemplate({data: mailData}, 'example.ejs');
    try {
        const res = await nodemailer.transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to: mailData.to,
            subject: 'Example mail',
            html: htmlString

        });
        
        return res;
    } catch (error) {

        console.log("Mail cannot sent", error.toString());
        return false;
    }
}