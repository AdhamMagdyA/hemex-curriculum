const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
// const productRoutes = require('./products');

// Mount routes
router.use('/auth', authRoutes);
// router.use('/products', productRoutes);

module.exports = router;
