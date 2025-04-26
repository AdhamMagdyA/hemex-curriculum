const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const { validateUpdateOrderStatus, validateCheckoutOrder } = require('../middlewares/validation');

router.post('/checkout', auth(), validateCheckoutOrder,orderController.OrderController.checkout);
router.get('/', auth(), orderController.OrderController.getOrders);
router.patch('/:orderId/status', auth("admin"), validateUpdateOrderStatus, orderController.OrderController.updateStatus);

module.exports = router;
