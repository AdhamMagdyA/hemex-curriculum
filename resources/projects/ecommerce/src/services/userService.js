const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../errors/ApiError');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

const createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        isVerified: false,
        roleId: userData.roleId || 2
      }
    });
    
    return user;
  } catch (err) {
    console.error('User creation error:', err);
    
    // Handle Prisma unique constraint violation (duplicate email)
    if (err.code === 'P2002') {
      throw new ApiError(400, 'Email already exists');
    }
    
    throw new ApiError(500, 'User creation failed', false, err.stack);
  }
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

const generateResetOTP = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) return null;
  
  // Generate time-based OTP (valid for 5 minutes)
  const secret = speakeasy.generateSecret({ length: 20 });
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    step: 300 // 5 minutes
  });
  
  // Return both OTP and secret (secret should be sent to client securely)
  return { otp, secret: secret.base32 };
};

const verifyResetOTP = async (email, secret, otp) => {
  const isValid = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: otp,
    step: 300,
    window: 1
  });

  if (!isValid) throw new ApiError(400, 'Invalid or expired OTP');
  
  // Mark email as verified for password reset
  await prisma.user.update({
    where: { email },
    data: {
      resetVerified: true,
      resetVerifiedExpiry: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    }
  });
  
  return true;
};

const updatePassword = async (email, newPassword) => {
  // Check if reset was verified within timeframe
  const user = await prisma.user.findFirst({
    where: {
      email,
      resetVerified: true,
      resetVerifiedExpiry: { gte: new Date() }
    }
  });

  if (!user) throw new ApiError(400, 'Password reset not verified or expired');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { email },
    data: { 
      password: hashedPassword,
      resetVerified: false,
      resetVerifiedExpiry: null
    }
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  generateResetOTP,
  verifyResetOTP,
  updatePassword
};
