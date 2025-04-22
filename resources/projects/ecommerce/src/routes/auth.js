const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validation');

// Authentication routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/verify-email', authController.verifyEmail);

// Password reset routes
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/verify-reset-otp', authController.verifyPasswordResetOTP);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
