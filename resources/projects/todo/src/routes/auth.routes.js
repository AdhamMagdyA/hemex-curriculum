const express = require('express');
const AuthService = require('../services/auth.service');
const router = express.Router();

// Registration route
router.post('/register', async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
