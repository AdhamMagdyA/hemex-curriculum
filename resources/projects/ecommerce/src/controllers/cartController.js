const cartService = require('../services/cartService');
const apiResponse = require('../utils/apiResponse');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await cartService.getOrCreateCart(req.user.userId);
      apiResponse(res, 200, true, cart, 'Cart retrieved');
    } catch (error) {
      apiResponse(res, 500, false, null, error.message);
    }
  }

  async addItem(req, res) {
    try {
      const item = await cartService.addItem(
        req.user.userId,
        req.body.productId,
        req.body.quantity
      );
      apiResponse(res, 200, true, item, 'Item added to cart');
    } catch (error) {
      apiResponse(res, 500, false, null, error.message);
    }
  }

  async removeItem(req, res) {
    try {
      await cartService.removeItem(req.user.userId, parseInt(req.params.productId));
      apiResponse(res, 200, true, null, 'Item removed from cart');
    } catch (error) {
      apiResponse(res, 500, false, null, error.message);
    }
  }

  async clearCart(req, res) {
    try {
      await cartService.clearCart(req.user.userId);
      apiResponse(res, 200, true, null, 'Cart cleared');
    } catch (error) {
      apiResponse(res, 500, false, null, error.message);
    }
  }
}

module.exports = new CartController();
