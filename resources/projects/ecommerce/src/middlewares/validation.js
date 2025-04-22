const { registerSchema, loginSchema } = require('../validations/authValidation');
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

module.exports = {
  validateRegister,
  validateLogin
};
