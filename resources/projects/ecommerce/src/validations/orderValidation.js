const Joi = require('joi');

const checkoutSchema = Joi.object({
  shippingAddress: Joi.string().trim().required().messages({
    'string.empty': 'Shipping address is required',
    'any.required': 'Shipping address is required'
  })
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
    .required()
});

module.exports = {
  checkoutSchema,
  updateStatusSchema
};
