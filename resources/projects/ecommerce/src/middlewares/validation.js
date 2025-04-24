const { registerSchema, loginSchema } = require('../validations/authValidation');
const { createProductSchema, updateProductSchema, toggleProductStatusSchema, productQuerySchema } = require('../validations/productValidation');
const { createCategorySchema, updateCategorySchema } = require('../validations/categoryValidation');
const ApiError = require('../errors/ApiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }
  next();
};

const validateRegister = validate(registerSchema);
const validateLogin = validate(loginSchema);
const validateCreateProduct = validate(createProductSchema);
const validateUpdateProduct = validate(updateProductSchema);
const validateToggleProductStatus = validate(toggleProductStatusSchema);
const validateCreateCategory = validate(createCategorySchema);
const validateUpdateCategory = validate(updateCategorySchema);
const validateProductQuery = validate(productQuerySchema);

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateProduct,
  validateUpdateProduct,
  validateToggleProductStatus,
  validateCreateCategory,
  validateUpdateCategory,
  validateProductQuery
};
