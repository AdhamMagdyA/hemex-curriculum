const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${config.baseUrl}/auth/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: config.emailFrom,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Our E-Commerce Platform</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `
  });
};

const sendPasswordResetOTP = async (email, otp) => {
  await transporter.sendMail({
    from: config.emailFrom,
    to: email,
    subject: 'Your Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Your one-time password (OTP) for resetting your password is:</p>
        <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${otp}</div>
        <p>This OTP is valid for 5 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetOTP
};
