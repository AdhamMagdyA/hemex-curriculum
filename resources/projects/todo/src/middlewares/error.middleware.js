const { Prisma } = require('@prisma/client');
const { ValidationError } = require('../errors');

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // Prisma error handling
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Resource not found' });
  }

  // Handle validation errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ 
      message: err.message 
    });
  }

  // Handle other errors
  res.status(500).json({ 
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorMiddleware;