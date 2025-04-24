const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../errors/ApiError');
const apiResponse = require('../utils/apiResponse');
const userService = require('../services/userService');
const emailService = require('../services/emailService');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

const register = async (req, res, next) => {
  try {
    const existingUser = await userService.findUserByEmail(req.body.email);
    
    if (existingUser) {
      if (!existingUser.isVerified) {
        const verificationToken = jwt.sign(
          { userId: existingUser.id },
          config.jwtSecret,
          { expiresIn: '1d' }
        );
        
        await emailService.sendVerificationEmail(existingUser.email, verificationToken);
        return apiResponse(res, 200, true, null, 'Verification email resent. Please check your email.');
      }
      throw new ApiError(400, 'Email already exists');
    }
    
    const user = await userService.createUser(req.body);
    
    const verificationToken = jwt.sign(
      { userId: user.id },
      config.jwtSecret,
      { expiresIn: '1d' }
    );
    
    await emailService.sendVerificationEmail(user.email, verificationToken);
    
    apiResponse(res, 201, true, { id: user.id }, 'User registered successfully. Please check your email for verification.');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    if (!user.isVerified) {
      throw new ApiError(403, 'Please verify your email first');
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    
    apiResponse(res, 200, true, { token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Update user verification status
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isVerified: true }
    });
    
    res.sendFile(path.join(__dirname, '../templates/email-verified.html'));
  } catch (err) {
    res.sendFile(path.join(__dirname, '../templates/verification-error.html'));
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Generate OTP and secret
    const { otp, secret } = await userService.generateResetOTP(email);
    if (!otp) throw new ApiError(404, 'User not found');
    
    // Send OTP via email
    await emailService.sendPasswordResetOTP(email, otp);
    
    // Return secret to client (should be stored temporarily in frontend)
    apiResponse(res, 200, true, { secret }, 'OTP sent to email');
  } catch (err) {
    next(err);
  }
};

const verifyPasswordResetOTP = async (req, res, next) => {
  try {
    const { email, otp, secret } = req.body;
    
    // Verify OTP
    await userService.verifyResetOTP(email, secret, otp);
    
    // Return success if OTP is valid
    apiResponse(res, 200, true, null, 'OTP verified successfully');
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    
    // This checks the verification status in the database
    await userService.updatePassword(email, newPassword);
    
    apiResponse(res, 200, true, null, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword
};
