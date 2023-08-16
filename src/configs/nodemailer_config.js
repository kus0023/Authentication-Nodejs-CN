const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_ACCOUNT,
      pass: process.env.NODEMAILER_PASS
    }
  });

let renderTemplate = (data, relativePath)=>{

    let mailHtml;

    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log('error in rendering: ', err);
                return;
            }

            mailHtml = template;
        }
    )

    return mailHtml;
}

module.exports = {
    transporter,
    renderTemplate
}