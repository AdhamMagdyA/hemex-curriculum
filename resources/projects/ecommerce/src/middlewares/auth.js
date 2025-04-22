const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../errors/ApiError');

const auth = (requiredRole) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new ApiError(401, 'Authentication required');
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;

      if (requiredRole && req.user.role !== requiredRole) {
        throw new ApiError(403, 'Insufficient permissions');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = auth;
