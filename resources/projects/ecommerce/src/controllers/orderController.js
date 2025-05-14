const orderService = require('../services/orderService');
const cartService = require('../services/cartService');
const ApiError = require('../errors/ApiError');
const apiResponse = require('../utils/apiResponse');
const paymentService = require('../services/paymentService');

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
      
      // Create a checkout session
      const session = await paymentService.createCheckoutSession(order.id);
      
      return apiResponse(res, 200, true, session, 'Checkout session created successfully');
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

  async payOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      
      const order = await orderService.getOrderById(orderId);
      if (order.status !== 'PENDING') {
        return apiResponse(res, 400, false, null, 'Order status must be PENDING to pay');
      }

      // Create a checkout session
      const session = await paymentService.createCheckoutSession(orderId);
      
      return apiResponse(res, 200, true, session, 'Checkout session created successfully');
    } catch (error) {
      next(error);
    }
  }

}

module.exports = { OrderController: new OrderController() };
