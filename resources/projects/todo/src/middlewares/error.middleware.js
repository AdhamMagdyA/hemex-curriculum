const { Prisma } = require("@prisma/client");
const { ValidationError } = require("../errors");
const { nodeEnv } = require("../../../ecommerce/src/config");

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // Prisma error handling
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Resource not found" });
  }

  // Handle validation errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Handle other errors
  res.status(500).json({
    message: err.message,
    error: nodeEnv === "development" ? err : undefined,
  });
};

module.exports = errorMiddleware;
