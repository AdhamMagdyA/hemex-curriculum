const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/uploadMiddleware');

// Admin protected routes
router.get('/users', auth('admin'), userController.getAllUsers);
router.get('/users/:id', auth('admin'), userController.getUser);
router.put('/users/:id', 
  auth('admin'), 
  upload, // handles file upload
  express.urlencoded({ extended: true }), // parses form-data fields
  userController.updateUser
);
router.delete('/users/:id', auth('admin'), userController.deleteUser);

module.exports = router;
