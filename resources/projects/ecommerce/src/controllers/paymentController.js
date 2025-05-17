const PaymentService = require('../services/paymentService');
const apiResponse = require('../utils/apiResponse');

const paymentController = {
  webhook: async (req, res) => {
    try {
      const result = await PaymentService.handleWebhook(req);
      return apiResponse(res, 200, true, result, 'Webhook processed successfully');
    } catch (error) {
      console.error('Webhook error:', error);
      return apiResponse(res, 400, false, null, 'Error processing webhook');
    }
  }
};

module.exports = paymentController;
