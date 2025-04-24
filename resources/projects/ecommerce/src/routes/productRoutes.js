const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProductQuery } = require('../middlewares/validation');

// Public routes
router.get('/', validateProductQuery, productController.getAllProducts);
router.get('/:id', productController.getProduct);

module.exports = router;
