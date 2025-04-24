const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');
const { validateAddItem, validateRemoveItem } = require('../middlewares/validation');

router.get('/', auth(), cartController.getCart);
router.post('/items', auth(), validateAddItem, cartController.addItem);
router.delete('/items/:productId', auth(), validateRemoveItem, cartController.removeItem);
router.delete('/', auth(), cartController.clearCart);

module.exports = router;
