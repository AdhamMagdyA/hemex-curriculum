const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().precision(2).positive().required(),
  stockQuantity: Joi.number().integer().min(0).default(0),
  categoryId: Joi.number().integer().positive(),
  sku: Joi.string().allow(null, ''),
  isActive: Joi.boolean().default(true)
});

const updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
  price: Joi.number().precision(2).positive(),
  stockQuantity: Joi.number().integer().min(0),
  categoryId: Joi.number().integer().positive(),
  sku: Joi.string().allow(null, ''),
  isActive: Joi.boolean()
}).min(1);

const toggleProductStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
});

const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name', 'price', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  minPrice: Joi.number().precision(2).positive(),
  maxPrice: Joi.number().precision(2).positive(),
  categoryId: Joi.number().integer().positive(),
  searchTerm: Joi.string().allow('').trim().max(100)
}).with('maxPrice', 'minPrice');

module.exports = {
  createProductSchema,
  updateProductSchema,
  toggleProductStatusSchema,
  productQuerySchema
};
