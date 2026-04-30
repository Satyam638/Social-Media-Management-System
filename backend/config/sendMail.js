const nodemailer = require('nodemailer');
require('dotenv').config();


console.log("EMAIL:", process.env.ADMIN_EMAIL);
console.log("PASS:", process.env.ADMIN_PASS);

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS
    }
}
)

const sendMail = async (toEmail, subject, text) => {

    try {
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: toEmail,
            subject: subject,
            text
        }
        await transport.sendMail(mailOptions);

        console.log('Email Sent to User');
    }
    catch (error) {
        console.log("Something Wrong", error);
    }
}

module.exports = sendMail;