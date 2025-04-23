const ApiError = require('../errors/ApiError');
const prisma = require('../prisma');
const { apiResponse } = require('../helpers');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads/profiles');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveProfilePicture = async (file) => {
  const ext = path.extname(file.originalname);
  const filename = `profile_${Date.now()}${ext}`;
  const filepath = path.join(uploadDir, filename);
  
  await fs.promises.writeFile(filepath, file.buffer);
  return `/uploads/profiles/${filename}`;
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });
    
    if (!profile) throw new ApiError(404, 'Profile not found');
    apiResponse(res, 200, true, profile, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { bio, gender, address, dateOfBirth } = req.body;
    let profilePicture;
    
    if (req.file) {
      profilePicture = await saveProfilePicture(req.file);
    }
    
    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user.id },
      update: { 
        bio, 
        gender, 
        address, 
        dateOfBirth,
        ...(profilePicture && { profilePicture })
      },
      create: {
        bio,
        gender,
        address,
        dateOfBirth,
        ...(profilePicture && { profilePicture }),
        userId: req.user.id
      }
    });
    
    apiResponse(res, 200, true, profile, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
