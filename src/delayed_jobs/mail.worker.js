const {accountCreatedMail, forgetPasswordMail, passwordResetMail} = require('../mailers/auth_mailer');

const queue = require('../configs/kue_config');

//mail with account acitivation
queue.process('account created emails', 3, async function(job, done){
    console.log(job.id, 'Processing of ', queue.name);
    const mailRes = await accountCreatedMail(job.data);
    
    console.log(job.id, "Completed of ", queue.name);
    
    done();
});

//mail with link to reset the password
queue.process('forget password emails', 4, async function(job, done){
    console.log(job.id, 'Processing of ', queue.name);
    const mailRes = await forgetPasswordMail(job.data);
    
    console.log(job.id, "Completed of ", queue.name);
    
});

//for confirmation that password is changed successfully.
queue.process('password reset emails', 3, async function(job, done){
    console.log(job.id, 'Processing of ', queue.name);
    const mailRes = await passwordResetMail(job.data);
    
    console.log(job.id, "Completed of ", queue.name);
    
    done();
});