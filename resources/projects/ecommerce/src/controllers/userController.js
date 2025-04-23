const ApiError = require('../errors/ApiError');
const userService = require('../services/userService');
const apiResponse = require('../utils/apiResponse');

// User can view their own profile
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    if (!user) throw new ApiError(404, 'User not found');
    apiResponse(res, 200, true, user, 'Profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// User can update their own profile
const updateProfile = async (req, res, next) => {
  try {
    // Extract update data
    const { 
      phone, 
      firstName, 
      lastName, 
      bio, 
      gender, 
      address, 
      dateOfBirth
    } = req.body;
    
    // Handle file upload
    const profilePicture = req.file ? 
      `/uploads/profile-pictures/${req.file.filename}` : 
      undefined;
    
    // Update user data (phone only)
    const updatedUser = await userService.updateUser(req.user.userId, { 
      phone
    });
    
    // Update profile data
    const updatedProfile = await userService.updateUserProfile(req.user.userId, {
      firstName,
      lastName,
      bio,
      gender,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      ...(profilePicture && { profilePicture }) // Only include if file was uploaded
    });
    
    apiResponse(res, 200, true, 
      { ...updatedUser, profile: updatedProfile }, 
      'Profile updated successfully'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
