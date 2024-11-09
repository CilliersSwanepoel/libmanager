const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = (to, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to LibManager',
        text: `Hello ${name},\n\nWelcome to LibManager! We are excited to have you on board.\n\nBest regards,\nLibManager Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const sendFineNotificationEmail = (to, name, fineAmount) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'LibManager Fine Notification',
        text: `Hello ${name},\n\nYou have incurred a fine of R${fineAmount.toFixed(2)}. Please settle your fine at your earliest convenience.\n\nBest regards,\nLibManager Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendWelcomeEmail, sendFineNotificationEmail };