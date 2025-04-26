const orderService = require('../services/orderService');
const cartService = require('../services/cartService');
const ApiError = require('../errors/ApiError');
const apiResponse = require('../utils/apiResponse');

class OrderController {
  async checkout(req, res, next) {
    try {
      // Get user's active cart
      const cart = await cartService.getOrCreateCart(req.user.userId);
      
      // Create order from cart
      const order = await orderService.createOrderFromCart(
        req.user.userId, 
        cart.id,
        req.body.shippingAddress
      );
      
      apiResponse(res, 201, true, order, 'Order created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      
      apiResponse(res, 200, true, updatedOrder, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const orders = await orderService.getOrders(req.user.userId);
      apiResponse(res, 200, true, orders, 'Orders retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { OrderController: new OrderController() };
