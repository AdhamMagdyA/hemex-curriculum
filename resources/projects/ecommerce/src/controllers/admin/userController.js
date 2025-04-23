const ApiError = require('../../errors/ApiError');
const userService = require('../../services/userService');
const apiResponse = require('../../utils/apiResponse');

// Admin can list all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    apiResponse(res, 200, true, users, 'Users retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Admin can view any user
const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    apiResponse(res, 200, true, user, 'User retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Admin can update any user
const updateUser = async (req, res, next) => {
  try {
    // Extract update data
    const { 
      email, 
      phone, 
      role,
      firstName, 
      lastName, 
      bio, 
      gender, 
      address, 
      dateOfBirth
    } = req.body;
    console.log(req.body);
    
    // Handle file upload
    const profilePicture = req.file ? 
      `/uploads/profile-pictures/${req.file.filename}` : 
      undefined;
    
    // Update user data
    const updatedUser = await userService.updateUser(req.params.id, { 
      email,
      phone,
      role
    });
    
    // Update profile data
    const updatedProfile = await userService.updateUserProfile(req.params.id, {
      firstName,
      lastName,
      bio,
      gender,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      ...(profilePicture && { profilePicture })
    });
    
    apiResponse(res, 200, true, 
      { ...updatedUser, profile: updatedProfile }, 
      'User updated successfully'
    );
  } catch (err) {
    next(err);
  }
};

// Admin can delete users
const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    apiResponse(res, 200, true, null, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
};
