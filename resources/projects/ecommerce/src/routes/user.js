const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const uploadProfilePicture = require('../middlewares/uploadMiddleware');

// User profile routes
router.get('/profile', auth(), userController.getProfile);
router.put('/profile', auth(), uploadProfilePicture, userController.updateProfile);

module.exports = router;
