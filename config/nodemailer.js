
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendVerificationEmail(email, link) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Verification',
    html: `<p>Click <a href="${link}">here</a> to verify your account.</p>`,
  }, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
function sendOTPEmail(email, otp) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'One-Time Password (OTP) for Password Reset',
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  }, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  transporter,
  sendVerificationEmail,
  sendOTPEmail
};
