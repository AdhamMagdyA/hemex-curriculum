const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required()
});

const updateCategorySchema = Joi.object({
  name: Joi.string(),
  slug: Joi.string()
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema
};
