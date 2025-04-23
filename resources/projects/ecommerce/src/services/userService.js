const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../errors/ApiError');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  return await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      isVerified: false,
      roleId: userData.roleId || 2,
      profile: {
        create: {
          firstName: userData.profile.firstName,
          lastName: userData.profile.lastName,
          bio: userData.profile.bio || null,
          gender: userData.profile.gender || null,
          address: userData.profile.address || null,
          dateOfBirth: userData.profile.dateOfBirth || null
        }
      }
    },
    include: {
      profile: true
    }
  });
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

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      isVerified: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          bio: true,
          gender: true,
          address: true,
          dateOfBirth: true,
          profilePicture: true
        }
      }
    }
  });
};

const getUserById = async (id) => {
  if (!id) throw new Error('User ID is required');
  
  return await prisma.user.findUnique({
    where: { 
      id: Number(id) 
    },
    include: { 
      role: true, 
      profile: true 
    }
  });
};

const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data,
    include: { profile: true }
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: Number(id) }
  });
};

const updateUserProfile = async (userId, profileData) => {
  return await prisma.userProfile.update({
    where: { userId: Number(userId) },
    data: {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      bio: profileData.bio,
      gender: profileData.gender,
      address: profileData.address,
      dateOfBirth: profileData.dateOfBirth,
      profilePicture: profileData.profilePicture
    }
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  generateResetOTP,
  verifyResetOTP,
  updatePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile
};
