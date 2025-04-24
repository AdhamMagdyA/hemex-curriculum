const Joi = require('joi');

const addItemSchema = Joi.object({
  productId: Joi.number().required(),
  quantity: Joi.number().default(1)
});

const removeItemSchema = Joi.object({
  params: Joi.object({
    productId: Joi.number().required()
  })
});

module.exports = {
  addItemSchema,
  removeItemSchema
};